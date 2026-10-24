import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowUpRight } from 'lucide-react'
import '../styles/site-intro.css'

const questions = [
 ['Need a', 'digital solution?'],
 ['Automate', 'the boring stuff?'],
 ['Build your', 'online presence?'],
 ['Ready to', 'go 10×?'],
]

export function SiteIntro({ onComplete, onReveal }: { onComplete: () => void; onReveal: () => void }) {
 const root = useRef<HTMLElement>(null)
 const skip = useRef<HTMLButtonElement>(null)
 useLayoutEffect(() => {
  let finished = false
  const complete = () => { if (!finished) { finished = true; onComplete() } }
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (preference.matches) { complete(); return }
  const previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  skip.current?.focus({ preventScroll:true })
  const context = gsap.context(() => {
   const slides = gsap.utils.toArray<HTMLElement>('.intro-question')
   const ornaments = gsap.utils.toArray<HTMLElement>('.intro-glyph')
   const timeline = gsap.timeline({ onComplete:complete })
   slides.forEach((slide, index) => {
    const start = index * 2.3
    timeline.fromTo(slide,
     { autoAlpha:0, rotation:-18, yPercent:100, scale:1.5, transformOrigin:'15% 100%' },
     { autoAlpha:1, rotation:0, yPercent:0, scale:1, duration:.65, ease:'expo.out' }, start)
    timeline.fromTo(ornaments[index],
     { rotation:-100, scale:.6, autoAlpha:0 },
     { rotation:0, scale:1, autoAlpha:1, duration:.8, ease:'power3.out' },start)
    timeline.to(slide, { rotation:13, yPercent:-95, scale:1.55, autoAlpha:0, duration:.45, ease:'power3.in' },start+1.85)
    timeline.to(ornaments[index], { rotation:80, scale:1.35, autoAlpha:0, duration:.45, ease:'power3.in' },start+1.85)
   })
   timeline.call(onReveal, [], 9.2)
   timeline.to(root.current, { yPercent:-100, duration:.7, ease:'power3.inOut' },9.2)
   timeline.fromTo('.intro-progress-fill',{scaleX:0},{scaleX:1,duration:9.2,ease:'none'},0)
   const syncVisibility = () => document.hidden ? timeline.pause() : timeline.resume()
   document.addEventListener('visibilitychange',syncVisibility)
   if (document.hidden) timeline.pause()
   return () => document.removeEventListener('visibilitychange',syncVisibility)
  }, root)
  const escape = (event:KeyboardEvent) => { if (event.key === 'Escape') complete() }
  const syncMotion = () => { if (preference.matches) complete() }
  window.addEventListener('keydown',escape)
  preference.addEventListener('change',syncMotion)
  return () => {
   finished = true
   context.revert()
   window.removeEventListener('keydown',escape)
   preference.removeEventListener('change',syncMotion)
   document.body.style.overflow = previousOverflow
  }
 }, [onComplete, onReveal])
 return <section ref={root} className="site-intro" aria-label="Welcome to Awais’s portfolio">
  <p className="sr-only">Need a digital solution? Automate the boring stuff? Build your online presence? Ready to go ten times further? The portfolio opens after this introduction. You can skip it now.</p>
  <div className="intro-stage" aria-hidden="true">{questions.map(([first, second]) =>
   <div className="intro-beat" key={second}>
    <span className="intro-glyph">?</span>
    <div className="intro-question"><span>{first}</span><span>{second}</span></div>
   </div>
  )}</div>
  <button ref={skip} className="work-btn work-btn-ghost intro-skip" onClick={onComplete}>Skip intro <ArrowUpRight size={16} aria-hidden="true"/></button>
  <div className="intro-progress" aria-hidden="true"><div className="intro-progress-fill"/></div>
 </section>
}
