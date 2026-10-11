import { useEffect, useState, type FormEvent } from 'react'
import { chatApi, ChatError, type Message } from '../lib/chat-api'
import '../styles/inbox.css'

type Enquiry = { id: string; name: string; email: string; brief: string; status: 'new' | 'contacted' | 'closed'; notification_status: string }
type Conversation = { id: string; title: string; updated_at: string; message_count: number; preview: string; summary: string | null; summary_stale: boolean; digest_status: string | null; enquiry: Enquiry | null }
type Inbox = { items: Conversation[]; total: number; new_enquiries: number; email_ready: boolean }

export function OwnerInbox() {
  const [credential, setCredential] = useState('')
  const [token, setToken] = useState('')
  const [data, setData] = useState<Inbox | null>(null)
  const [offset, setOffset] = useState(0)
  const [selectedId, setSelectedId] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [updated, setUpdated] = useState('')
  const selected = data?.items.find((item) => item.id === selectedId)
  useEffect(() => {
    const previous = document.title
    document.title = `${data?.new_enquiries || 0} new enquiries · Portfolio inbox`
    return () => { document.title = previous }
  }, [data?.new_enquiries])

  function report(cause: unknown) {
    setError(cause instanceof Error ? cause.message : 'Could not load the inbox.')
    if (cause instanceof ChatError && cause.status === 401) { setToken(''); setData(null); setMessages([]) }
  }
  async function refresh() {
    const result = await chatApi<Inbox>(`/api/admin/conversations?offset=${offset}&limit=20`, token)
    setData(result); setUpdated(new Date().toLocaleTimeString()); return result
  }
  useEffect(() => {
    if (!token) return
    let active = true
    async function poll() {
      try {
        const result = await chatApi<Inbox>(`/api/admin/conversations?offset=${offset}&limit=20`, token)
        if (active) { setData(result); setUpdated(new Date().toLocaleTimeString()); setError('') }
      } catch (cause) { if (active) report(cause) }
    }
    void poll()
    const interval = window.setInterval(() => { if (!document.hidden) void poll() }, 30000)
    return () => { active = false; window.clearInterval(interval) }
  }, [token, offset])

  useEffect(() => {
    if (!selectedId || !token) return
    let active = true
    setLoadingMessages(true); setMessages([])
    async function read() {
      const result: Message[] = []; let cursor = 0
      do {
        const page = await chatApi<{ items: Message[]; next_cursor: number | null }>(`/api/admin/conversations/${selectedId}?after=${cursor}`, token)
        result.push(...page.items)
        if (page.next_cursor === null) break
        cursor = page.next_cursor
      } while (active)
      if (active) setMessages(result)
    }
    void read().catch((cause) => { if (active) report(cause) }).finally(() => { if (active) setLoadingMessages(false) })
    return () => { active = false }
  }, [selectedId, token, selected?.message_count])

  async function action(path: string, method = 'POST', body?: unknown) {
    setBusy(true); setError('')
    try { await chatApi(path, token, method, body); await refresh() }
    catch (cause) { report(cause) }
    finally { setBusy(false) }
  }
  function login(event: FormEvent) { event.preventDefault(); setError(''); setToken(credential.trim()); setCredential('') }
  function logout() { setToken(''); setData(null); setMessages([]); setSelectedId(''); setError('') }

  return <main className="owner-inbox">
    <header><div><a href="#">← Portfolio</a><h1>Conversation inbox</h1><p>Project enquiries and the conversations behind them.</p></div>{token && <button className="work-btn work-btn-ghost" onClick={logout}>Lock inbox</button>}</header>
    {!token ? <form className="inbox-login" onSubmit={login}><h2>Owner access</h2><p>Use CHAT_ADMIN_TOKEN from your backend environment. It stays in memory until you lock or reload this page.</p><label>Owner access key<input className="work-input" type="password" autoComplete="off" value={credential} onChange={(event) => setCredential(event.target.value)} required /></label><button className="work-btn" type="submit">Open inbox</button></form> : <>
      <div className="inbox-status"><p>{data ? `${data.new_enquiries} new enquiries · ${data.total} conversations` : 'Loading inbox…'}</p><div><span>{updated && `Updated ${updated}`}</span><button className="work-btn work-btn-ghost work-btn-sm" disabled={busy} onClick={() => { setBusy(true); void refresh().catch(report).finally(() => setBusy(false)) }}>Refresh</button></div></div>
      {data && !data.email_ready && <p className="inbox-notice">Email sender setup is incomplete. Enquiries stay saved; notification emails are queued.</p>}
      <div className="inbox-layout"><aside aria-label="Conversations">
        {data?.items.length === 0 && <p className="inbox-empty">No conversations yet.</p>}
        {data?.items.map((item) => <button className={`inbox-row ${selectedId === item.id ? 'is-selected' : ''}`} key={item.id} onClick={() => setSelectedId(item.id)} aria-pressed={selectedId === item.id}><span>{item.enquiry ? item.enquiry.name : 'Anonymous visitor'}<small>{item.enquiry?.status || 'Chat only'}</small></span><strong>{item.title}</strong><p>{item.preview}</p><time>{new Date(item.updated_at).toLocaleString()}</time></button>)}
        <nav aria-label="Conversation pages"><button className="work-btn work-btn-ghost work-btn-sm" disabled={offset === 0} onClick={() => { setOffset(Math.max(0, offset - 20)); setSelectedId('') }}>Previous</button><button className="work-btn work-btn-ghost work-btn-sm" disabled={!data || offset + 20 >= data.total} onClick={() => { setOffset(offset + 20); setSelectedId('') }}>Next</button></nav>
      </aside><section className="inbox-detail" aria-label="Conversation details">
        {!selected ? <div className="inbox-empty"><h2>Select a conversation</h2><p>Review a summary, read the chat, and follow up on an enquiry.</p></div> : <>
          <h2>{selected.title}</h2>
          {selected.enquiry && <section className="inbox-enquiry"><div><h3>{selected.enquiry.name}</h3><a href={`mailto:${selected.enquiry.email}`}>{selected.enquiry.email}</a></div><label>Enquiry status<select className="work-select" value={selected.enquiry.status} disabled={busy} onChange={(event) => void action(`/api/admin/enquiries/${selected.enquiry!.id}`, 'PATCH', { status: event.target.value })}><option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option></select></label><p>Email notification: <strong>{selected.enquiry.notification_status}</strong></p>{['failed', 'pending'].includes(selected.enquiry.notification_status) && <button className="work-btn work-btn-ghost work-btn-sm" disabled={busy || !data?.email_ready} onClick={() => void action(`/api/admin/enquiries/${selected.enquiry!.id}/notify`)}>Retry email</button>}<h3>Visitor-approved brief</h3><p className="inbox-copy">{selected.enquiry.brief}</p></section>}
          <section className="inbox-summary"><div><h3>Chat summary{selected.summary_stale ? ' · needs refresh' : ''}</h3><button className="work-btn work-btn-ghost work-btn-sm" disabled={busy || selected.message_count === 0} onClick={() => void action(`/api/admin/conversations/${selected.id}/summary`)}>{busy ? 'Working…' : selected.summary ? 'Refresh summary' : 'Summarize chat'}</button></div><p className="inbox-copy">{selected.summary || 'Generate a concise brief from the visitor’s messages. No email is sent by this action.'}</p></section>
          <h3>Conversation</h3>{loadingMessages && <p role="status">Loading messages…</p>}{messages.map((message) => <article className={`inbox-message inbox-message-${message.role}`} key={message.id}><strong>{message.role === 'user' ? 'Visitor' : 'AI assistant'}</strong><p className="inbox-copy">{message.content}</p></article>)}
        </>}
      </section></div>
    </>}
    {error && <p className="inbox-error" role="alert">{error}</p>}
  </main>
}
