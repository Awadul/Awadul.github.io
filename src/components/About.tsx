import profileImage from '../assets/awais-editorial-portrait.png'
import { ArrowUpRight } from 'lucide-react'
export function About() {
 return <section id="about" className="about-section news-container" aria-labelledby="about-heading">
  <header className="section-heading"><h2 id="about-heading">The person behind the work.</h2><span className="edition-meta">Islamabad / Rawalpindi · UTC+5</span></header>
  <div className="about-columns"><figure className="about-portrait"><img src={profileImage} alt="Muhammad Awais Abdullah" width={1122} height={1402} loading="lazy"/><figcaption>Fig. 2 — Muhammad Awais Abdullah</figcaption></figure>
   <div className="about-copy"><p className="drop-cap">I’m Muhammad Awais Abdullah, an AI engineer and full-stack developer based in Islamabad / Rawalpindi, Pakistan, and studying Computer Science at NUST. My work spans freight operations, recruitment automation, corporate websites, and document retrieval.</p><p>I focus on understanding the workflow first, then connecting the interface, APIs, and data behind it. I work with React, Next.js, Node.js, Python, and PostgreSQL to turn business requirements into usable software.</p><a className="editorial-link" href="https://github.com/Awadul" target="_blank" rel="noreferrer">Explore my code <ArrowUpRight size={16} aria-hidden="true"/></a></div>
   <dl className="about-facts"><div><dt>Freelance since</dt><dd>2025</dd></div><div><dt>Education</dt><dd>NUST</dd></div><div><dt>Based in</dt><dd>Pakistan</dd></div><div><dt>Focus</dt><dd>Useful software.<br/>Clear workflows.</dd></div></dl>
  </div>
 </section>
}
