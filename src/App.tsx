import { Navigation } from './components/Navigation'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { ProjectCarousel } from './components/ProjectCarousel'
import { TechStack } from './components/TechStack'
import { Contact } from './components/Contact'

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <div id="hero">
          <Hero />
        </div>
        
        <About />
        
        <ProjectCarousel />
        
        <TechStack />
        
        <Contact />
      </main>

    </div>
  )
}