import { useState } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'
const items = [['Selected work', 'projects'], ['About', 'about'], ['Services', 'services'], ['Toolkit', 'tech'], ['Contact', 'contact']]
export function Navigation() {
 const [open, setOpen] = useState(false)
 return <header className="masthead">
  <div className="edition-line"><span>Independent developer · Pakistan</span><span>Portfolio / Vol. 01</span><span>Open to collaboration</span></div>
  <div className="masthead-main"><a className="masthead-name" href="#hero">Awais Abdullah<span>Software, thoughtfully built.</span></a>
   <nav aria-label="Primary navigation" className="desktop-nav">{items.map(([label,id])=><a key={id} href={`#${id}`}>{label}</a>)}</nav>
   <a className="work-btn masthead-cta" href="#contact">Let’s talk <ArrowUpRight size={16} aria-hidden="true" /></a>
   <button className="work-btn work-btn-ghost mobile-toggle" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="mobile-navigation" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
  </div>
  {open && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">{items.map(([label,id])=><a key={id} href={`#${id}`} onClick={()=>setOpen(false)}>{label}<ArrowUpRight size={18} aria-hidden="true"/></a>)}</nav>}
 </header>
}
