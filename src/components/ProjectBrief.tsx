import { useEffect, useRef, useState, type FormEvent } from 'react'
import { chatApi } from '../lib/chat-api'

export function ProjectBrief({ chatId, token, initialBrief, onBack }: { chatId: string; token: string; initialBrief?: string; onBack: () => void }) {
  const [brief, setBrief] = useState(initialBrief || '')
  const heading = useRef<HTMLHeadingElement>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(!initialBrief)
  const [sending, setSending] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    heading.current?.focus()
    if (initialBrief) return
    let active = true
    chatApi<{ content: string }>(`/api/chats/${chatId}/summary`, token, 'POST')
      .then((result) => { if (active) setBrief(result.content) })
      .catch((cause) => { if (active) setError(cause.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [chatId, token, initialBrief])

  async function submit(event: FormEvent) {
    event.preventDefault(); setSending(true); setError('')
    try {
      await chatApi(`/api/chats/${chatId}/enquiry`, token, 'POST', { name, email, brief, consent })
      setSaved(true)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not save the enquiry.') }
    finally { setSending(false) }
  }

  return <div className="chat-brief">
    <button className="work-btn work-btn-ghost work-btn-sm" disabled={sending} onClick={onBack}>← Back to chat</button>
    {saved ? <div role="status"><h3>Enquiry saved.</h3><p>Thanks, {name}. Your brief and contact details are ready for Awais to review. You can also reach him directly below.</p></div> : <>
      <h3 ref={heading} tabIndex={-1}>Your project brief</h3><p>{initialBrief ? 'There’s enough detail for a first draft. Review and send it, or return to chat.' : 'Review and edit before sharing.'}</p>
      {loading && <p role="status">Preparing your summary…</p>}
      <form onSubmit={submit}>
        <label>Project summary<textarea className="work-textarea" value={brief} onChange={(event) => setBrief(event.target.value)} rows={8} minLength={10} maxLength={6000} required disabled={loading || sending} /></label>
        <label>Your name<input className="work-input" value={name} onChange={(event) => setName(event.target.value)} maxLength={100} autoComplete="name" required disabled={sending} /></label>
        <label>Email<input className="work-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} maxLength={254} autoComplete="email" required disabled={sending} /></label>
        <label className="chat-consent"><input className="work-checkbox work-checkbox-sm" type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required disabled={sending} /><span>Share this brief and my contact details with Awais for a reply.</span></label>
        <button className="work-btn" disabled={loading || sending || !consent || brief.trim().length < 10}>{sending ? 'Saving…' : 'Send my enquiry'}</button>
      </form>
    </>}
    {error && <p className="chat-error" role="alert">{error}</p>}
  </div>
}
