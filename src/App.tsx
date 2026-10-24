import { useEffect, useState, useRef, useCallback } from 'react'
import { SiteIntro } from './components/SiteIntro'
import { Navigation } from './components/Navigation'
import { Hero } from './components/Hero'
import { ProjectCarousel } from './components/ProjectCarousel'
import { Services } from './components/Services'
import { About } from './components/About'
import { TechStack } from './components/TechStack'
import { Contact } from './components/Contact'
import { ChatWidget } from './components/ChatWidget'
import { OwnerInbox } from './components/OwnerInbox'
import { ScrollExperience } from './components/ScrollExperience'
import { MembraneBackground } from './components/MembraneBackground'

export default function App() {
 const [hash, setHash] = useState(window.location.hash)
 const [intro, setIntro] = useState(() => ['', '#', '#/'].includes(window.location.hash) && !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
 const [revealing, setRevealing] = useState(false)
 const page = useRef<HTMLDivElement>(null)
 const completedIntro = useRef(false)
 const finishIntro = useCallback(() => { completedIntro.current = true; setIntro(false) }, [])
 const revealPage = useCallback(() => setRevealing(true), [])
 useEffect(() => {
  if (page.current) page.current.inert = intro
  if (!intro && completedIntro.current) {
   document.getElementById('main-content')?.focus({ preventScroll:true })
   completedIntro.current = false
  }
 }, [intro, hash])
 useEffect(() => {
  if (!['', '#', '#/'].includes(hash)) setIntro(false)
 }, [hash])
 useEffect(() => {
  const changed = () => setHash(window.location.hash)
  window.addEventListener('hashchange', changed)
  return () => window.removeEventListener('hashchange', changed)
 }, [])
 if (hash === '#/inbox') return <OwnerInbox />
 return <>
 {intro && <SiteIntro onComplete={finishIntro} onReveal={revealPage}/>}
 <div ref={page} className="app-portfolio" aria-hidden={intro || undefined}>
  <div className="cloud-parallax" aria-hidden="true"/>
  <MembraneBackground page/>
  <a className="skip-link" href="#main-content">Skip to content</a>
  <main id="main-content" tabIndex={-1}>
   <div id="hero" className="hero-shell"><Navigation/><Hero/></div>
   <ProjectCarousel/>
   <Services/>
   <About/>
   <TechStack/>
   <Contact/>
  </main>
  {(!intro || revealing) && <ScrollExperience/>}
  <ChatWidget/>
 </div>
 </>
}
