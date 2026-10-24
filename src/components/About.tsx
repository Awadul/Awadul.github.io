import { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import recruitment from '../assets/Projects/mynext9to5.png'
import cargo from '../assets/Projects/cargo-express-freight.png'
import radwi from '../assets/Projects/radwi-website.jpg'
import '../styles/experience.css'
gsap.registerPlugin(ScrollTrigger)
const experience=[
 {title:'Independent developer',role:'AI engineering & full-stack development',meta:'2025 — Present',href:'https://github.com/Awadul',image:recruitment},
 {title:'MyNext9to5',role:'Selected project / Resume parsing & applicant scoring',meta:'Recruitment',href:'https://mynext9to5.com',image:recruitment},
 {title:'Cargo Express Freight',role:'Selected project / CRM & shipment workflows',meta:'Logistics',href:'https://cargoexpressfreight.com/',image:cargo},
 {title:'RADWI',role:'Selected project / Responsive interfaces & design systems',meta:'Engineering',href:'https://rad-wi.com',image:radwi},
 {title:'NUST Student Guide Bot',role:'Independent project / Retrieval over policy documents',meta:'AI & retrieval',href:'https://github.com/Awadul/NUST-Policy-Document-RAG-System',image:null},
]
export function About(){
 const section=useRef<HTMLElement>(null)
 useLayoutEffect(()=>{
  if(!section.current)return
  const media=gsap.matchMedia()
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   const host=section.current!
   // The dark surface holds still while the heading and record build in order.
   gsap.timeline({scrollTrigger:{trigger:host,start:'top 85%',toggleActions:'play none none reverse'}})
    .fromTo(host.querySelector('.display-heading'),{opacity:0,y:16},{opacity:1,y:0,duration:.7,ease:'expo.out'})
    .fromTo(host.querySelector('.experience-intro'),{opacity:0},{opacity:1,duration:.5},.22)
   const rows=Array.from(host.querySelectorAll<HTMLElement>('.experience-row'))
   const cleanups=rows.map((row,index)=>{
    // Row motion is separate from the pointer preview's own transform.
    const reveal=gsap.fromTo(row,{opacity:0,y:18},{
     opacity:1,y:0,duration:.8,delay:index*.09,ease:'power3.out',paused:true
    })
    const trigger=ScrollTrigger.create({trigger:row,start:'top 94%',end:'bottom top',animation:reveal,toggleActions:'play reverse play reverse'})
    const showFocused=()=>reveal.progress(1).pause()
    row.addEventListener('focusin',showFocused)
    return()=>{row.removeEventListener('focusin',showFocused);trigger.kill();reveal.revert()}
   })
   return()=>cleanups.forEach(cleanup=>cleanup())
  })
  return()=>media.revert()
 },[])

 useLayoutEffect(()=>{
  const media=gsap.matchMedia()
  media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',()=>{
   const host=section.current!
   const rows=Array.from(host.querySelectorAll<HTMLElement>('.experience-row'))
   const cleanup=rows.map(row=>{
    const image=row.querySelector<HTMLElement>('.experience-preview');if(!image)return()=>{}
    const x=gsap.quickTo(image,'x',{duration:.4,ease:'power3.out'})
    const y=gsap.quickTo(image,'y',{duration:.4,ease:'power3.out'})
    const move=(event:PointerEvent)=>{const box=row.getBoundingClientRect();x(Math.max(0,Math.min(event.clientX-box.left-75,box.width-200)));y(event.clientY-box.top-60)}
    row.addEventListener('pointermove',move)
    return()=>row.removeEventListener('pointermove',move)
   })
   return()=>cleanup.forEach(fn=>fn())
  })
  return()=>media.revert()
 },[])
 return <section ref={section} id="about" className="experience-section panel" aria-labelledby="experience-heading"><header className="display-heading left-heading"><span className="section-watermark" aria-hidden="true">EXPERIENCE</span><h2 id="experience-heading">/EXPERIENCE</h2><p>Freelance since 2025</p></header>
  <div className="experience-intro"><p>I’m Muhammad Awais Abdullah, an AI engineer and full-stack developer studying Computer Science at NUST. I build software around real workflows, from recruitment and freight operations to websites and document search.</p><a href="#tech">Explore my toolkit <ArrowUpRight size={16} aria-hidden="true"/></a></div>
  <div className="experience-list">{experience.map(item=><a key={item.title} className="experience-row" href={item.href} target="_blank" rel="noreferrer"><div><h3>{item.title}</h3><p>{item.role}</p></div><span>{item.meta}</span>{item.image && <div className="experience-preview" aria-hidden="true"><img src={item.image} alt="" loading="lazy"/></div>}</a>)}</div>
 </section>
}
