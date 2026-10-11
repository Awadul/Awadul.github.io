export type Chat = { id: string; title: string }
export type Message = { id: number; chat_id: string; role: 'user' | 'assistant'; content: string }
export type PendingTurn = { chatId: string; requestId: string; content: string }

const configured = import.meta.env.VITE_CHAT_API_URL?.trim()
const base = (configured || (import.meta.env.DEV ? 'http://127.0.0.1:8000' : '')).replace(/\/$/, '')
export const chatConfigured = Boolean(base)

export class ChatError extends Error {
  constructor(message: string, public status: number) { super(message) }
}

export async function chatApi<T>(path: string, token?: string, method = 'GET', body?: unknown): Promise<T> {
  if (!base) throw new ChatError('Chat is not available here yet. Please email Awais.', 503)
  let response: Response
  try {
    response = await fetch(`${base}${path}`, {
      method, headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(60000),
    })
  } catch {
    throw new ChatError('Could not reach the assistant. Please retry or email Awais.', 0)
  }
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new ChatError(typeof data.detail === 'string' ? data.detail : 'Could not complete this request. Please try again.', response.status)
  }
  return response.status === 204 ? undefined as T : response.json()
}

export async function readHistory(chatId: string, token: string): Promise<Message[]> {
  const messages: Message[] = []
  let cursor = 0
  do {
    const page = await chatApi<{ items: Message[]; next_cursor: number | null }>(`/api/chats/${chatId}/messages?after=${cursor}&limit=100`, token)
    messages.push(...page.items)
    if (page.next_cursor === null) break
    cursor = page.next_cursor
  } while (true)
  return messages
}
