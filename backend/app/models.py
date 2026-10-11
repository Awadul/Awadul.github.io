from datetime import UTC, datetime
from uuid import uuid4

from sqlalchemy import CheckConstraint, Column, ForeignKey, Integer
from sqlmodel import Field, SQLModel


def utcnow() -> datetime:
    """Use timezone-aware UTC dates for persistence and API responses."""
    return datetime.now(UTC)


def new_id() -> str:
    return str(uuid4())


class VisitorSession(SQLModel, table=True):
    __tablename__ = "visitor_sessions"

    id: str = Field(default_factory=new_id, primary_key=True)
    token_hash: str = Field(unique=True, index=True)
    created_at: datetime = Field(default_factory=utcnow)
    expires_at: datetime = Field(index=True)


class Chat(SQLModel, table=True):
    __tablename__ = "chats"

    id: str = Field(default_factory=new_id, primary_key=True)
    session_id: str = Field(
        sa_column=Column(ForeignKey("visitor_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    )
    title: str = Field(default="New conversation", max_length=120)
    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow, index=True)


class Message(SQLModel, table=True):
    __tablename__ = "messages"
    __table_args__ = (CheckConstraint("role IN ('user', 'assistant')"),)

    id: int | None = Field(default=None, sa_column=Column(Integer, primary_key=True, autoincrement=True))
    chat_id: str = Field(
        sa_column=Column(ForeignKey("chats.id", ondelete="CASCADE"), nullable=False, index=True)
    )
    role: str = Field(default="user")
    content: str
    created_at: datetime = Field(default_factory=utcnow)


class ChatTurn(SQLModel, table=True):
    """Durable request IDs make retries safe without modifying existing tables."""
    __tablename__ = "chat_turns"

    id: str = Field(primary_key=True)
    chat_id: str = Field(sa_column=Column(ForeignKey("chats.id", ondelete="CASCADE"), nullable=False, index=True))
    user_message_id: int = Field(sa_column=Column(ForeignKey("messages.id", ondelete="CASCADE"), nullable=False))
    assistant_message_id: int | None = Field(default=None, sa_column=Column(ForeignKey("messages.id", ondelete="CASCADE"), nullable=True))
    status: str = Field(default="processing")
    attempts: int = Field(default=1)
    created_at: datetime = Field(default_factory=utcnow)
    started_at: datetime = Field(default_factory=utcnow)


class ChatSummary(SQLModel, table=True):
    __tablename__ = "chat_summaries"
    chat_id: str = Field(sa_column=Column(ForeignKey("chats.id", ondelete="CASCADE"), primary_key=True))
    content: str
    last_message_id: int
    created_at: datetime = Field(default_factory=utcnow)


class SummaryAttempt(SQLModel, table=True):
    __tablename__ = "summary_attempts"
    id: str = Field(default_factory=new_id, primary_key=True)
    session_id: str = Field(sa_column=Column(ForeignKey("visitor_sessions.id", ondelete="CASCADE"), nullable=False, index=True))
    created_at: datetime = Field(default_factory=utcnow)


class Enquiry(SQLModel, table=True):
    __tablename__ = "enquiries"
    __table_args__ = (CheckConstraint("status IN ('new', 'contacted', 'closed')"),)
    id: str = Field(default_factory=new_id, primary_key=True)
    chat_id: str = Field(sa_column=Column(ForeignKey("chats.id", ondelete="CASCADE"), nullable=False, unique=True))
    name: str
    email: str
    brief: str
    status: str = "new"
    consent_at: datetime = Field(default_factory=utcnow)
    created_at: datetime = Field(default_factory=utcnow)
    notification_status: str = "pending"
    notification_attempts: int = 0
    notification_updated_at: datetime = Field(default_factory=utcnow)


class ChatDigest(SQLModel, table=True):
    __tablename__ = "chat_digests"
    chat_id: str = Field(sa_column=Column(ForeignKey("chats.id", ondelete="CASCADE"), primary_key=True))
    last_message_id: int
    content: str
    status: str = "pending"
    updated_at: datetime = Field(default_factory=utcnow)


class RateLimitBucket(SQLModel, table=True):
    __tablename__ = "rate_limit_buckets"
    id: str = Field(primary_key=True)
    count: int = 0
    expires_at: int = Field(index=True)

