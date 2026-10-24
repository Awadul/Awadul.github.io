import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react'
import portrait from '../assets/portrait-cutout.webp'
export function Hero() {
 return <section className="portrait-hero" aria-labelledby="hero-title">
  <h1 id="hero-title" className="hero-name" aria-label="Awais Abdullah"><span className="hero-first" aria-hidden="true">AWAIS</span><span className="hero-last" aria-hidden="true">ABDULLAH</span></h1>
  <div className="hero-portrait"><img src={portrait} alt="Muhammad Awais Abdullah" width={960} height={1200} fetchPriority="high" decoding="async"/></div>
  <div className="hero-introduction"><h2>AI engineer &<br/>{' '}full-stack developer</h2><p>I build practical software.<br/>{' '}Websites, business tools and AI<br className="desktop-break"/> that make everyday work simpler.</p><a className="work-btn" href="#contact">Let’s collaborate <ArrowUpRight size={16} aria-hidden="true"/></a></div>
  <nav className="hero-socials" aria-label="Social links"><a href="https://github.com/Awadul" target="_blank" rel="noreferrer"><Github size={15} aria-hidden="true"/>GitHub<ArrowUpRight className="social-arrow" size={13} aria-hidden="true"/></a><a href="https://www.linkedin.com/in/muhammad-awais-abdullah-0a588b330/" target="_blank" rel="noreferrer"><Linkedin size={15} aria-hidden="true"/>LinkedIn<ArrowUpRight className="social-arrow" size={13} aria-hidden="true"/></a><a href="mailto:awaisabdullahm@gmail.com"><Mail size={15} aria-hidden="true"/>Email<ArrowUpRight className="social-arrow" size={13} aria-hidden="true"/></a></nav>
  <span className="hero-location">Islamabad, Pakistan / UTC+5</span>
 </section>
}
