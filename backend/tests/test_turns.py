from uuid import uuid4

from sqlmodel import Session, select

from app.ai import GenerationError
from app.models import ChatTurn, Message
from test_api import client, settings, visitor, chat  # noqa: F401


class FakeAssistant:
    """Explicit test double; never used by the running application."""
    ready = True

    def __init__(self):
        self.calls = []
        self.fail = False

    def generate(self, history):
        self.calls.append(history)
        if self.fail:
            raise GenerationError(502, "Please retry.")
        return "I can help you scope a CRM. Which workflow do you want to improve?"


def setup_turn(client):
    headers = visitor(client)
    chat_id = chat(client, headers)
    fake = FakeAssistant()
    client.app.state.assistant = fake
    payload = {"request_id": str(uuid4()), "content": "Can you build a CRM?"}
    return headers, chat_id, fake, payload


def test_generation_saves_both_messages_and_replay_does_not_bill_again(client):
    headers, chat_id, fake, payload = setup_turn(client)
    path = f"/api/chats/{chat_id}/turns"
    first = client.post(path, json=payload, headers=headers)
    assert first.status_code == 200
    assert first.json()["assistant"]["role"] == "assistant"
    second = client.post(path, json=payload, headers=headers)
    assert second.json() == first.json()
    assert len(fake.calls) == 1
    history = client.get(f"/api/chats/{chat_id}/messages", headers=headers).json()["items"]
    assert [message["role"] for message in history] == ["user", "assistant"]
    followup = client.post(path, json={"request_id": str(uuid4()), "content": "Shipment tracking"}, headers=headers)
    assert followup.status_code == 200
    assert len(fake.calls[-1]) == 3
    assert fake.calls[-1][1]["role"] == "assistant"


def test_failed_reply_can_retry_without_duplicate_user_message(client):
    headers, chat_id, fake, payload = setup_turn(client)
    path = f"/api/chats/{chat_id}/turns"
    fake.fail = True
    assert client.post(path, json=payload, headers=headers).status_code == 502
    fake.fail = False
    assert client.post(path, json=payload, headers=headers).status_code == 200
    with Session(client.app.state.engine) as db:
        assert len(db.exec(select(Message).where(Message.chat_id == chat_id)).all()) == 2
        turn = db.get(ChatTurn, payload["request_id"])
        assert turn.status == "completed"
        assert turn.attempts == 2


def test_turn_authorization_and_payload_conflict(client):
    headers, chat_id, fake, payload = setup_turn(client)
    other = visitor(client)
    path = f"/api/chats/{chat_id}/turns"
    assert client.post(path, json=payload, headers=other).status_code == 404
    assert fake.calls == []
    assert client.post(path, json=payload, headers=headers).status_code == 200
    assert client.post(path, json={**payload, "content": "Changed content"}, headers=headers).status_code == 409
    assert len(fake.calls) == 1


def test_missing_key_saves_no_messages(client):
    headers, chat_id, fake, payload = setup_turn(client)
    fake.ready = False
    assert client.get("/api/assistant").json() == {"ready": False}
    assert client.post(f"/api/chats/{chat_id}/turns", json=payload, headers=headers).status_code == 503
    assert client.get(f"/api/chats/{chat_id}/messages", headers=headers).json()["items"] == []


def test_concurrent_turn_is_rejected(client):
    headers, chat_id, fake, payload = setup_turn(client)
    path = f"/api/chats/{chat_id}/turns"
    original = fake.generate

    def concurrent(history):
        blocked = client.post(path, json={"request_id": str(uuid4()), "content": "Concurrent message"}, headers=headers)
        assert blocked.status_code == 409
        return original(history)

    fake.generate = concurrent
    assert client.post(path, json=payload, headers=headers).status_code == 200
    assert len(fake.calls) == 1


def test_hourly_limit_counts_failed_retries(client, monkeypatch):
    # Exercise the session budget independently of the stricter network burst budget.
    from app.throttle import POLICIES
    monkeypatch.setitem(POLICIES, "turns", [(100, 60)])
    headers, chat_id, fake, payload = setup_turn(client)
    fake.fail = True
    path = f"/api/chats/{chat_id}/turns"
    for _ in range(30):
        assert client.post(path, json=payload, headers=headers).status_code == 502
    assert client.post(path, json=payload, headers=headers).status_code == 429
    assert len(fake.calls) == 30


def test_provider_request_is_grounded_and_not_stored(monkeypatch, settings):
    from types import SimpleNamespace
    from app.ai import PortfolioAssistant

    captured = {}
    def create(**kwargs):
        captured.update(kwargs)
        return SimpleNamespace(output_text="A concise reply.")
    monkeypatch.setattr("app.ai.OpenAI", lambda **kwargs: SimpleNamespace(responses=SimpleNamespace(create=create), close=lambda: None))
    from pydantic import SecretStr
    settings.openai_api_key = SecretStr("test-key")
    assistant = PortfolioAssistant(settings)
    assert assistant.generate([{"role": "user", "content": "Hello"}]) == "A concise reply."
    assert captured["store"] is False
    assert "MyNext9to5" in captured["instructions"]
    assert captured["max_output_tokens"] == 600
    assistant.client.responses.create = lambda **kwargs: SimpleNamespace(output_text="Contact awaisabdullahm79@gmail.com")
    assert assistant.generate([{"role": "user", "content": "How can I contact you?"}]) == "Contact awaisabdullahm@gmail.com"
