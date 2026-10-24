import { useEffect, useState } from 'react'
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

export default function App() {
 const [hash, setHash] = useState(window.location.hash)
 useEffect(() => {
  const changed = () => setHash(window.location.hash)
  window.addEventListener('hashchange', changed)
  return () => window.removeEventListener('hashchange', changed)
 }, [])
 if (hash === '#/inbox') return <OwnerInbox />
 return <div className="app-portfolio">
  <a className="skip-link" href="#main-content">Skip to content</a>
  <main id="main-content" tabIndex={-1}>
   <div id="hero" className="hero-shell"><Navigation/><Hero/></div>
   <ProjectCarousel/>
   <Services/>
   <About/>
   <TechStack/>
   <Contact/>
  </main>
  <ScrollExperience/>
  <ChatWidget/>
 </div>
}
