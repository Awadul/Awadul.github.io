import { useState, useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { Menu, X, ArrowUpRight } from 'lucide-react'
const items = [['Work','projects'],['Services','services'],['Experience','about'],['Contact','contact']]
export function Navigation() {
 const [open,setOpen] = useState(false)
 const menu = useRef<HTMLElement>(null)
 useLayoutEffect(() => {
  if (!open || !menu.current) return
  const media=gsap.matchMedia()
  media.add('(prefers-reduced-motion: no-preference)',()=>{gsap.from(menu.current!.querySelectorAll('a'),{opacity:0,y:8,duration:.35,stagger:.05,ease:'power3.out',clearProps:'transform,opacity'})})
  return ()=>media.revert()
 },[open])
 return <header className="masthead">
  <a className="availability" href="#contact"><span aria-hidden="true"/>Available for new projects</a>
  <nav className="desktop-nav" aria-label="Primary navigation">{items.map(([label,id])=><a key={id} href={`#${id}`}>{label}{id==='projects' && <small>[06]</small>}</a>)}</nav>
  <a className="work-btn navigation-cta" href="#contact">Let’s talk <ArrowUpRight size={15} aria-hidden="true"/></a>
  <button className="work-btn work-btn-ghost mobile-toggle" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="mobile-navigation" onClick={()=>setOpen(!open)}>{open?<X size={20}/>:<Menu size={20}/>}</button>
  {open && <nav ref={menu} id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">{items.map(([label,id])=><a key={id} href={`#${id}`} onClick={()=>setOpen(false)}>{label}<ArrowUpRight size={17} aria-hidden="true"/></a>)}</nav>}
 </header>
}
