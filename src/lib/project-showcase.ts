const REVEAL_KEY = 'portfolio-project-film-transparent-v5'
let revealSeen = false
export function hasSeenProjectReveal() {
 try { return revealSeen || window.sessionStorage.getItem(REVEAL_KEY) === 'true' } catch { return revealSeen }
}
export function rememberProjectReveal() {
 revealSeen = true
 try { window.sessionStorage.setItem(REVEAL_KEY, 'true') } catch { /* Session memory still avoids repeated playback. */ }
}
