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

export function SiteIntro({ onComplete }: { onComplete: () => void }) {
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
   const timeline = gsap.timeline({ onComplete:complete })
   slides.forEach((slide, index) => {
    const start = index * 1.5
    // Keep the reading position fixed; only opacity changes between questions.
    timeline.fromTo(slide,
     { autoAlpha:0 },
     { autoAlpha:1, duration:.25, ease:'sine.out' }, start)
    timeline.to(slide, { autoAlpha:0, duration:.2, ease:'sine.in' },start+1.3)
   })
   timeline.to(root.current, { opacity:0, duration:.4, ease:'sine.inOut' },6)
   timeline.fromTo('.intro-progress-fill',{scaleX:0},{scaleX:1,duration:6,ease:'none'},0)
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
 }, [onComplete])
 return <section ref={root} className="site-intro" aria-label="Welcome to Awais’s portfolio">
  <p className="sr-only">Need a digital solution? Automate the boring stuff? Build your online presence? Ready to go ten times further? The portfolio opens after this introduction. You can skip it now.</p>
  <div className="intro-stage" aria-hidden="true">{questions.map(([first, second]) =>
   <div className="intro-beat" key={second}>
    <div className="intro-question"><span>{first}</span><span>{second}</span></div>
   </div>
  )}</div>
  <button ref={skip} className="work-btn work-btn-ghost intro-skip" onClick={onComplete}>Skip intro <ArrowUpRight size={16} aria-hidden="true"/></button>
  <div className="intro-progress" aria-hidden="true"><div className="intro-progress-fill"/></div>
 </section>
}
