import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useReducedMotion } from 'motion/react'
import myNext9to5Image from '../assets/Projects/mynext9to5.png'
import cargoExpressImage from '../assets/Projects/cargo-express-freight.png'
import pixalImage from '../assets/Projects/Pixal-craft.jpg'
import vanisherImage from '../assets/Projects/vanisher-showcase.png'
import travectioImage from '../assets/Projects/travectio-showcase.png'
import radwiImage from '../assets/Projects/radwi-website.jpg'
import { ArrowUpRight } from 'lucide-react'
import '../styles/projects.css'

// Client work from portfolio records; public repository links verified against GitHub.
const projects = [
  {
    id: 'ai-cv',
    title: 'MyNext9to5',
    shortDescription: 'Automated resume parsing and applicant scoring pipeline for client recruitment at scale.',
    longDescription: 'Recruiters need structured candidate information from unstructured resumes. This platform parses PDFs, extracts candidate data, and scores applicants against job criteria to support the review workflow.',
    tech: ['Next.js', 'OpenAI API', 'PostgreSQL', 'Supabase'],
    link: 'https://mynext9to5.com',
    github: null,
    image: myNext9to5Image
  },
  {
    id: 'cargo-crm',
    title: 'Cargo Express Freight CRM',
    shortDescription: 'Custom CRM for a freight and logistics company managing shipments and client operations.',
    longDescription: 'Freight teams need a shared view of shipment and customer information. This custom CRM brings shipment management and client operations into a web application built around the logistics workflow.',
    tech: ['React', 'Node.js', 'Express', 'PostgreSQL'],
    link: 'https://cargoexpressfreight.com/',
    linkText: 'Client Website',
    github: null,
    image: cargoExpressImage
  },
  {
    id: 'nust-bot',
    title: 'NUST Student Guide Bot',
    shortDescription: "RAG-based chatbot over NUST's entire policy document corpus with a custom hybrid retrieval pipeline.",
    longDescription: 'A collaborative academic Big Data project using TF-IDF, MinHash LSH, and SimHash in a custom policy-document retrieval pipeline.',
    tech: ['Python', 'TF-IDF', 'MinHash LSH', 'SimHash'],
    link: null,
    github: 'https://github.com/Awadul/NUST-Policy-Document-RAG-System',
    image: null
  },
  {
    id: 'radwi-platform',
    title: 'RADWI Corporate Platform',
    shortDescription: 'Corporate website redesign for an IoT hardware and engineering company.',
    longDescription: 'Engineering offerings need a clear client-facing presentation. The redesign work combines a reusable design system, responsive layouts, and scroll-triggered motion to present the company and its products.',
    tech: ['React.js', 'Tailwind CSS', 'Framer Motion'],
    link: 'https://rad-wi.com',
    github: 'https://github.com/Awadul/RADWI---Protype-Website-View',
    image: radwiImage
  },
  {
    id: 'pixal-craft', title: 'Pixal Craft',
    shortDescription: 'A creative web application with a focus on interface design.',
    longDescription: 'A public frontend project demonstrating React development and a polished visual interface. Explore the deployed application and source to see the implementation.',
    tech: ['React', 'JavaScript'], link: 'https://pixal-craft.vercel.app',
    github: 'https://github.com/Awadul/PixalCraft', image: pixalImage
  },
  {
    id: 'travectio', title: 'Travectio Solutions',
    shortDescription: 'A financial decision platform for transportation companies, bringing operating costs and projected profitability into focus.',
    longDescription: 'Travectio presents vehicle-specific operating costs, cost-per-mile analysis, and projected margins to support transportation decisions before work begins.',
    tech: ['Financial workflows', 'Transportation', 'Web platform'],
    link: 'https://travectiosolutions.com/', github: null, image: travectioImage
  },
  {
    id: 'vanisher', title: 'Vanisher Chrome Extension',
    shortDescription: 'Schedule browser-data cleanup or clear selected data on demand, entirely on your device.',
    longDescription: 'An open-source Manifest V3 extension using Chrome alarms, browsingData, and local storage for scheduled cleanup and persistent preferences.',
    tech: ['JavaScript', 'Manifest V3', 'Chrome APIs'],
    link: 'https://chromewebstore.google.com/detail/vanisher-auto-delete-brow/bebdehdpolcbjpbbcgmcfalppgbfhind?authuser=0&hl=en',
    linkText: 'Chrome Web Store',
    github: 'https://github.com/Awadul/Vanisher-Extension', image: vanisherImage
  },
  {
    id: 'data-scraping', title: 'Freelance Data Scraping',
    shortDescription: 'A collection of data scraping projects developed for freelance work.',
    longDescription: 'Businesses often need information gathered from scattered web sources. This repository collects freelance scraping work and offers source examples of data collection automation.',
    tech: ['Data collection', 'Automation'], link: null,
    github: 'https://github.com/Awadul/Data-Scraping', image: null
  }

]

const projectFocus: Record<string, { category: string; skill: string; flow?: string[] }> = {
  'ai-cv': { category: 'Client work / Recruitment', skill: 'Document processing & AI integration', flow: ['Resume PDFs', 'Structured candidate data', 'Job-criteria scoring'] },
  'cargo-crm': { category: 'Client work / Logistics', skill: 'Full-stack workflows & relational data' },
  'nust-bot': { category: 'Academic / AI retrieval', skill: 'Custom retrieval & document search', flow: ['Policy documents', 'Hybrid retrieval', 'Relevant context'] },
  'radwi-platform': { category: 'Corporate website / Engineering', skill: 'Design systems & interface animation' },
  'pixal-craft': { category: 'Creative / Frontend', skill: 'React interfaces & visual design' },
  'travectio': { category: 'Business platform / Transportation', skill: 'Financial workflows & product presentation' },
  'vanisher': { category: 'Chrome extension / Privacy', skill: 'Browser APIs & background service workers' },
  'data-scraping': { category: 'Freelance / Automation', skill: 'Web data collection & workflow automation' },
}

// Stable image-first order keeps actual product previews at the front.
const orderedProjects = [...projects].sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image)))

export function ProjectCarousel() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const [drop, setDrop] = useState<{ y: number; radius: number } | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || reduceMotion || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const rect = section.getBoundingClientRect()
      const y = Math.max(0, Math.min(rect.height, window.innerHeight / 2 - rect.top))
      setDrop({ y, radius: Math.hypot(rect.width / 2, Math.max(y, rect.height - y)) + 24 })
      observer.disconnect()
    }, { rootMargin: '0px 0px -25% 0px', threshold: 0 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [reduceMotion])

  return (
    <section ref={sectionRef} id="projects" className="project-showcase" aria-labelledby="selected-work-heading">
      {drop && !reduceMotion && <div className="project-drop-reveal" aria-hidden="true"
        style={{ '--drop-y': `${drop.y}px`, '--drop-end': `${drop.radius}px` } as CSSProperties}
        onAnimationEnd={() => setDrop(null)} />}
      <div className="project-container">
        <header className="project-heading">
          <div><h2 id="selected-work-heading">Selected work</h2><p>A closer look at the work.</p></div>
          <a href="https://github.com/Awadul" target="_blank" rel="noreferrer">More on GitHub <ArrowUpRight size={18} aria-hidden="true" /></a>
        </header>
        <div className="project-gallery">
          {orderedProjects.map(project => {
            const focus = projectFocus[project.id]
            const screenshot = project.image
            return (
              <article key={project.id} className="project-entry">
                <a className="project-card-link" href={project.link || project.github || undefined} target="_blank" rel="noreferrer" aria-label={`Explore ${project.title}${project.link ? ' website' : ' source code'} (opens in a new tab)`}>
                  <div className={`project-preview ${['vanisher', 'travectio'].includes(project.id) ? 'project-preview-artwork' : ''}`}>
                    {screenshot ? <img src={screenshot} alt="" loading="lazy" /> : (
                      <div className="project-system" aria-hidden="true">
                        <p>{focus.skill}</p><strong>{project.title}</strong>
                        {focus.flow ? <ol>{focus.flow.map(step => <li key={step}>{step}</li>)}</ol> : <span>{project.tech.join(' / ')}</span>}
                      </div>
                    )}
                    <div className="project-overlay">
                      <p className="project-overlay-description">{project.shortDescription}</p>
                      <p className="project-overlay-skill">{focus.skill}</p>
                      <ul aria-label="Technologies">{project.tech.map(tech => <li key={tech}>{tech}</li>)}</ul>
                      <span className="project-overlay-action">{project.link ? ('linkText' in project ? (project.linkText === 'Chrome Web Store' ? 'View in Chrome Web Store' : 'Visit client website') : 'Explore project') : 'Explore source code'} <ArrowUpRight size={18} aria-hidden="true" /></span>
                    </div>
                  </div>
                  <div className="project-caption"><div><h3>{project.title}</h3><p>{focus.category}</p></div><ArrowUpRight size={22} aria-hidden="true" /></div>
                </a>
              </article>
            )
          })}
        </div>
        <div className="project-closing"><p>Have a project in mind?</p><a className="work-btn" href="#contact">Let’s discuss your project <ArrowUpRight size={18} aria-hidden="true" /></a></div>
      </div>
    </section>
  )
}
