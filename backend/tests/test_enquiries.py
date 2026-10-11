from datetime import timedelta, UTC

import pytest
from fastapi.testclient import TestClient
from pydantic import SecretStr
from sqlmodel import Session, select

from app.main import create_app
from app.models import Chat, ChatDigest, Enquiry, Message, utcnow
from app.enquiries import process_idle_chat
from test_api import settings, visitor, chat  # noqa: F401

ADMIN = {"Authorization": "Bearer owner-test-token"}


class Summarizer:
    ready = True
    calls = 0
    def summarize(self, statements):
        self.calls += 1
        assert all(isinstance(item, str) for item in statements)
        return "Goal: Freight CRM\nRequirements: Shipment management\nOpen details: Not specified"
    def close(self):
        pass


@pytest.fixture
def client(settings):
    settings.admin_token = SecretStr("owner-test-token")
    with TestClient(create_app(settings)) as client:
        client.app.state.assistant = Summarizer()
        yield client


def conversation(client):
    headers = visitor(client)
    chat_id = chat(client, headers)
    client.post(f"/api/chats/{chat_id}/messages", headers=headers, json={"content": "I need a freight CRM for shipment management"})
    return headers, chat_id


def payload():
    return {"name": "Test visitor", "email": "visitor@example.com", "brief": "A freight CRM to manage shipments.", "consent": True}


def test_readiness_requires_details_and_respects_ownership_and_submission(client):
    headers, chat_id = conversation(client)
    path = f"/api/chats/{chat_id}/brief-readiness"
    assert client.post(path, headers=visitor(client)).status_code == 404
    assert client.post(path, headers=headers).json() == {"ready": False}
    assert client.app.state.assistant.calls == 0
    for statement in [
        "Our staff need to track shipments, invoices, customer records, and delivery status in one place.",
        "We have a team of five dispatchers and need reports of weekly revenue with a searchable shipment history.",
    ]:
        client.post(f"/api/chats/{chat_id}/messages", headers=headers, json={"content": statement})
    result = client.post(path, headers=headers)
    assert result.status_code == 200
    assert result.json()["ready"] is True
    assert "Freight CRM" in result.json()["content"]
    assert client.post(path, headers=headers).json() == result.json()
    assert client.app.state.assistant.calls == 1
    client.post(f"/api/chats/{chat_id}/enquiry", headers=headers, json=payload())
    assert client.post(path, headers=headers).json() == {"ready": False}


def test_readiness_ignores_informational_and_sparse_conversations():
    from app.brief_readiness import brief_ready
    assert not brief_ready(["Tell me about your CRM projects and customers.",
                            "Did they integrate reports and payments?" * 4,
                            "What was the deadline for that website?"])
    assert not brief_ready(["I need a website.", "Thanks.", "Okay."])
    assert not brief_ready(["I need a website for my company." * 10])


def test_readiness_accepts_supplied_tracknest_brief_and_multiline_request():
    from app.brief_readiness import brief_ready
    statements = [
        "Can I schedule a call?",
        "The Idea (Project Brief):\n\nTrackNest — A subscription-tracking SaaS dashboard that helps freelancers and small teams monitor all their paid tools in one place, get renewal alerts, and see monthly spend analytics. Built as a full-stack web app.",
        "Yes — I want Gmail + Outlook parsing first, so it auto-detects subscriptions from receipts. Can you integrate with Stripe so my customers' billing data flows in automatically? I also want Slack + WhatsApp alerts.",
    ]
    assert brief_ready(statements)
    statements[1] = "I would like\na subscription-tracking dashboard for our team to manage paid tools and send renewal alerts."
    assert brief_ready(statements)


def test_owner_access_cannot_use_visitor_token(client):
    headers, chat_id = conversation(client)
    assert client.get("/api/admin/conversations").status_code == 401
    assert client.get("/api/admin/conversations", headers=headers).status_code == 401
    assert client.get(f"/api/admin/conversations/{chat_id}", headers=headers).status_code == 401
    assert client.post(f"/api/admin/conversations/{chat_id}/summary", headers=headers).status_code == 401
    result = client.get("/api/admin/conversations", headers=ADMIN).json()
    assert result["total"] == 1
    assert result["items"][0]["preview"].startswith("I need")
    assert "token_hash" not in str(result)


def test_brief_cache_scoping_and_only_visitor_statements(client):
    headers, chat_id = conversation(client)
    path = f"/api/chats/{chat_id}/summary"
    assert client.post(path, headers=visitor(client)).status_code == 404
    result = client.post(path, headers=headers)
    assert result.status_code == 200
    assert "Freight CRM" in result.json()["content"]
    assert client.post(path, headers=headers).json() == result.json()
    assert client.app.state.assistant.calls == 1
    client.post(f"/api/chats/{chat_id}/messages", headers=headers, json={"content": "Integrate accounting"})
    assert client.post(path, headers=headers).status_code == 200
    assert client.app.state.assistant.calls == 2


def test_consent_validation_idempotency_and_status(client, monkeypatch):
    from app.throttle import POLICIES
    monkeypatch.setitem(POLICIES, "enquiries", [(100, 60)])
    headers, chat_id = conversation(client)
    path = f"/api/chats/{chat_id}/enquiry"
    assert client.post(path, headers=headers, json={**payload(), "consent": False}).status_code == 422
    assert client.post(path, headers=headers, json={**payload(), "email": "bad\r\nBcc: x@example.com"}).status_code == 422
    assert client.post(path, headers=visitor(client), json=payload()).status_code == 404
    first = client.post(path, headers=headers, json=payload())
    assert first.status_code == 200
    assert client.post(path, headers=headers, json=payload()).json() == first.json()
    enquiry_id = first.json()["id"]
    data = client.get("/api/admin/conversations", headers=ADMIN).json()
    assert data["new_enquiries"] == 1
    assert data["items"][0]["enquiry"]["notification_status"] == "pending"
    assert client.patch(f"/api/admin/enquiries/{enquiry_id}", headers=headers, json={"status": "closed"}).status_code == 401
    assert client.patch(f"/api/admin/enquiries/{enquiry_id}", headers=ADMIN, json={"status": "invalid"}).status_code == 422
    assert client.patch(f"/api/admin/enquiries/{enquiry_id}", headers=ADMIN, json={"status": "contacted"}).status_code == 200
    assert client.get("/api/admin/conversations", headers=ADMIN).json()["new_enquiries"] == 0
    assert client.post(f"/api/admin/enquiries/{enquiry_id}/notify", headers=ADMIN).status_code == 503
    client.delete(f"/api/chats/{chat_id}", headers=headers)
    with Session(client.app.state.engine) as db:
        assert db.get(Enquiry, enquiry_id) is None


def configure_mail(settings):
    settings.smtp_host = "smtp.example.com"
    settings.smtp_username = settings.smtp_from = "owner@example.com"
    settings.smtp_password = SecretStr("fake-test-password")


def test_email_is_queued_after_save_and_retry_does_not_resend_sent(client, settings, monkeypatch):
    configure_mail(settings)
    sent = []
    class SMTP:
        def __init__(self, *args, **kwargs): pass
        def __enter__(self): return self
        def __exit__(self, *args): pass
        def ehlo(self): pass
        def starttls(self, **kwargs): pass
        def login(self, *args): pass
        def send_message(self, message):
            with Session(client.app.state.engine) as db:
                assert db.exec(select(Enquiry)).first() is not None
            sent.append(message)
    monkeypatch.setattr("app.enquiries.smtplib.SMTP", SMTP)
    headers, chat_id = conversation(client)
    enquiry_id = client.post(f"/api/chats/{chat_id}/enquiry", headers=headers, json=payload()).json()["id"]
    assert len(sent) == 1
    assert sent[0]["To"] == "awaisabdullahm@gmail.com"
    assert sent[0]["Reply-To"] == "visitor@example.com"
    client.post(f"/api/admin/enquiries/{enquiry_id}/notify", headers=ADMIN)
    assert len(sent) == 1


def test_mail_failure_keeps_enquiry_saved(client, settings, monkeypatch):
    configure_mail(settings)
    def fail(*args, **kwargs): raise OSError("private-provider-error")
    monkeypatch.setattr("app.enquiries.smtplib.SMTP", fail)
    headers, chat_id = conversation(client)
    result = client.post(f"/api/chats/{chat_id}/enquiry", headers=headers, json=payload())
    assert result.status_code == 200
    data = client.get("/api/admin/conversations", headers=ADMIN).json()
    assert data["items"][0]["enquiry"]["notification_status"] == "failed"
    assert "private-provider-error" not in str(data)


def test_idle_chats_get_summary_without_sender(client, settings):
    _, chat_id = conversation(client)
    with Session(client.app.state.engine) as db:
        record = db.get(Chat, chat_id)
        record.updated_at = utcnow() - timedelta(minutes=11)
        db.add(record); db.commit()
    process_idle_chat(client.app.state.engine, settings, client.app.state.assistant)
    process_idle_chat(client.app.state.engine, settings, client.app.state.assistant)
    assert client.app.state.assistant.calls == 1
    data = client.get("/api/admin/conversations", headers=ADMIN).json()
    assert "Freight CRM" in data["items"][0]["summary"]


def test_idle_email_sent_once_and_failed_mail_backoff(client, settings, monkeypatch):
    configure_mail(settings)
    _, chat_id = conversation(client)
    with Session(client.app.state.engine) as db:
        record = db.get(Chat, chat_id); record.updated_at = utcnow() - timedelta(minutes=11)
        db.add(record); db.commit()
    def fail(*args, **kwargs): raise OSError("unavailable")
    monkeypatch.setattr("app.enquiries.smtplib.SMTP", fail)
    process_idle_chat(client.app.state.engine, settings, client.app.state.assistant)
    process_idle_chat(client.app.state.engine, settings, client.app.state.assistant)
    with Session(client.app.state.engine) as db:
        assert db.get(ChatDigest, chat_id).status == "failed"
    assert client.app.state.assistant.calls == 1
    sent = []
    class SMTP:
        def __init__(self, *args, **kwargs): pass
        def __enter__(self): return self
        def __exit__(self, *args): pass
        def ehlo(self): pass
        def starttls(self, **kwargs): pass
        def login(self, *args): pass
        def send_message(self, message): sent.append(message)
    monkeypatch.setattr("app.enquiries.smtplib.SMTP", SMTP)
    with Session(client.app.state.engine) as db:
        digest = db.get(ChatDigest, chat_id)
        digest.updated_at = utcnow() - timedelta(hours=2)
        db.add(digest); db.commit()
    process_idle_chat(client.app.state.engine, settings, client.app.state.assistant)
    process_idle_chat(client.app.state.engine, settings, client.app.state.assistant)
    assert len(sent) == 1
    assert "not an approved enquiry" in sent[0].get_content()


def test_summary_generation_limit(client, monkeypatch):
    from app.throttle import POLICIES
    monkeypatch.setitem(POLICIES, "summaries", [(100, 60)])
    headers, chat_id = conversation(client)
    for index in range(10):
        client.post(f"/api/chats/{chat_id}/messages", headers=headers, json={"content": f"Requirement {index}"})
        assert client.post(f"/api/chats/{chat_id}/summary", headers=headers).status_code == 200
    client.post(f"/api/chats/{chat_id}/messages", headers=headers, json={"content": "One more"})
    assert client.post(f"/api/chats/{chat_id}/summary", headers=headers).status_code == 429
    assert client.app.state.assistant.calls == 10
