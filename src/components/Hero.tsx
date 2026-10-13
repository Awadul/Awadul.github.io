import { ArrowUpRight } from 'lucide-react'
import projectImage from '../assets/Projects/mynext9to5.png'
export function Hero() {
 return <section className="editorial-hero news-container" aria-labelledby="hero-title">
  <div className="hero-introduction"><h1 id="hero-title">Practical software.<br/><em>Real work.</em></h1>
   <p className="hero-deck drop-cap">I’m Awais, an AI engineer and full-stack developer. I build websites, business software, and automations that simplify everyday work.</p>
   <div className="hero-actions"><a href="#projects" className="work-btn">Explore the work <ArrowUpRight size={17} aria-hidden="true"/></a><a href="#about" className="editorial-link">Meet the developer</a></div>
   <p className="hero-byline">From freight operations to recruitment automation.</p>
  </div>
  <a className="hero-feature" href="https://mynext9to5.com" target="_blank" rel="noreferrer" aria-label="Explore MyNext9to5, featured recruitment platform (opens in a new tab)">
   <figure><img src={projectImage} alt="MyNext9to5 career platform homepage" fetchPriority="high" width={1918} height={898}/><figcaption>Fig. 1 — MyNext9to5 / Recruitment & AI</figcaption></figure>
   <div className="hero-feature-title"><h2>From resumes to structured candidate data.</h2><ArrowUpRight size={28} aria-hidden="true"/></div>
   <p>AI-assisted parsing and applicant scoring, built around the recruitment workflow.</p><span className="editorial-link">View the live platform</span>
  </a>
 </section>
}
export function WorkTicker() {
 const text='Business applications / AI integrations / Websites & interfaces / APIs & automation / '
 return <div className="work-ticker" aria-label="Business applications, AI integrations, websites and interfaces, APIs and automation"><div className="ticker-track" aria-hidden="true"><span>{text}</span><span>{text}</span></div></div>
}
