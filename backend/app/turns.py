from datetime import timedelta

from fastapi import HTTPException
from sqlalchemy import func, text
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, select

from .ai import GenerationError
from .models import Chat, ChatTurn, Message, VisitorSession, utcnow
from .schemas import TurnInput


def result_for(turn: ChatTurn, db: Session):
    return {"user": db.get(Message, turn.user_message_id), "assistant": db.get(Message, turn.assistant_message_id)}


def run_turn(chat: Chat, visitor: VisitorSession, payload: TurnInput, db: Session, assistant, hourly_limit: int):
    chat_id, session_id, turn_id = chat.id, visitor.id, str(payload.request_id)
    # Serialize the short claim transaction across SQLite connections, not the provider call.
    db.rollback()
    db.exec(text("BEGIN IMMEDIATE"))
    try:
        chat = db.get(Chat, chat_id)
        if chat is None or chat.session_id != session_id:
            raise HTTPException(404, "Conversation not found")
        existing = db.get(ChatTurn, turn_id)
        if existing:
            if existing.chat_id != chat_id:
                raise HTTPException(409, "Request ID already used")
            if db.get(Message, existing.user_message_id).content != payload.content:
                raise HTTPException(409, "Retry must use the same message")
            if existing.status == "completed":
                result = result_for(existing, db)
                db.commit()
                return result
        if not assistant.ready:
            raise HTTPException(503, "AI chat is not available yet. Please email Awais directly.")
        now = utcnow()
        active = db.exec(select(ChatTurn).where(
            ChatTurn.chat_id == chat_id, ChatTurn.status == "processing",
            ChatTurn.started_at > now - timedelta(seconds=90),
        )).first()
        if active:
            raise HTTPException(409, "A reply is still being generated. Please wait and retry.")
        used = db.exec(select(func.coalesce(func.sum(ChatTurn.attempts), 0)).select_from(ChatTurn).join(Chat).where(
            Chat.session_id == session_id, ChatTurn.started_at > now - timedelta(hours=1)
        )).one()
        if used >= hourly_limit:
            raise HTTPException(429, "You've reached the hourly chat limit. Please email Awais or try later.")
        if existing:
            turn = existing
            turn.status, turn.started_at = "processing", now
            turn.attempts += 1
        else:
            message = Message(chat_id=chat_id, role="user", content=payload.content)
            db.add(message)
            db.flush()
            turn = ChatTurn(id=turn_id, chat_id=chat_id, user_message_id=message.id)
            if chat.title == "New conversation":
                chat.title = payload.content[:120]
        chat.updated_at = now
        db.add(chat)
        db.add(turn)
        db.commit()
    except Exception:
        db.rollback()
        raise

    # Only the latest 20 messages (bounded to 24k chars) go to the provider.
    rows = db.exec(select(Message).where(Message.chat_id == chat_id).order_by(Message.id.desc()).limit(20)).all()
    history, remaining = [], 24000
    for message in rows:
        if len(message.content) > remaining:
            break
        history.append({"role": message.role, "content": message.content})
        remaining -= len(message.content)
    history.reverse()
    db.rollback()  # Release read transaction before the external request.
    try:
        reply = assistant.generate(history)
    except GenerationError as error:
        turn = db.get(ChatTurn, turn_id)
        if turn:
            turn.status = "failed"
            db.add(turn)
            db.commit()
        raise HTTPException(error.status_code, error.public_message) from None
    turn = db.get(ChatTurn, turn_id)
    chat = db.get(Chat, chat_id)
    if turn is None or chat is None:
        raise HTTPException(404, "Conversation was removed while generating the reply")
    message = Message(chat_id=chat_id, role="assistant", content=reply)
    try:
        db.add(message)
        db.flush()
        turn.assistant_message_id, turn.status = message.id, "completed"
        chat.updated_at = utcnow()
        db.add(turn)
        db.add(chat)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(404, "Conversation no longer exists") from None
    return result_for(turn, db)
