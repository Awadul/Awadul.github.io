import { useState, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '../data/projects'
import '../styles/projects.css'
gsap.registerPlugin(Flip,ScrollTrigger)
const filters=['All','Client work','Personal projects'] as const
type Filter=typeof filters[number]
const personal=new Set(['pixal-craft','vanisher'])
export function ProjectCarousel() {
 const [filter,setFilter]=useState<Filter>('All')
 const grid=useRef<HTMLDivElement>(null)
 const layout=useRef<Flip.FlipState|null>(null)
 const visible=projects.filter(project=>filter==='All'||(filter==='Personal projects'?personal.has(project.id):!personal.has(project.id)))
 useLayoutEffect(()=>{
  const section=grid.current?.closest('section')
  if(!section)return
  const media=gsap.matchMedia()
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   const timeline=gsap.timeline({scrollTrigger:{trigger:section,start:'top 85%',toggleActions:'play none none reverse'}})
   timeline.fromTo(section.querySelector('.display-heading'),{opacity:0,y:12},{opacity:1,y:0,duration:.7,ease:'power4.out'})
    .fromTo(section.querySelector('.project-toolbar'),{opacity:0},{opacity:1,duration:.5},.18)
  })
  return()=>media.revert()
 },[])
 useLayoutEffect(()=>{
  if(!grid.current)return
  const media=gsap.matchMedia()
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   const cards=Array.from(grid.current!.querySelectorAll<HTMLElement>('.project-entry'))
   const cleanups=cards.map((card,index)=>{
    // FLIP owns the article; the reveal owns its contents, so filters can interrupt safely.
    const reveal=gsap.fromTo(Array.from(card.children),{opacity:0,y:-28},{
     opacity:1,y:0,duration:.85,delay:(index%2)*.1,ease:'power3.out',paused:true
    })
    const trigger=ScrollTrigger.create({trigger:card,start:'top 94%',end:'bottom top',animation:reveal,toggleActions:'play reverse play reverse'})
    const showFocused=()=>reveal.progress(1).pause()
    card.addEventListener('focusin',showFocused)
    return()=>{card.removeEventListener('focusin',showFocused);trigger.kill();reveal.revert()}
   })
   return()=>cleanups.forEach(cleanup=>cleanup())
  })
  return()=>media.revert()
 },[filter])
 const changeFilter=(next:Filter)=>{
  if(next===filter)return
  layout.current=grid.current&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches
   ? Flip.getState(grid.current.querySelectorAll('.project-entry')) : null
  setFilter(next)
 }
 useLayoutEffect(()=>{
  const state=layout.current
  layout.current=null
  if(!state||!grid.current)return
  const media=gsap.matchMedia()
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   Flip.from(state,{
    targets:grid.current!.querySelectorAll('.project-entry'),
    duration:.4,ease:'expo.out',scale:true,prune:true,
    onEnter:elements=>gsap.fromTo(elements,{opacity:0},{opacity:1,duration:.22,clearProps:'opacity'})
   })
  })
  return()=>media.revert()
 },[filter])
 return <section id="projects" className="project-showcase panel" aria-labelledby="selected-work-heading">
  <header className="display-heading"><span className="section-watermark" aria-hidden="true">PORTFOLIO</span><h2 id="selected-work-heading">/SELECTED WORK</h2></header>
  <div className="project-toolbar"><div className="project-filters" role="group" aria-label="Filter projects">{filters.map(item=><button key={item} aria-pressed={filter===item} onClick={()=>changeFilter(item)}>{item}</button>)}</div><a className="work-btn work-btn-ghost" href="https://github.com/Awadul" target="_blank" rel="noreferrer">View all code <ArrowUpRight size={15} aria-hidden="true"/></a></div>
  <p className="sr-only" aria-live="polite">{visible.length} projects shown</p>
  <div ref={grid} className="project-gallery">{visible.map(project=><article className="project-entry" key={project.id} data-flip-id={project.id}>
   <a className="project-card-link" href={project.link} target="_blank" rel="noreferrer" aria-label={`Explore ${project.title} (opens in a new tab)`}>
    <div className={`project-preview ${['vanisher','travectio'].includes(project.id)?'project-preview-artwork':''}`}><img src={project.image} alt="" loading="lazy"/><span className="project-kind">{personal.has(project.id)?'Independent project':'Client project'}</span><span className="project-open" aria-hidden="true"><ArrowUpRight size={25}/></span></div>
    <div className="project-caption"><h3>{project.title}</h3><p>{project.shortDescription}</p><ul aria-label="Project technologies">{project.tech.slice(0,3).map(tech=><li key={tech}>{tech}</li>)}</ul></div>
   </a>
   {project.github && <a className="project-source" href={project.github} target="_blank" rel="noreferrer">Source code <ArrowUpRight size={13} aria-hidden="true"/></a>}
  </article>)}</div>
 </section>
}
