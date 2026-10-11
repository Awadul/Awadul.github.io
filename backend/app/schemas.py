from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator


class InputModel(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class SessionRead(BaseModel):
    id: str
    created_at: datetime
    expires_at: datetime


class SessionCreated(SessionRead):
    token: str


class ChatInput(InputModel):
    title: str = Field(default="New conversation", min_length=1, max_length=120)


class ChatRead(BaseModel):
    id: str
    title: str
    created_at: datetime
    updated_at: datetime


class MessageInput(InputModel):
    content: str = Field(min_length=1, max_length=8000)


class MessageRead(BaseModel):
    id: int
    chat_id: str
    role: Literal["user", "assistant"]
    content: str
    created_at: datetime


class MessagePage(BaseModel):
    items: list[MessageRead]
    next_cursor: int | None


class TurnInput(MessageInput):
    request_id: UUID


class TurnRead(BaseModel):
    user: MessageRead
    assistant: MessageRead


class EnquiryInput(InputModel):
    name: str = Field(min_length=1, max_length=100)
    email: str = Field(min_length=3, max_length=254)
    brief: str = Field(min_length=10, max_length=6000)
    consent: Literal[True]

    @field_validator("email")
    @classmethod
    def valid_email(cls, value):
        import re
        if not re.fullmatch(r"[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+", value):
            raise ValueError("Enter a valid email address")
        return value


class EnquiryStatus(InputModel):
    status: Literal["new", "contacted", "closed"]

