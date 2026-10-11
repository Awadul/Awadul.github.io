# Portfolio Chat Backend

FastAPI + SQLModel + SQLite + OpenAI Responses API. Manages anonymous visitor sessions,
conversations, message history, and AI replies grounded in the public portfolio.

## Run locally

From `D:\Awadul.github.io\backend` in PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements-dev.txt
Copy-Item .env.example .env  # Optional; defaults work locally. Do not overwrite an existing .env.
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 --no-proxy-headers
```

Interactive API docs: http://127.0.0.1:8000/docs
Health check: http://127.0.0.1:8000/health
Tests: `python -m pytest -q`

## Data and session flow

```text
Visitor session (1) ---- (many) Chats (1) ---- (many) Messages
```

1. `POST /api/sessions` returns a random bearer token **once**, plus session ID and expiry.
2. Send `Authorization: Bearer <token>` on every chat/history request.
3. `POST /api/chats` with `{"title":"Website inquiry"}` starts a conversation.
4. `POST /api/chats/{id}/messages` with `{"content":"Can you build a CRM?"}` stores a user message.
5. `GET /api/chats/{id}/messages?limit=50` returns messages oldest first.
   If `next_cursor` is non-null, request the next page with `?after=<next_cursor>&limit=50`.
6. `GET /api/chats?offset=0&limit=20` lists this visitor's chats, recently updated first.
7. `PATCH /api/chats/{id}` renames a chat; `DELETE /api/chats/{id}` removes it and its messages.
8. `GET /api/sessions/current` checks the session. `DELETE /api/sessions/current` removes
   the session, all its chats, and messages, and revokes its token.

Sessions expire after 30 days by default; expiry denies access but does not automatically
erase stored history. No public endpoint lists all sessions or other visitors' chats.
Tokens are hashed before storage and must be treated as passwords by the frontend.
Use browser sessionStorage for a tab-scoped session initially; closing the tab loses the
token. Never put tokens in URLs, analytics, or logs.

Visitors can submit **user messages only**. The server generates and stores assistant
replies; it never accepts visitor-supplied assistant roles or system instructions.

## AI chat and frontend

Set `OPENAI_API_KEY` (or `CHAT_OPENAI_API_KEY`) in `backend/.env` or the server's environment.
Use a file named `.env`, not `,env`. Restart the backend after changing settings.
The default model is `gpt-4.1-mini`, configurable with `CHAT_OPENAI_MODEL`.
Never expose the key in a frontend variable.

The portfolio's floating chat widget connects to `http://127.0.0.1:8000` in development.
For deployment set `VITE_CHAT_API_URL` to the HTTPS backend URL **before building**.
The production widget does not silently fall back to localhost. Configure the backend's
allowed CORS origin to match the deployed portfolio.

`GET /api/assistant` reports whether the key is configured (not whether provider billing
or availability is working). `POST /api/chats/{id}/turns` accepts:

```json
{"content":"Can you build a CRM?", "request_id":"e528a562-46fd-46e4-8051-082c88768c08"}
```

It saves the user message, calls OpenAI, saves the assistant response, and returns both.
Reuse the **same request ID and content** to retry a failed/ambiguous request. Completed
requests replay their saved result without calling the provider. Failed generation keeps
the user message without fabricating a reply. A short SQLite claim transaction prevents
overlapping generation in a conversation; it ends before the network call. A claim can
be retried after 90 seconds if the process crashes. Provider timeout is 45 seconds.

The provider receives the latest 20 messages, bounded to 24,000 characters, and the
approved `app/knowledge.md`. Responses use `store=False`; this is not a guarantee of
zero provider retention. Chats are stored locally in SQLite. The widget
shows text safely, restores history after reload in the same tab, and supports new
chats, deletion, and retry. Closing the tab loses its sessionStorage token.

AI calls are capped at 30 attempts per visitor per hour (configurable), with a 600-token
reply limit. These controls do not replace deployment-level rate limiting: an anonymous
visitor can create a new session. Persistent IP budgets now limit that bypass; add gateway controls and provider spending limits
before a public launch.

This change adds a `chat_turns` table on startup and preserves existing history tables.
Future changes to existing table columns will still require migrations.

## Configuration

Settings load from `backend/.env`, with the `CHAT_` prefix. See `.env.example`.
The database defaults to `backend/data/chat.sqlite3`, independent of the working directory.
SQLite uses foreign keys, cascading deletes, WAL mode, and a lock wait timeout.
Dates are UTC. The database, environment secrets, and virtual environment are ignored by Git.
The schema initializes on startup; schema changes will need migrations as the app evolves.

SQLite is appropriate for related session/chat/message records. A vector database would
be an additional knowledge-search component later, not a replacement for this history store.

## Before public deployment

- Run the API on a backend host with persistent disk; GitHub Pages only hosts the frontend.
- Add the exact deployed frontend origin to `CHAT_CORS_ORIGINS` and serve the API over HTTPS.
- Extend the included IP limits with global session/chat/message quotas and an expired-history
  retention cleanup before exposing anonymous writes to the internet. CORS is not rate limiting.
- Keep database backups private. Deleting a session does not erase historical backups.
- Keep provider credentials on the server; never use a Vite client variable for a secret.

Official references: [FastAPI SQL databases](https://fastapi.tiangolo.com/tutorial/sql-databases/),
[FastAPI CORS](https://fastapi.tiangolo.com/tutorial/cors/),
[SQLite foreign keys](https://www.sqlite.org/foreignkeys.html).

## Enquiries, summaries, and owner inbox

Open `http://127.0.0.1:3000/#/inbox`. The owner access key is `CHAT_ADMIN_TOKEN`
in `backend/.env`; it is server-only and must never use a Vite variable. The inbox
keeps the entered key in memory, clears it on lock/reload, and polls every 30 seconds
while visible. Owner API endpoints reject ordinary visitor tokens. Use HTTPS in production.

Visitors can choose **Prepare my project brief**, review/edit an AI summary, enter
their name and email, and explicitly consent before submitting. Submission is saved
before notification delivery. A conversation can have one enquiry; retrying submission
returns the same record. Statuses are new, contacted, and closed. Direct email remains
available as a human handoff. Relevant approved project links show compact previews.

AI summaries use only visitor statements, up to the latest 40 messages and 24,000
characters. They are cached against the last visitor message, limited to 10 new
generations per visitor per hour, and can be refreshed in the owner inbox. Summaries
are not confirmed requirements; the visitor-approved brief is stored separately.

Every minute, a maintenance task checks for conversations idle for 10 minutes
(`CHAT_DIGEST_IDLE_MINUTES`). It summarizes one eligible conversation per pass.
When configured, it emails an AI-generated digest for chats without a submitted
enquiry. A submitted enquiry uses its own approved-brief notification instead.
New visitor messages make an idle chat eligible for a later digest. Disable idle
emails with `CHAT_EMAIL_CHAT_DIGESTS=false`; inbox summaries still work.

### Gmail setup

Gmail defaults and a random owner access key have been initialized in the ignored
local `.env`. Add your **Google app password**, not your normal Gmail password:

```dotenv
CHAT_SMTP_HOST=smtp.gmail.com
CHAT_SMTP_PORT=587
CHAT_SMTP_USERNAME=awaisabdullahm@gmail.com
CHAT_SMTP_PASSWORD=your-app-password
CHAT_SMTP_FROM=awaisabdullahm@gmail.com
CHAT_NOTIFICATION_TO=awaisabdullahm@gmail.com
```

Restart the API after editing settings. SMTP uses STARTTLS with certificate verification.
Owner notification mail contains the submitted brief/contact details or an anonymous
chat summary. It never sends an automatic email to the visitor. Reply-To on an enquiry
notification points to the visitor's validated email address.

Enquiry emails have pending/sending/sent/failed states. Pending emails are attempted
on restart; failed ones can be retried from the inbox. Interrupted sends become failed
on restart. Idle digest delivery failures back off for an hour. SMTP cannot guarantee
exactly-once delivery across a process crash after acceptance, so an occasional duplicate
is possible. A sent status means SMTP accepted the message, not confirmed inbox delivery.

Run **one API worker** with this SQLite maintenance/outbox setup. For multiple workers
or larger volume, move maintenance to a dedicated job queue. The API must stay running
for idle summaries/emails. Deleting a conversation also deletes its summary, enquiry,
and digest records; previously delivered emails cannot be recalled.

New routes: visitor `POST /api/chats/{id}/summary` and `/enquiry`; owner
`GET /api/admin/conversations`, `GET /api/admin/conversations/{id}`,
`POST /api/admin/conversations/{id}/summary`, `PATCH /api/admin/enquiries/{id}`,
and `POST /api/admin/enquiries/{id}/notify`. Transcript and conversation lists are paginated.

## IP throttling

API requests now use persistent SQLite IP budgets, shared across visitor sessions
and chat IDs. Counters survive API restarts and do not disappear when a visitor
deletes a chat/session. Short atomic transactions prevent parallel-request bypass.
Rejected requests return HTTP 429, a `Retry-After` value in seconds, and a readable
message. Invalid attempts and duplicate retries also count toward these network
budgets; successful-response replay still avoids duplicate AI calls.

| Action | Per minute per IP | Per hour per IP |
| --- | ---: | ---: |
| All API requests combined | 120 | — |
| Create a session | 5 | 20 |
| Create a conversation | 10 | 60 |
| Generate an AI reply | 10 | 40 |
| Generate/read a brief through the summary action | 6 | 20 |
| Submit an enquiry | 3 | 10 |
| Save a message directly | 30 | 120 |

Existing per-session AI/summary limits remain in place. These are fixed windows;
adjacent window boundaries can permit two successive bursts. People sharing a
public IP share its budget. IPv4-mapped IPv6 addresses normalize to IPv4; native
IPv6 addresses share a /64 budget to limit privacy-address rotation.

IP identifiers are HMAC-hashed using `data/ip-throttle.key` beside the database;
raw IPs are not stored in the rate-limit table. Keep that ignored key private and
stable across restarts. Expired buckets are removed during subsequent requests.
This does not change Uvicorn or upstream access-log retention.

**Run Uvicorn with `--no-proxy-headers`**, including in deployment. Otherwise its
own proxy middleware may rewrite the peer before the application can validate it.
Direct clients' Forwarded/X-Forwarded-For/X-Real-IP headers are ignored by default.
Behind a reverse proxy, set `CHAT_TRUSTED_PROXY_CIDRS` to a JSON list containing
only your actual proxy addresses/networks. The proxy must overwrite or correctly
append X-Forwarded-For. The app walks that chain from the trusted transport peer
toward the first untrusted address. Never trust every IP or expose the backend
through a supposedly trusted proxy address that visitors can impersonate.

These controls reduce per-network spam and AI costs. They do not stop distributed
bots, replace an edge firewall/CAPTCHA, or impose a global database/email quota.
SQLite still assumes this application's single-worker deployment.
