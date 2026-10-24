const INTRO_SEEN_KEY = 'portfolio-intro-seen-v1'
let seenInThisPage = false

export function shouldShowIntro() {
 if (!['', '#', '#/'].includes(window.location.hash) || window.matchMedia('(prefers-reduced-motion: reduce)').matches || seenInThisPage) return false
 try {
  return window.sessionStorage.getItem(INTRO_SEEN_KEY) !== '1'
 } catch {
  // Storage restrictions should never prevent the portfolio from opening.
  return true
 }
}

export function rememberIntro() {
 seenInThisPage = true
 try {
  window.sessionStorage.setItem(INTRO_SEEN_KEY, '1')
 } catch {
  // The in-memory flag still prevents repeats within this page.
 }
}
