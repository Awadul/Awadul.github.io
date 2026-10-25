import { useState, useLayoutEffect, useMemo, useCallback, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '../data/projects'
import { ProjectReveal } from './ProjectReveal'
import { hasSeenProjectReveal, rememberProjectReveal } from '../lib/project-showcase'
import '../styles/projects.css'
import '../styles/project-scenes.css'

const filters = ['All', 'Client work', 'Personal projects'] as const
type Filter = typeof filters[number]
const personal = new Set(['pixal-craft', 'vanisher'])
const skipReveal = () => hasSeenProjectReveal() || window.matchMedia('(prefers-reduced-motion:reduce)').matches

export function ProjectCarousel() {
 const [filter, setFilter] = useState<Filter>('All')
 const [revealDone, setRevealDone] = useState(skipReveal)
 const [cardsReady, setCardsReady] = useState(skipReveal)
 const [arriving, setArriving] = useState(false)
 const handedOff = useRef(false)
 const visible = useMemo(() => projects.filter(project => filter === 'All' || (filter === 'Personal projects' ? personal.has(project.id) : !personal.has(project.id))), [filter])
 const revealCards = useCallback(() => {
  if (handedOff.current) return
  handedOff.current = true
  setCardsReady(true)
  setArriving(!window.matchMedia('(prefers-reduced-motion:reduce)').matches)
 }, [])
 const finishReveal = useCallback(() => {
  revealCards()
  rememberProjectReveal()
  setRevealDone(true)
 }, [revealCards])
 useLayoutEffect(() => {
  const media = window.matchMedia('(prefers-reduced-motion:reduce)')
  const sync = () => { if (media.matches) { setArriving(false); finishReveal() } }
  media.addEventListener('change', sync)
  return () => media.removeEventListener('change', sync)
 }, [finishReveal])

 return <section id="projects" className="project-showcase project-canvas panel" aria-labelledby="selected-work-heading">
  <header className="display-heading"><span className="section-watermark" aria-hidden="true">PORTFOLIO</span><h2 id="selected-work-heading">/SELECTED WORK</h2></header>
  <div className="project-toolbar">
   <div className="project-filters" role="group" aria-label="Filter projects">{filters.map(item => <button key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div>
   <a className="work-btn work-btn-ghost project-code-link" href="https://github.com/Awadul" target="_blank" rel="noreferrer">View all code <ArrowUpRight size={14} aria-hidden="true"/></a>
  </div>
  <p className="sr-only" aria-live="polite">{visible.length} projects shown</p>
  <div className={`project-gallery${arriving ? ' is-arriving' : ''}`} data-reveal-pending={!cardsReady ? 'true' : undefined} onAnimationEnd={event => { if (event.animationName === 'project-cards-arrive') setArriving(false) }}>
   {!revealDone && <ProjectReveal onReveal={revealCards} onComplete={finishReveal}/>}
   {visible.map(project => <article className="project-entry" key={project.id} id={`project-${project.id}`} data-project-id={project.id} tabIndex={-1}>
    <a className="project-card-link" href={project.link} target="_blank" rel="noreferrer" aria-label={`Explore ${project.title} (opens in a new tab)`}>
     <div className={`project-preview ${['vanisher', 'travectio'].includes(project.id) ? 'project-preview-artwork' : ''}`}><img src={project.image} alt="" loading="lazy"/><span className="project-kind">{personal.has(project.id) ? 'Independent project' : 'Client project'}</span><span className="project-open" aria-hidden="true"><ArrowUpRight size={25}/></span></div>
     <div className="project-caption"><h3>{project.title}</h3><p>{project.shortDescription}</p><ul aria-label="Project technologies">{project.tech.slice(0,3).map(tech => <li key={tech}>{tech}</li>)}</ul></div>
    </a>{project.github && <a className="project-source" href={project.github} target="_blank" rel="noreferrer">Source code <ArrowUpRight size={13} aria-hidden="true"/></a>}
   </article>)}
  </div>
 </section>
}
