from contextlib import asynccontextmanager
from datetime import timedelta
from hashlib import sha256
import secrets
from typing import Annotated

from fastapi import BackgroundTasks, Depends, FastAPI, HTTPException, Query, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlmodel import Session, select

from .config import Settings
from .ai import PortfolioAssistant
from .turns import run_turn
from .throttle import IPThrottle
from .database import create_database_engine, initialize_database
from .models import Chat, ChatSummary, ChatDigest, Enquiry, Message, VisitorSession, utcnow
from .enquiries import summarize_chat, deliver_enquiry, email_ready, resume_outbox, process_idle_chat
from .schemas import EnquiryInput, EnquiryStatus
from .schemas import ChatInput, ChatRead, MessageInput, MessagePage, MessageRead, SessionCreated, SessionRead, TurnInput, TurnRead

bearer = HTTPBearer(auto_error=False)


def get_db(request: Request):
    with Session(request.app.state.engine) as db:
        yield db


Db = Annotated[Session, Depends(get_db)]


def current_session(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)],
    db: Db,
) -> VisitorSession:
    session = None
    if credentials:
        digest = sha256(credentials.credentials.encode()).hexdigest()
        session = db.exec(select(VisitorSession).where(VisitorSession.token_hash == digest)).first()
    if session is None or session.expires_at <= utcnow():
        raise HTTPException(401, "Missing, invalid, or expired session token", headers={"WWW-Authenticate": "Bearer"})
    return session


Visitor = Annotated[VisitorSession, Depends(current_session)]


def owned_chat(chat_id: str, visitor: VisitorSession, db: Session) -> Chat:
    chat = db.exec(select(Chat).where(Chat.id == chat_id, Chat.session_id == visitor.id)).first()
    if chat is None:
        raise HTTPException(404, "Conversation not found")
    return chat


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or Settings()
    engine = create_database_engine(settings)
    assistant = PortfolioAssistant(settings)
    throttle = IPThrottle(engine, settings)

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        initialize_database(engine)
        from starlette.concurrency import run_in_threadpool
        await run_in_threadpool(resume_outbox, engine, settings)
        import asyncio
        stop = asyncio.Event()
        async def digest_worker():
            while not stop.is_set():
                try:
                    await asyncio.wait_for(stop.wait(), timeout=60)
                except TimeoutError:
                    try:
                        await run_in_threadpool(process_idle_chat, engine, settings, app.state.assistant)
                    except Exception:
                        # Keep maintenance alive without logging visitor content or provider errors.
                        import logging
                        logging.getLogger(__name__).warning("Chat digest maintenance failed; retrying later")
        worker = asyncio.create_task(digest_worker())
        yield
        stop.set()
        await worker
        assistant.close()
        engine.dispose()

    app = FastAPI(
        title="Portfolio Chat API", version="0.1.0", lifespan=lifespan,
        description="Private visitor sessions, chat history, and portfolio-grounded AI replies. All timestamps are UTC.",
    )
    app.state.engine = engine
    app.state.assistant = assistant

    def require_admin(credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)]):
        expected = settings.admin_token
        if not expected or not credentials or not secrets.compare_digest(
            credentials.credentials, expected.get_secret_value()
        ):
            raise HTTPException(401, "Owner access required", headers={"WWW-Authenticate": "Bearer"})

    admin_access = [Depends(require_admin)]
    app.add_middleware(
        CORSMiddleware, allow_origins=settings.cors_origins,
        allow_methods=["GET", "POST", "PATCH", "DELETE"],
        allow_headers=["Authorization", "Content-Type"],
    )

    @app.middleware("http")
    async def private_responses(request: Request, call_next):
        if request.url.path.startswith("/api/") and request.method != "OPTIONS":
            from starlette.concurrency import run_in_threadpool
            retry = await run_in_threadpool(throttle.check, request)
            if retry:
                from fastapi.responses import JSONResponse
                headers = {"Retry-After": str(retry), "Cache-Control": "no-store"}
                origin = request.headers.get("origin")
                if origin in settings.cors_origins:
                    headers.update({"Access-Control-Allow-Origin": origin,
                        "Access-Control-Expose-Headers": "Retry-After", "Vary": "Origin"})
                return JSONResponse(status_code=429,
                    content={"detail": f"Too many requests from your network. Try again in {retry} seconds."},
                    headers=headers)
        response = await call_next(request)
        if request.url.path.startswith("/api/"):
            response.headers["Cache-Control"] = "no-store"
        return response

    @app.get("/health", tags=["Health"])
    def health(db: Db):
        db.exec(select(VisitorSession.id).limit(1)).all()
        return {"status": "ok", "database": "sqlite"}

    @app.get("/api/assistant", tags=["Assistant"])
    def assistant_status(request: Request):
        return {"ready": request.app.state.assistant.ready}

    @app.post("/api/chats/{chat_id}/summary", tags=["Enquiries"])
    def prepare_brief(chat_id: str, visitor: Visitor, db: Db, request: Request):
        return summarize_chat(owned_chat(chat_id, visitor, db), db, request.app.state.assistant)

    @app.post("/api/chats/{chat_id}/brief-readiness", tags=["Enquiries"])
    def check_brief_readiness(chat_id: str, visitor: Visitor, db: Db, request: Request):
        from .brief_readiness import brief_ready
        chat = owned_chat(chat_id, visitor, db)
        if db.exec(select(Enquiry.id).where(Enquiry.chat_id == chat_id)).first():
            return {"ready": False}
        rows = db.exec(select(Message).where(Message.chat_id == chat_id, Message.role == "user")
                       .order_by(Message.id.desc()).limit(40)).all()
        if not brief_ready([row.content for row in reversed(rows)]):
            return {"ready": False}
        summary = summarize_chat(chat, db, request.app.state.assistant)
        # The summarizer independently rejects informational-only conversations.
        if "no project requested" in summary["content"].lower():
            return {"ready": False}
        return {"ready": True, **summary}

    @app.post("/api/chats/{chat_id}/enquiry", tags=["Enquiries"])
    def submit_enquiry(chat_id: str, payload: EnquiryInput, visitor: Visitor, db: Db, tasks: BackgroundTasks):
        owned_chat(chat_id, visitor, db)
        existing = db.exec(select(Enquiry).where(Enquiry.chat_id == chat_id)).first()
        if existing:
            return {"id": existing.id, "status": "saved"}
        # One enquiry per conversation; repeated submission is safe.
        enquiry = Enquiry(chat_id=chat_id, name=payload.name, email=payload.email, brief=payload.brief)
        db.add(enquiry)
        from sqlalchemy.exc import IntegrityError
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
            existing = db.exec(select(Enquiry).where(Enquiry.chat_id == chat_id)).first()
            if existing:
                return {"id": existing.id, "status": "saved"}
            raise
        db.refresh(enquiry)
        tasks.add_task(deliver_enquiry, engine, settings, enquiry.id)
        return {"id": enquiry.id, "status": "saved"}

    @app.get("/api/admin/conversations", dependencies=admin_access, tags=["Owner"])
    def owner_conversations(db: Db, offset: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=100)):
        from sqlalchemy import func
        chats = db.exec(select(Chat).order_by(Chat.updated_at.desc(), Chat.id).offset(offset).limit(limit)).all()
        items = []
        for chat in chats:
            enquiry = db.exec(select(Enquiry).where(Enquiry.chat_id == chat.id)).first()
            summary = db.get(ChatSummary, chat.id)
            digest = db.get(ChatDigest, chat.id)
            last_user = db.exec(select(Message).where(Message.chat_id == chat.id, Message.role == "user")
                                .order_by(Message.id.desc()).limit(1)).first()
            count = db.exec(select(func.count(Message.id)).where(Message.chat_id == chat.id)).one()
            items.append({"id": chat.id, "title": chat.title, "updated_at": chat.updated_at,
                "message_count": count, "preview": last_user.content[:240] if last_user else "No messages yet",
                "summary": summary.content if summary else None,
                "summary_stale": bool(summary and last_user and summary.last_message_id != last_user.id),
                "digest_status": digest.status if digest else None, "enquiry": enquiry})
        total = db.exec(select(func.count(Chat.id))).one()
        new = db.exec(select(func.count(Enquiry.id)).where(Enquiry.status == "new")).one()
        return {"items": items, "total": total, "new_enquiries": new, "email_ready": email_ready(settings)}

    @app.get("/api/admin/conversations/{chat_id}", dependencies=admin_access, tags=["Owner"])
    def owner_conversation(chat_id: str, db: Db, after: int = Query(0, ge=0)):
        if db.get(Chat, chat_id) is None:
            raise HTTPException(404, "Conversation not found")
        rows = db.exec(select(Message).where(Message.chat_id == chat_id, Message.id > after)
                       .order_by(Message.id).limit(101)).all()
        return {"items": rows[:100], "next_cursor": rows[99].id if len(rows) > 100 else None}

    @app.post("/api/admin/conversations/{chat_id}/summary", dependencies=admin_access, tags=["Owner"])
    def owner_summary(chat_id: str, db: Db, request: Request):
        chat = db.get(Chat, chat_id)
        if not chat:
            raise HTTPException(404, "Conversation not found")
        return summarize_chat(chat, db, request.app.state.assistant)

    @app.patch("/api/admin/enquiries/{enquiry_id}", dependencies=admin_access, tags=["Owner"])
    def owner_update(enquiry_id: str, payload: EnquiryStatus, db: Db):
        enquiry = db.get(Enquiry, enquiry_id)
        if not enquiry:
            raise HTTPException(404, "Enquiry not found")
        enquiry.status = payload.status
        db.add(enquiry)
        db.commit()
        return {"status": payload.status}

    @app.post("/api/admin/enquiries/{enquiry_id}/notify", dependencies=admin_access, tags=["Owner"])
    def owner_notify(enquiry_id: str, db: Db, tasks: BackgroundTasks):
        if not db.get(Enquiry, enquiry_id):
            raise HTTPException(404, "Enquiry not found")
        if not email_ready(settings):
            raise HTTPException(503, "Configure the SMTP sender in backend/.env first")
        tasks.add_task(deliver_enquiry, engine, settings, enquiry_id)
        return {"status": "queued"}

    @app.post("/api/chats/{chat_id}/turns", response_model=TurnRead, tags=["Assistant"])
    def generate_reply(chat_id: str, payload: TurnInput, visitor: Visitor, db: Db, request: Request):
        chat = owned_chat(chat_id, visitor, db)
        return run_turn(chat, visitor, payload, db, request.app.state.assistant, settings.ai_turns_per_hour)

    @app.post("/api/sessions", response_model=SessionCreated, status_code=201, tags=["Sessions"])
    def create_session(db: Db):
        token = secrets.token_urlsafe(32)
        visitor = VisitorSession(
            token_hash=sha256(token.encode()).hexdigest(),
            expires_at=utcnow() + timedelta(days=settings.session_days),
        )
        db.add(visitor)
        db.commit()
        db.refresh(visitor)
        return SessionCreated(**visitor.model_dump(exclude={"token_hash"}), token=token)

    @app.get("/api/sessions/current", response_model=SessionRead, tags=["Sessions"])
    def read_session(visitor: Visitor):
        return visitor

    @app.delete("/api/sessions/current", status_code=204, tags=["Sessions"])
    def delete_session(visitor: Visitor, db: Db):
        db.delete(visitor)
        db.commit()
        return Response(status_code=204)

    @app.post("/api/chats", response_model=ChatRead, status_code=201, tags=["Chats"])
    def create_chat(payload: ChatInput, visitor: Visitor, db: Db):
        chat = Chat(session_id=visitor.id, title=payload.title)
        db.add(chat)
        db.commit()
        db.refresh(chat)
        return chat

    @app.get("/api/chats", response_model=list[ChatRead], tags=["Chats"])
    def list_chats(visitor: Visitor, db: Db, offset: int = Query(0, ge=0), limit: int = Query(20, ge=1, le=100)):
        return db.exec(
            select(Chat).where(Chat.session_id == visitor.id)
            .order_by(Chat.updated_at.desc(), Chat.id).offset(offset).limit(limit)
        ).all()

    @app.get("/api/chats/{chat_id}", response_model=ChatRead, tags=["Chats"])
    def read_chat(chat_id: str, visitor: Visitor, db: Db):
        return owned_chat(chat_id, visitor, db)

    @app.patch("/api/chats/{chat_id}", response_model=ChatRead, tags=["Chats"])
    def rename_chat(chat_id: str, payload: ChatInput, visitor: Visitor, db: Db):
        chat = owned_chat(chat_id, visitor, db)
        chat.title, chat.updated_at = payload.title, utcnow()
        db.add(chat)
        db.commit()
        db.refresh(chat)
        return chat

    @app.delete("/api/chats/{chat_id}", status_code=204, tags=["Chats"])
    def delete_chat(chat_id: str, visitor: Visitor, db: Db):
        db.delete(owned_chat(chat_id, visitor, db))
        db.commit()
        return Response(status_code=204)

    @app.post("/api/chats/{chat_id}/messages", response_model=MessageRead, status_code=201, tags=["Messages"])
    def create_message(chat_id: str, payload: MessageInput, visitor: Visitor, db: Db):
        chat = owned_chat(chat_id, visitor, db)
        # Visitors can write user messages only. The future AI service writes assistant replies.
        message = Message(chat_id=chat.id, content=payload.content, role="user")
        chat.updated_at = utcnow()
        db.add(message)
        db.add(chat)
        db.commit()
        db.refresh(message)
        return message

    @app.get("/api/chats/{chat_id}/messages", response_model=MessagePage, tags=["Messages"])
    def list_messages(chat_id: str, visitor: Visitor, db: Db, after: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=100)):
        owned_chat(chat_id, visitor, db)
        rows = db.exec(
            select(Message).where(Message.chat_id == chat_id, Message.id > after)
            .order_by(Message.id).limit(limit + 1)
        ).all()
        items = rows[:limit]
        return {"items": items, "next_cursor": items[-1].id if len(rows) > limit else None}

    return app


app = create_app()
