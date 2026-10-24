import { useState, useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, X } from 'lucide-react'
import crm from '../assets/Projects/cargo-express-freight.png'
import recruitment from '../assets/Projects/mynext9to5.png'
import website from '../assets/Projects/radwi-website.jpg'
import '../styles/services.css'
gsap.registerPlugin(ScrollTrigger)
const services=[
 {title:'WEB DESIGN & DEVELOPMENT',description:'Clear, responsive websites and interfaces built around your business and the people who use them.',items:'React & Next.js · Product interfaces · Design systems',image:website,alt:'RADWI corporate website',example:'RADWI corporate platform'},
 {title:'AI & AUTOMATION',description:'Connect AI to the work that takes your team’s time, from parsing documents to searching knowledge and moving data.',items:'LLM integrations · Document processing · Workflow automation',image:recruitment,alt:'MyNext9to5 recruitment platform',example:'MyNext9to5'},
 {title:'BUSINESS APPLICATIONS',description:'Custom software that brings your customers, operations and data together in one practical workflow.',items:'CRMs & dashboards · APIs & integrations · Relational databases',image:crm,alt:'Cargo Express Freight CRM dashboard',example:'Cargo Express Freight CRM'},
]
export function Services(){
 const [open,setOpen]=useState<number|null>(null)
 const section=useRef<HTMLElement>(null)
 useLayoutEffect(()=>{
  if(!section.current)return
  const media=gsap.matchMedia()
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   const host=section.current!
   gsap.fromTo(host.querySelector('.display-heading'),{opacity:0,y:12},{
    opacity:1,y:0,duration:.65,ease:'expo.out',
    scrollTrigger:{trigger:host,start:'top 85%',toggleActions:'play none none reverse'}
   })
   const rows=Array.from(host.querySelectorAll<HTMLElement>('.service-row'))
   const cleanups=rows.map((row,index)=>{
    // Only the entrance owns the row transform; CSS owns disclosure geometry.
    const reveal=gsap.fromTo(row,{x:window.innerWidth<=640?-24:-48,opacity:0},{
     x:0,opacity:1,duration:.75,delay:index*.12,ease:'power4.out',paused:true
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
  if(open===null||!section.current)return
  const media=gsap.matchMedia()
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   gsap.fromTo(section.current!.querySelectorAll('.is-open .service-preview img'),
    {y:14,opacity:0},{y:0,opacity:1,duration:.4,ease:'power3.out',clearProps:'transform,opacity'})
  })
  return()=>media.revert()
 },[open])
 return <section ref={section} id="services" className="services-section" aria-labelledby="services-title"><div className="section-inner"><header className="display-heading left-heading"><span className="section-watermark" aria-hidden="true">SERVICES</span><h2 id="services-title">/SERVICES</h2></header>
  <div className="services-list">{services.map((item,index)=><article key={item.title} className={`service-row ${open===index?'is-open':''}`}>
   <h3><button id={`service-button-${index}`} className="service-toggle" aria-expanded={open===index} aria-controls={`service-detail-${index}`} onClick={()=>setOpen(open===index?null:index)}>{item.title}{open===index?<X size={27} aria-hidden="true"/>:<ArrowUpRight size={27} aria-hidden="true"/>}</button></h3>
   <div id={`service-detail-${index}`} className="service-expansion" role="region" aria-labelledby={`service-button-${index}`} aria-hidden={open!==index}>
    <div className="service-content">
     <div className="service-details"><p>{item.description}</p><p className="service-deliverables">{item.items}</p><a tabIndex={open===index?0:-1} href={`mailto:awaisabdullahm@gmail.com?subject=${encodeURIComponent(`Project enquiry: ${item.title}`)}`}>Discuss this service <ArrowUpRight size={15} aria-hidden="true"/></a></div>
     <figure className="service-preview service-preview-mobile"><img src={item.image} alt={item.alt} loading="lazy"/><figcaption>{item.example}</figcaption></figure>
    </div>
   </div>
   <figure className="service-preview service-preview-desktop" aria-hidden={open!==index}><img src={item.image} alt={item.alt} loading="lazy"/><figcaption>{item.example}</figcaption></figure>
  </article>)}</div>
 </div></section>
}
