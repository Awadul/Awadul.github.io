import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import { gsap } from 'gsap'
import { chatSpiralClip } from '../lib/chat-motion'
import { MessageSquare, X, Plus, Send, Trash2, History, FileText, ArrowUpRight, Mail } from 'lucide-react'
import { ChatError, chatApi, chatConfigured, readHistory, type Chat, type Message, type PendingTurn } from '../lib/chat-api'
import '../styles/chat.css'
import { ProjectBrief } from './ProjectBrief'
import { ChatProjects, ChatText } from './ChatProjects'

const key = 'portfolio-chat-session'
const pendingKey = 'portfolio-chat-pending'
const suggestions = ['What can you build for my business?', 'Tell me about your AI projects.', 'I need a custom CRM.']

function readPending(): PendingTurn | null {
  try { return JSON.parse(sessionStorage.getItem(pendingKey) || 'null') } catch { return null }
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [present, setPresent] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const entered = useRef(false)
  const reveal = useRef({progress:0})
  const [showHistory, setShowHistory] = useState(false)
  const [briefOpen, setBriefOpen] = useState(false)
  const [preparedBrief, setPreparedBrief] = useState<{ chatId: string; content: string; last_message_id: number } | null>(null)
  const [token, setToken] = useState('')
  const [chats, setChats] = useState<Chat[]>([])
  const [chatId, setChatId] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [pending, setPending] = useState<PendingTurn | null>(readPending)
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
  const [expired, setExpired] = useState(false)
  const panel = useRef<HTMLElement>(null)
  const input = useRef<HTMLTextAreaElement>(null)
  const launcher = useRef<HTMLButtonElement>(null)
  const bottom = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (open && !present) { setPresent(true); return }
    if (!present || !panel.current) return
    const node = panel.current
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    node.inert = true
    setRevealed(false)
    let width=node.offsetWidth, height=node.offsetHeight
    const spiralSupported=CSS.supports('clip-path','path("M0 0 L1 0 L1 1Z")')
    const draw=()=>{
      const amount=reveal.current.progress
      node.style.clipPath=spiralSupported?chatSpiralClip(amount,width,height)
        :amount>=.999?'none':`circle(${Math.hypot(width,height)/2*amount}px at 50% 50%)`
    }
    // Connection and brief states can resize the surface while it is opening.
    const observer=new ResizeObserver(()=>{width=node.offsetWidth;height=node.offsetHeight;if(reveal.current.progress<1)draw()})
    observer.observe(node)
    const finishClose=()=>{entered.current=false;setPresent(false)}
    const timeline=gsap.timeline()
    const settle=()=>{
      timeline.kill()
      reveal.current.progress=open?1:0
      gsap.set(node,{clearProps:'transform,opacity,clipPath,willChange'})
      if(open){entered.current=true;node.inert=false;setRevealed(true)}
      else finishClose()
    }
    if(preference.matches){settle();observer.disconnect();return}
    if(open&&!entered.current){
      reveal.current.progress=0
      gsap.set(node,{clearProps:'transform,opacity'})
      entered.current=true
    }
    draw()
    gsap.set(node,{willChange:'clip-path'})
    const duration=Math.abs((open?1:0)-reveal.current.progress)
    // The mask cuts the real dialog surface; no decorative overlay is involved.
    timeline.to(reveal.current,{progress:open?1:0,duration,ease:'none',onUpdate:draw},0)
    timeline.eventCallback('onComplete',()=>{
      if(open){
        gsap.set(node,{clearProps:'transform,opacity,clipPath,willChange'})
        node.inert=false;setRevealed(true)
      }
      else finishClose()
    })
    const changed=()=>{if(preference.matches)settle()}
    preference.addEventListener('change',changed)
    return()=>{timeline.kill();observer.disconnect();preference.removeEventListener('change',changed)}
  },[open,present])

  function report(cause: unknown) {
    setError(cause instanceof Error ? cause.message : 'Something went wrong. Please try again.')
    if (cause instanceof ChatError && cause.status === 401) setExpired(true)
  }

  async function initialize() {
    setLoading(true); setError(''); setExpired(false)
    try {
      const status = await chatApi<{ ready: boolean }>('/api/assistant')
      setReady(status.ready)
      let sessionToken = sessionStorage.getItem(key) || ''
      if (sessionToken) {
        try { await chatApi('/api/sessions/current', sessionToken) }
        catch (cause) {
          if (!(cause instanceof ChatError) || cause.status !== 401) throw cause
          sessionToken = ''; sessionStorage.removeItem(pendingKey); setPending(null)
        }
      }
      if (!sessionToken) {
        const session = await chatApi<{ token: string }>('/api/sessions', undefined, 'POST')
        sessionToken = session.token
        sessionStorage.setItem(key, sessionToken)
      }
      setToken(sessionToken)
      const history = await chatApi<Chat[]>('/api/chats?limit=100', sessionToken)
      setChats(history)
      const saved = readPending()
      const selected = history.find((chat) => chat.id === saved?.chatId) || history[0]
      setChatId(selected?.id || '')
      setMessages(selected ? await readHistory(selected.id, sessionToken) : [])
      setInitialized(true)
    } catch (cause) { report(cause) }
    finally { setLoading(false) }
  }

  useEffect(() => { if (open && !initialized) void initialize() }, [open])
  useEffect(() => { if (open && revealed && !loading) { if (input.current && !input.current.disabled) input.current.focus(); else panel.current?.focus() } }, [open, revealed, loading, present])
  useEffect(() => { bottom.current?.scrollIntoView({ block: 'nearest' }) }, [messages, busy, open])

  useEffect(() => {
    const offerKey = `portfolio-brief-offered:${chatId}`
    const lastUser = messages.filter((message) => message.role === 'user').at(-1)
    const previousReply = messages.slice(0, messages.findIndex((message) => message.id === lastUser?.id)).at(-1)?.content || ''
    const requestText = lastUser?.content.trim() || ''
    const explicitBrief = !/\b(?:don't|do not|not now|cancel)\b/i.test(requestText) && (
      /\b(?:create|prepare|make|generate|open|show|review|finalize)\b.{0,60}\bbrief\b/i.test(requestText)
      || (/^(?:yea|yeah|yes|ok|okay|please|sure|finalized|finalised|done)[\s,.!]*(?:please|finalized|finalised|do it)?[\s.!]*$/i.test(requestText) && /\b(?:project brief|prepare.{0,30}brief)\b/i.test(previousReply))
    )
    const requestKey = `portfolio-brief-request:${chatId}:${lastUser?.id}`
    if (!open || !chatId || !token || busy || loading || pending || briefOpen || draft.trim()
      || messages.at(-1)?.role !== 'assistant'
      || (explicitBrief ? sessionStorage.getItem(requestKey) : messages.filter((message) => message.role === 'user').length < 3 || sessionStorage.getItem(offerKey))) return
    let active = true
    void chatApi<{ ready?: boolean; content?: string; last_message_id?: number }>(`/api/chats/${chatId}/${explicitBrief ? 'summary' : 'brief-readiness'}`, token, 'POST')
      .then((result) => {
        if (!active || (!explicitBrief && !result.ready) || !result.content || !result.last_message_id) return
        sessionStorage.setItem(offerKey, '1')
        sessionStorage.setItem(requestKey, '1')
        setPreparedBrief({ chatId, content: result.content, last_message_id: result.last_message_id })
        setBriefOpen(true)
      })
      .catch(() => {
        if (active && explicitBrief) {
          sessionStorage.setItem(requestKey, '1')
          setBriefOpen(true) // The form offers manual editing and a visible retry/error path.
        }
      })
    return () => { active = false }
  }, [open, chatId, token, busy, loading, pending, briefOpen, draft, messages])

  function close() { setOpen(false); launcher.current?.focus() }
  function savePending(turn: PendingTurn | null) {
    setPending(turn)
    if (turn) sessionStorage.setItem(pendingKey, JSON.stringify(turn))
    else sessionStorage.removeItem(pendingKey)
  }

  async function selectChat(id: string) {
    setLoading(true); setError('')
    try {
      const history = id ? await readHistory(id, token) : []
      setMessages(history); setChatId(id); setDraft('')
    } catch (cause) { report(cause) }
    finally { setLoading(false) }
  }

  async function send(content: string, retry?: PendingTurn) {
    if (busy || loading || !content.trim() || !ready) return
    setBusy(true); setError('')
    let turn = retry
    try {
      let id = retry?.chatId || chatId
      if (!id) {
        const chat = await chatApi<Chat>('/api/chats', token, 'POST', { title: 'New conversation' })
        id = chat.id; setChatId(id); setChats((current) => [chat, ...current])
      }
      turn = retry || { chatId: id, requestId: crypto.randomUUID(), content: content.trim() }
      savePending(turn); setDraft('')
      const result = await chatApi<{ user: Message; assistant: Message }>(`/api/chats/${id}/turns`, token, 'POST', { content: turn.content, request_id: turn.requestId })
      setMessages((current) => [...current.filter((message) => message.id !== result.user.id && message.id !== result.assistant.id), result.user, result.assistant])
      savePending(null)
      setChats(await chatApi<Chat[]>('/api/chats?limit=100', token))
    } catch (cause) {
      report(cause)
      if (turn) {
        try { setMessages(await readHistory(turn.chatId, token)) } catch { /* Keep the original error and retry ID. */ }
      }
    } finally { setBusy(false); input.current?.focus() }
  }

  async function deleteChat() {
    if (!chatId || !window.confirm('Delete this conversation and its saved messages?')) return
    setLoading(true); setError('')
    try {
      await chatApi(`/api/chats/${chatId}`, token, 'DELETE')
      setChats((current) => current.filter((chat) => chat.id !== chatId))
      if (pending?.chatId === chatId) savePending(null)
      setChatId(''); setMessages([])
    } catch (cause) { report(cause) }
    finally { setLoading(false) }
  }

  const activePending = pending?.chatId === chatId ? pending : null
  const pendingVisible = activePending && !messages.some((message) => message.role === 'user' && message.content === activePending.content && message.id === messages.at(-1)?.id)
  function submit(event: FormEvent) { event.preventDefault(); void send(draft) }

  return (
    <div className="chat-widget">
      {present && (
        <section aria-hidden={!open} ref={panel} tabIndex={-1} className={`chat-panel ${error && !initialized ? 'is-offline' : ''}`} role="dialog" aria-label="Ask about Awais's work" onKeyDown={(event) => { if (event.key === 'Escape') close() }}>
          <header className="chat-header"><div><h2>Awais’s assistant</h2><p>AI guide to projects & services</p></div><div className="chat-header-actions"><button className="chat-icon" onClick={() => setShowHistory((value) => !value)} aria-label="Show conversation history" aria-expanded={showHistory} aria-controls="chat-controls" title="Conversation history"><History size={18} /></button><button className="chat-icon" onClick={close} aria-label="Close chat"><X size={20} /></button></div></header>
          <div className={`chat-connection ${ready && initialized ? 'is-ready' : ''}`} role="status"><span aria-hidden="true"/>{loading ? 'Connecting to your conversation…' : ready && initialized ? 'Ready to help' : 'Assistant unavailable — direct contact is open'}</div>
          {!briefOpen && showHistory && <div className="chat-toolbar" id="chat-controls">
            <label className="sr-only" htmlFor="chat-history">Conversation history</label>
            <select id="chat-history" value={chatId} disabled={busy || loading} onChange={(event) => void selectChat(event.target.value)}><option value="">New conversation</option>{chats.map((chat) => <option value={chat.id} key={chat.id}>{chat.title}</option>)}</select>
            <button className="chat-icon" disabled={busy || loading} onClick={() => void selectChat('')} aria-label="New conversation"><Plus size={18} /></button>
            <button className="chat-icon" disabled={busy || loading || !chatId} onClick={() => void deleteChat()} aria-label="Delete conversation"><Trash2 size={17} /></button>
          </div>}
          {briefOpen ? <ProjectBrief key={chatId} chatId={chatId} token={token} initialBrief={preparedBrief?.chatId === chatId && preparedBrief.last_message_id === messages.filter((message) => message.role === 'user').at(-1)?.id ? preparedBrief.content : undefined} onBack={() => setBriefOpen(false)} /> : <><div className="chat-transcript" aria-busy={busy || loading}>
            {loading ? <p className="chat-notice" role="status">Loading your conversation…</p> : <>
              {messages.length === 0 && !activePending && !error && <div className="chat-welcome"><h3>Explore the work.<br/>Find your next step.</h3><p className="chat-notice">Ask about projects, services, or the software you have in mind.</p><div className="chat-suggestions">{suggestions.map((suggestion, index) => <button key={suggestion} disabled={!ready || busy || !initialized} onClick={() => void send(suggestion)}><span>{['Explore services', 'See AI projects', 'Discuss a custom CRM'][index]}</span><ArrowUpRight size={16} aria-hidden="true"/></button>)}</div></div>}
              <div role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions text">
                {messages.map((message) => <div className={`chat-message chat-message-${message.role}`} key={message.id}><span>{message.role === 'user' ? 'You' : 'AI assistant'}</span><p><ChatText content={message.content} /></p>{message.role === 'assistant' && <ChatProjects content={message.content} />}</div>)}
                {pendingVisible && <div className="chat-message chat-message-user"><span>You</span><p>{activePending.content}</p></div>}
                {busy && <p className="chat-notice" role="status">Preparing a reply…</p>}
              </div>
              {!ready && initialized && <p className="chat-notice">The assistant is currently unavailable. You can reach Awais by email below.</p>}
              {activePending && !busy && !error && ready && <div className="chat-error"><p>A previous reply is unfinished. Resume it to continue this conversation.</p><button onClick={() => void send(activePending.content, activePending)}>Resume reply</button></div>}
            </>}
            {error && <div className={`chat-error ${!initialized ? 'chat-offline' : ''}`} role="alert">{!initialized && <><h3>Let’s connect directly.</h3><p>The AI assistant can’t connect right now. Email or WhatsApp Awais to discuss your project, or try reconnecting.</p></>}<p className="chat-error-detail">{error}</p>{expired ? <button onClick={() => { sessionStorage.removeItem(key); savePending(null); setInitialized(false); void initialize() }}>Start a new session</button> : activePending && !busy ? <button onClick={() => void send(activePending.content, activePending)}>Retry reply</button> : !initialized && !loading ? <button onClick={() => void initialize()}>Reconnect</button> : null}</div>}
            <div ref={bottom} />
          </div>
          {chatId && messages.some((message) => message.role === 'user') && <div className="chat-brief-action"><button className="work-btn work-btn-sm chat-brief-button" disabled={busy || loading || Boolean(activePending)} onClick={() => setBriefOpen(true)}><FileText size={15} aria-hidden="true" /><span>Prepare my project brief</span><ArrowUpRight className="chat-brief-arrow" size={14} aria-hidden="true" /></button></div>}
          {(!error || initialized) && <form className="chat-composer" onSubmit={submit}>
            <label className="sr-only" htmlFor="chat-message">Your message</label>
            <textarea ref={input} id="chat-message" rows={2} maxLength={8000} value={draft} placeholder="Ask about a project or share your idea…" disabled={!ready || !initialized || busy || loading || Boolean(activePending) || expired} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void send(draft) } }} />
            <button className="work-btn chat-send" type="submit" aria-label="Send message" disabled={!draft.trim() || !ready || busy || loading || Boolean(activePending) || expired}><Send size={18} /></button>
          </form>}</>}
          <footer className="chat-footer"><a href="mailto:awaisabdullahm@gmail.com"><Mail size={13} aria-hidden="true" />Email Awais</a><a href="https://wa.me/923437836578" target="_blank" rel="noreferrer"><MessageSquare size={13} aria-hidden="true" />WhatsApp</a></footer>
        </section>
      )}
      <button ref={launcher} className="work-btn chat-launcher" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? 'Close project chat' : 'Ask about my work'}><MessageSquare size={20} aria-hidden="true" /><span className="chat-launcher-label">Ask about my work</span><span className="chat-launcher-short" aria-hidden="true">{open ? 'Close' : 'Chat'}</span></button>
      {!chatConfigured && open && <span className="sr-only">Chat backend not configured.</span>}
    </div>
  )
}
