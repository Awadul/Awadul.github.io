import { useLayoutEffect, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../styles/scroll-experience.css'
gsap.registerPlugin(ScrollTrigger)
const sections=['hero','projects','services','about','tech','contact']
export function ScrollExperience(){
 const progress=useRef<HTMLDivElement>(null)
 const [active,setActive]=useState('hero')
 useLayoutEffect(()=>{
  let disposed=false
  const media=gsap.matchMedia()
  const context=gsap.context(()=>{
   gsap.fromTo(progress.current,{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:true}})
   sections.forEach((id,index)=>ScrollTrigger.create({trigger:`#${id}`,start:'top 35%',endTrigger:index<sections.length-1?`#${sections[index+1]}`:undefined,end:index<sections.length-1?'top 35%':'bottom top',onToggle:self=>{if(self.isActive)setActive(id)}}))
   media.add('(prefers-reduced-motion: no-preference)',()=>{
    // Overscan keeps the cloud photograph covering the viewport at both extremes.
    // One scroll-linked transform owns the background; the mesh remains a nearer plane.
    gsap.fromTo('.cloud-parallax',
     {y:()=>window.innerHeight*.16},
     {y:()=>-window.innerHeight*.16,ease:'none',force3D:true,
      scrollTrigger:{start:0,end:'max',scrub:true,invalidateOnRefresh:true}}
    )
    // Each layer has one viewport-motion owner.
    const focusCleanups:Array<()=>void>=[]
    sections.forEach(id=>{
     if(id==='projects'||id==='services'||id==='about')return // These sections own their reference choreography.
     const section=document.getElementById(id)
     if(!section)return
     // The surface stays still while its contents dissolve through it.
     // Child layers keep the hero's image reveal and gallery FLIP independent.
     const layers=Array.from(section.children).filter(child=>!child.classList.contains('sr-only'))
     const movers=layers.map(layer=>gsap.quickTo(layer,'y',{duration:.4,ease:'power4.out'}))
     const faders=layers.map(layer=>gsap.quickTo(layer,'opacity',{duration:.3,ease:'power2.out'}))
     const clamp=gsap.utils.clamp(0,1)
     const update=(self:ScrollTrigger)=>{
      const edge=window.innerHeight*.3
      const entering=clamp((self.scroll()-self.start)/edge)
      const leaving=clamp((self.end-self.scroll())/edge)
      // Hold the reading area; dissolve only through the viewport edges.
      // Keyboard focus overrides the dissolve so every focused action is visible.
      const focused=section.contains(document.activeElement)
      const amount=focused?1:Math.min(entering,leaving)
      movers.forEach(move=>move(focused?0:(1-entering)*36-(1-leaving)*20))
      faders.forEach(fade=>fade(amount))
     }
     const trigger=ScrollTrigger.create({trigger:section,start:'top 98%',end:'bottom 2%',onUpdate:update,onRefresh:update})
     const focus=()=>update(trigger)
     section.addEventListener('focusin',focus)
     section.addEventListener('focusout',focus)
     focusCleanups.push(()=>{section.removeEventListener('focusin',focus);section.removeEventListener('focusout',focus)})
    })
    // The image owns its entrance; the outer layer owns scroll movement.
    // Keeping their transforms separate prevents a jump when scrolling mid-reveal.
    if(window.scrollY<120){gsap.timeline({defaults:{ease:'power3.out'}})
     .fromTo('.hero-name > span',
      {clipPath:'inset(0% 0% 100% 0%)'},
      {clipPath:'inset(0% 0% 0% 0%)',duration:.65,stagger:.08,ease:'expo.out',clearProps:'clipPath'},0)
     .fromTo('.hero-portrait img',
      {yPercent:32,y:0,opacity:0},
      {yPercent:0,y:0,opacity:1,duration:1.65,ease:'power3.out',force3D:true,clearProps:'transform,opacity'},.18)
     .from('.hero-introduction > *',{y:8,opacity:0,duration:.4,stagger:.05,clearProps:'transform,opacity'},.45)
     .from('.hero-socials a',{opacity:0,duration:.3,stagger:.04,clearProps:'opacity'},.56)}
    gsap.fromTo('.hero-portrait',{y:0},{
     y:-24,ease:'none',force3D:true,
     scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:.8}
    })
    gsap.fromTo('.hero-name',{y:0},{
     y:-28,ease:'none',
     scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:.8}
    })
    return()=>focusCleanups.forEach(cleanup=>cleanup())
   })
  })
  const refresh=()=>{if(!disposed)ScrollTrigger.refresh(true)}
  const images=Array.from(document.querySelectorAll('main img'))
  images.forEach(image=>image.addEventListener('load',refresh))
  document.fonts.ready.then(refresh);refresh()
  const hosts=document.querySelectorAll('.services-list,.project-gallery')
  // Accordion and filter layout changes can span many frames; refresh once settled.
  let resizeRefresh=0
  const observer=new ResizeObserver(()=>{
   window.clearTimeout(resizeRefresh)
   resizeRefresh=window.setTimeout(refresh,120)
  })
  hosts.forEach(host=>observer.observe(host))
  return()=>{disposed=true;window.clearTimeout(resizeRefresh);observer.disconnect();images.forEach(image=>image.removeEventListener('load',refresh));media.revert();context.revert()}
 },[])
 useEffect(()=>{
  const sync=()=>document.querySelectorAll<HTMLAnchorElement>('.desktop-nav a,.mobile-nav a').forEach(link=>{if(link.hash===`#${active}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')})
  sync();const observer=new MutationObserver(sync);const nav=document.querySelector('.masthead');if(nav)observer.observe(nav,{childList:true,subtree:true});return()=>observer.disconnect()
 },[active])
 return <div className="scroll-progress" aria-hidden="true"><div ref={progress}/></div>
}
