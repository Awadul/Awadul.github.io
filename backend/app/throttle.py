"""Persistent, atomic per-IP budgets. Forwarded headers require explicit trust."""
import hashlib
import hmac
import ipaddress
from pathlib import Path
import re
import secrets
import time

from sqlalchemy import delete, text
from sqlmodel import Session

from .models import RateLimitBucket

# Every API call has a general budget; mutations also consume a specific budget.
# Each tuple is (requests, window seconds).
POLICIES = {
    "api": [(120, 60)],
    "sessions": [(5, 60), (20, 3600)],
    "chats": [(10, 60), (60, 3600)],
    "messages": [(30, 60), (120, 3600)],
    "turns": [(10, 60), (40, 3600)],
    "summaries": [(6, 60), (20, 3600)],
    "enquiries": [(3, 60), (10, 3600)],
}


def normalize_ip(value):
    address = ipaddress.ip_address(value.strip())
    if isinstance(address, ipaddress.IPv6Address) and address.ipv4_mapped:
        return address.ipv4_mapped
    return address


def client_address(request, trusted_networks):
    peer = request.client.host if request.client else "unknown"
    try:
        address = normalize_ip(peer)
    except ValueError:
        return peer  # Test transports or missing peer share one conservative budget.
    def trusted(ip):
        return any(ip in network for network in trusted_networks)
    if trusted(address):
        forwarded = request.headers.get("x-forwarded-for", "")
        if forwarded and len(forwarded) <= 2048:
            try:
                chain = [normalize_ip(item) for item in forwarded.split(",")]
            except ValueError:
                chain = []
            # Walk from the transport toward the client; ignore attacker prefixes.
            for hop in reversed(chain):
                if not trusted(address):
                    break
                address = hop
    # Group IPv6 privacy addresses in their /64 to prevent trivial address rotation.
    if isinstance(address, ipaddress.IPv6Address):
        return str(ipaddress.ip_network(f"{address}/64", strict=False))
    return str(address)


def action_for(method, path):
    if method != "POST":
        return None
    if path == "/api/sessions": return "sessions"
    if path == "/api/chats": return "chats"
    match = re.fullmatch(r"/api/chats/[^/]+/(messages|turns|summary|brief-readiness|enquiry)", path)
    if match:
        return {"summary": "summaries", "brief-readiness": "summaries", "enquiry": "enquiries"}.get(match[1], match[1])
    return None


class IPThrottle:
    def __init__(self, engine, settings):
        self.engine = engine
        self.trusted = [ipaddress.ip_network(value, strict=False) for value in settings.trusted_proxy_cidrs]
        # A separate persistent key keeps stored IP identifiers pseudonymous.
        # It stays next to the ignored database and is never returned by the API.
        key_path = Path(engine.url.database).parent / "ip-throttle.key"
        try:
            with key_path.open("xb") as handle:
                handle.write(secrets.token_bytes(32))
        except FileExistsError:
            pass
        self.key = key_path.read_bytes()

    def check(self, request):
        address = client_address(request, self.trusted)
        identity = hmac.new(self.key, address.encode(), hashlib.sha256).hexdigest()
        policies = [("api", POLICIES["api"])]
        action = action_for(request.method, request.url.path.rstrip("/"))
        if action:
            policies.append((action, POLICIES[action]))
        now = int(time.time())
        with Session(self.engine) as db:
            db.exec(text("BEGIN IMMEDIATE"))
            db.exec(delete(RateLimitBucket).where(RateLimitBucket.expires_at <= now))
            buckets = []
            retry = 0
            for name, limits in policies:
                for maximum, seconds in limits:
                    start = now // seconds * seconds
                    bucket_id = f"{identity}:{name}:{seconds}:{start}"
                    bucket = db.get(RateLimitBucket, bucket_id)
                    if bucket and bucket.count >= maximum:
                        retry = max(retry, bucket.expires_at - now)
                    buckets.append(bucket or RateLimitBucket(id=bucket_id, expires_at=start + seconds))
            if retry:
                db.commit()
                return retry
            for bucket in buckets:
                bucket.count += 1
                db.add(bucket)
            db.commit()
        return 0
