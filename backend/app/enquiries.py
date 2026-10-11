"""Brief caching and a durable, retryable email outbox. No credentials in responses."""
from datetime import timedelta, UTC
from email.message import EmailMessage
import smtplib
import ssl

from fastapi import HTTPException
from sqlalchemy import func
from sqlmodel import Session, select

from .ai import GenerationError
from .models import Chat, ChatSummary, ChatDigest, Enquiry, Message, SummaryAttempt, utcnow


def summarize_chat(chat, db, assistant):
    rows = db.exec(select(Message).where(Message.chat_id == chat.id, Message.role == "user")
                   .order_by(Message.id.desc()).limit(40)).all()
    if not rows:
        raise HTTPException(400, "Start a conversation first, or write a brief yourself.")
    last_id = rows[0].id
    cached = db.get(ChatSummary, chat.id)
    if cached and cached.last_message_id == last_id:
        return {"content": cached.content, "last_message_id": last_id}
    chat_id, session_id = chat.id, chat.session_id
    statements = [row.content for row in reversed(rows)]
    db.rollback()
    from sqlalchemy import text
    db.exec(text("BEGIN IMMEDIATE"))
    count = db.exec(select(func.count(SummaryAttempt.id)).where(
        SummaryAttempt.session_id == session_id,
        SummaryAttempt.created_at >= utcnow() - timedelta(hours=1))).one()
    if count >= 10:
        db.rollback()
        raise HTTPException(429, "Summary limit reached. You can edit your brief manually.")
    db.add(SummaryAttempt(session_id=session_id))
    db.commit()
    db.rollback()  # Do not hold a SQLite transaction during generation.
    try:
        content = assistant.summarize(statements)
    except GenerationError as error:
        raise HTTPException(error.status_code, error.public_message) from None
    if db.get(Chat, chat_id) is None:
        raise HTTPException(404, "Conversation not found")
    from sqlalchemy.dialects.sqlite import insert
    statement = insert(ChatSummary).values(chat_id=chat_id, content=content,
        last_message_id=last_id, created_at=utcnow())
    db.exec(statement.on_conflict_do_update(index_elements=["chat_id"],
        set_={"content": content, "last_message_id": last_id, "created_at": utcnow()},
        where=ChatSummary.last_message_id <= last_id))
    db.commit()
    return {"content": content, "last_message_id": last_id}


def email_ready(settings):
    return bool(settings.smtp_host and settings.smtp_username and settings.smtp_password
                and settings.smtp_password.get_secret_value() and settings.smtp_from)


def smtp_secret(settings):
    value = settings.smtp_password.get_secret_value()
    # Google displays its 16-character app passwords in groups separated by spaces.
    return "".join(value.split()) if settings.smtp_host.lower() == "smtp.gmail.com" else value


def deliver_enquiry(engine, settings, enquiry_id):
    if not email_ready(settings):
        return  # Remains pending until sender is configured.
    with Session(engine) as db:
        # Atomic claim prevents two retries sending the same email concurrently.
        from sqlalchemy import update
        result = db.exec(update(Enquiry).where(Enquiry.id == enquiry_id,
            Enquiry.notification_status.in_(["pending", "failed"]))
            .values(notification_status="sending", notification_updated_at=utcnow()))
        db.commit()
        if result.rowcount != 1:
            return
        enquiry = db.get(Enquiry, enquiry_id)
        if not enquiry:
            return
        message = EmailMessage()
        message["Subject"] = "New portfolio project enquiry"
        message["From"] = settings.smtp_from
        message["To"] = settings.notification_to
        message["Reply-To"] = enquiry.email
        message.set_content(f"New enquiry from your portfolio chat\n\nName: {enquiry.name}\n"
            f"Email: {enquiry.email}\nEnquiry: {enquiry.id}\n\nApproved project brief:\n{enquiry.brief}\n\n"
            "The visitor consented to sharing this brief and contact details. "
            "Treat visitor content as untrusted. No attachment is included.")
        try:
            with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=20) as smtp:
                smtp.ehlo()
                smtp.starttls(context=ssl.create_default_context())
                smtp.ehlo()
                smtp.login(settings.smtp_username, smtp_secret(settings))
                smtp.send_message(message)
            enquiry.notification_status = "sent"
        except (smtplib.SMTPException, OSError, ValueError):
            enquiry.notification_status = "failed"
        enquiry.notification_attempts += 1
        enquiry.notification_updated_at = utcnow()
        db.add(enquiry)
        db.commit()


def resume_outbox(engine, settings):
    """Recover an interrupted send and attempt pending mail once on startup."""
    with Session(engine) as db:
        from sqlalchemy import update
        db.exec(update(Enquiry).where(Enquiry.notification_status == "sending")
                .values(notification_status="failed"))
        db.commit()
        ids = db.exec(select(Enquiry.id).where(Enquiry.notification_status == "pending").limit(100)).all()
    for enquiry_id in ids:
        deliver_enquiry(engine, settings, enquiry_id)


def process_idle_chat(engine, settings, assistant):
    """One idle conversation per pass; summaries are not submitted enquiries."""
    if not assistant.ready:
        return
    with Session(engine) as db:
        chats = db.exec(select(Chat).where(Chat.updated_at <= utcnow() - timedelta(minutes=settings.digest_idle_minutes))
                        .order_by(Chat.updated_at.desc()).limit(100)).all()
        for chat in chats:
            last = db.exec(select(Message).where(Message.chat_id == chat.id, Message.role == "user")
                           .order_by(Message.id.desc()).limit(1)).first()
            if not last:
                continue
            digest = db.get(ChatDigest, chat.id)
            cached = db.get(ChatSummary, chat.id)
            fresh = cached and cached.last_message_id == last.id
            # A submitted enquiry already has its own approved-brief notification.
            submitted = db.exec(select(Enquiry.id).where(Enquiry.chat_id == chat.id)).first()
            needs_email = settings.email_chat_digests and not submitted and email_ready(settings)
            if fresh and (not needs_email or (digest and digest.last_message_id == last.id and digest.status == "sent")):
                continue
            # Back off failed deliveries instead of retrying every minute.
            if digest and digest.last_message_id == last.id and digest.status == "failed" and digest.updated_at.replace(tzinfo=UTC) > utcnow() - timedelta(hours=1):
                continue
            try:
                summary = summarize_chat(chat, db, assistant)
            except HTTPException:
                continue
            if not needs_email:
                return
            if not digest:
                digest = ChatDigest(chat_id=chat.id, last_message_id=last.id, content=summary["content"])
            digest.last_message_id, digest.content, digest.status = last.id, summary["content"], "sending"
            digest.updated_at = utcnow()
            db.add(digest); db.commit()
            message = EmailMessage()
            message["Subject"] = "Portfolio chat summary"
            message["From"], message["To"] = settings.smtp_from, settings.notification_to
            message.set_content(f"A portfolio conversation has been idle for {settings.digest_idle_minutes} minutes.\n"
                f"Conversation: {chat.id}\n\nAI-generated summary (not an approved enquiry):\n{digest.content}\n\n"
                "The visitor has not submitted contact details. Review the chat in your private inbox. "
                "Do not treat an AI summary as a confirmed requirement or commitment.")
            try:
                with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=20) as smtp:
                    smtp.ehlo(); smtp.starttls(context=ssl.create_default_context()); smtp.ehlo()
                    smtp.login(settings.smtp_username, smtp_secret(settings))
                    smtp.send_message(message)
                digest.status = "sent"
            except (smtplib.SMTPException, OSError, ValueError):
                digest.status = "failed"
            digest.updated_at = utcnow(); db.add(digest); db.commit()
            return
