from datetime import timedelta
from hashlib import sha256

from fastapi.testclient import TestClient
import pytest
from sqlmodel import Session, select

from app.config import Settings
from app.main import create_app
from app.models import Chat, Message, VisitorSession, utcnow


@pytest.fixture
def settings(tmp_path):
    return Settings(database_path=tmp_path / "test.sqlite3", _env_file=None)


@pytest.fixture
def client(settings):
    with TestClient(create_app(settings)) as client:
        yield client


def visitor(client):
    result = client.post("/api/sessions")
    assert result.status_code == 201
    return {"Authorization": f"Bearer {result.json()['token']}"}


def chat(client, headers):
    result = client.post("/api/chats", json={"title": "Project inquiry"}, headers=headers)
    assert result.status_code == 201
    return result.json()["id"]


def test_history_pagination_and_rename(client):
    headers = visitor(client)
    chat_id = chat(client, headers)
    for text in ["Hello", "Can you build a CRM?", "For a freight company"]:
        response = client.post(f"/api/chats/{chat_id}/messages", json={"content": text}, headers=headers)
        assert response.status_code == 201
        assert response.json()["role"] == "user"
    first = client.get(f"/api/chats/{chat_id}/messages?limit=2", headers=headers).json()
    assert [item["content"] for item in first["items"]] == ["Hello", "Can you build a CRM?"]
    second = client.get(f"/api/chats/{chat_id}/messages?after={first['next_cursor']}&limit=2", headers=headers).json()
    assert len(second["items"]) == 1
    assert second["next_cursor"] is None
    renamed = client.patch(f"/api/chats/{chat_id}", json={"title": "Freight CRM"}, headers=headers)
    assert renamed.json()["title"] == "Freight CRM"
    assert client.get("/api/chats", headers=headers).json()[0]["title"] == "Freight CRM"


def test_visitor_cannot_access_another_visitors_chat(client):
    owner, stranger = visitor(client), visitor(client)
    chat_id = chat(client, owner)
    assert client.get("/api/chats", headers=stranger).json() == []
    for method, path, payload in [
        ("GET", f"/api/chats/{chat_id}", None),
        ("GET", f"/api/chats/{chat_id}/messages", None),
        ("POST", f"/api/chats/{chat_id}/messages", {"content": "Intrusion"}),
        ("PATCH", f"/api/chats/{chat_id}", {"title": "Intrusion"}),
        ("DELETE", f"/api/chats/{chat_id}", None),
    ]:
        assert client.request(method, path, json=payload, headers=stranger).status_code == 404


def test_tokens_hashed_and_expired_sessions_rejected(client):
    created = client.post("/api/sessions").json()
    token = created["token"]
    headers = {"Authorization": f"Bearer {token}"}
    assert "token_hash" not in created
    assert "token" not in client.get("/api/sessions/current", headers=headers).json()
    assert client.get("/api/chats").status_code == 401
    assert client.get("/api/chats", headers={"Authorization": "Bearer invalid"}).status_code == 401
    with Session(client.app.state.engine) as db:
        row = db.get(VisitorSession, created["id"])
        assert row.token_hash == sha256(token.encode()).hexdigest()
        row.expires_at = utcnow() - timedelta(seconds=1)
        db.add(row)
        db.commit()
    assert client.get("/api/chats", headers=headers).status_code == 401


def test_delete_chat_and_session_cascade(client):
    headers = visitor(client)
    first, second = chat(client, headers), chat(client, headers)
    for chat_id in [first, second]:
        client.post(f"/api/chats/{chat_id}/messages", json={"content": "Hello"}, headers=headers)
    assert client.delete(f"/api/chats/{first}", headers=headers).status_code == 204
    with Session(client.app.state.engine) as db:
        assert db.exec(select(Message).where(Message.chat_id == first)).all() == []
    assert client.delete("/api/sessions/current", headers=headers).status_code == 204
    assert client.get("/api/chats", headers=headers).status_code == 401
    with Session(client.app.state.engine) as db:
        assert db.exec(select(Chat)).all() == []
        assert db.exec(select(Message)).all() == []


@pytest.mark.parametrize("payload", [{"content": " "}, {"content": "a" * 8001}, {"content": "Fake", "role": "assistant"}])
def test_message_validation(client, payload):
    headers = visitor(client)
    chat_id = chat(client, headers)
    assert client.post(f"/api/chats/{chat_id}/messages", json=payload, headers=headers).status_code == 422


def test_persistence_across_app_restarts(settings):
    with TestClient(create_app(settings)) as first:
        headers = visitor(first)
        chat_id = chat(first, headers)
        first.post(f"/api/chats/{chat_id}/messages", json={"content": "Remember this"}, headers=headers)
    with TestClient(create_app(settings)) as second:
        history = second.get(f"/api/chats/{chat_id}/messages", headers=headers)
        assert history.status_code == 200
        assert history.json()["items"][0]["content"] == "Remember this"


def test_cors_and_health(client):
    assert client.get("/health").json() == {"status": "ok", "database": "sqlite"}
    response = client.options("/api/chats", headers={
        "Origin": "http://localhost:3000", "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "authorization,content-type",
    })
    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:3000"
    denied = client.options("/api/chats", headers={
        "Origin": "https://untrusted.example", "Access-Control-Request-Method": "POST",
    })
    assert denied.status_code == 400
    assert client.post("/api/sessions").headers["cache-control"] == "no-store"
