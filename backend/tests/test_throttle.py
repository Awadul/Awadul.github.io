import ipaddress
from concurrent.futures import ThreadPoolExecutor

from fastapi.testclient import TestClient
from starlette.requests import Request

from app.main import create_app
from app.throttle import IPThrottle, client_address
from test_api import settings  # noqa: F401


def request(ip="198.51.100.5", forwarded=None, path="/api/sessions"):
    return Request({"type": "http", "method": "POST", "path": path,
        "scheme": "http", "server": ("localhost", 8000), "client": (ip, 1234),
        "query_string": b"", "headers": [(b"x-forwarded-for", forwarded.encode())] if forwarded else []})


def test_spoofed_headers_ignored_and_ipv6_grouped():
    assert client_address(request(forwarded="1.2.3.4"), []) == "198.51.100.5"
    assert client_address(request(ip="::ffff:198.51.100.5"), []) == "198.51.100.5"
    assert client_address(request(ip="2001:db8:abcd:12::1"), []) == client_address(request(ip="2001:db8:abcd:12::9"), [])


def test_proxy_chain_walks_from_trusted_transport():
    trusted = [ipaddress.ip_network("10.0.0.0/8")]
    assert client_address(request(ip="10.0.0.1", forwarded="1.2.3.4, 198.51.100.5, 10.0.0.2"), trusted) == "198.51.100.5"
    assert client_address(request(ip="10.0.0.1", forwarded="bad-input"), trusted) == "10.0.0.1"


def test_session_throttle_persists_after_restart_and_cors(settings, monkeypatch):
    monkeypatch.setattr("app.throttle.time.time", lambda: 3601)
    with TestClient(create_app(settings)) as client:
        for _ in range(5):
            assert client.post("/api/sessions").status_code == 201
        blocked = client.post("/api/sessions", headers={"Origin": "http://localhost:3000", "X-Forwarded-For": "1.2.3.4"})
        assert blocked.status_code == 429
        assert int(blocked.headers["Retry-After"]) > 0
        assert blocked.headers["Access-Control-Allow-Origin"] == "http://localhost:3000"
        assert blocked.headers["Cache-Control"] == "no-store"
    with TestClient(create_app(settings)) as client:
        assert client.post("/api/sessions").status_code == 429


def test_action_budgets_independent_ip_and_expiry(settings, monkeypatch):
    from app.database import create_database_engine, initialize_database
    engine = create_database_engine(settings); initialize_database(engine)
    limiter = IPThrottle(engine, settings)
    monkeypatch.setattr("app.throttle.time.time", lambda: 3601)
    for _ in range(10):
        assert limiter.check(request(path="/api/chats/a/turns")) == 0
    assert limiter.check(request(path="/api/chats/b/turns")) == 59
    assert limiter.check(request(ip="198.51.100.6", path="/api/chats/a/turns")) == 0
    assert limiter.check(request(path="/api/chats/a/enquiry")) == 0
    monkeypatch.setattr("app.throttle.time.time", lambda: 3661)
    assert limiter.check(request(path="/api/chats/a/turns")) == 0
    engine.dispose()


def test_atomic_parallel_claims(settings, monkeypatch):
    from app.database import create_database_engine, initialize_database
    engine = create_database_engine(settings); initialize_database(engine)
    limiter = IPThrottle(engine, settings)
    monkeypatch.setattr("app.throttle.time.time", lambda: 3601)
    with ThreadPoolExecutor(max_workers=8) as pool:
        results = list(pool.map(lambda _: limiter.check(request()), range(16)))
    assert results.count(0) == 5
    assert sum(result > 0 for result in results) == 11
    engine.dispose()


def test_new_sessions_cannot_reset_ai_budget(settings):
    with TestClient(create_app(settings)) as client:
        # Invalid visitor credentials still consume the network budget before auth.
        for _ in range(10):
            assert client.post("/api/chats/a/turns", json={}).status_code == 401
        assert client.post("/api/sessions").status_code == 201
        assert client.post("/api/chats/b/turns", json={}).status_code == 429
