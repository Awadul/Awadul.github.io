import { Navigation } from './components/Navigation'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { ProjectCarousel } from './components/ProjectCarousel'
import { TechStack } from './components/TechStack'
import { Services } from './components/Services'
import { ProofOfWork } from './components/ProofOfWork'
import { Contact } from './components/Contact'
import { ChatWidget } from './components/ChatWidget'
import { OwnerInbox } from './components/OwnerInbox'
import { useEffect, useState } from 'react'

export default function App() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const changed = () => setHash(window.location.hash)
    window.addEventListener('hashchange', changed)
    return () => window.removeEventListener('hashchange', changed)
  }, [])
  if (hash === '#/inbox') return <OwnerInbox />
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        <div id="hero">
          <Hero />
        </div>

        <ProjectCarousel />

        <About />

        <Services />

        <ProofOfWork />

        <TechStack />

        <Contact />
      </main>

      <ChatWidget />

    </div>
  )
}
