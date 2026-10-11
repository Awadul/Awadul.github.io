import cv from '../assets/Projects/mynext9to5.png'
import cargo from '../assets/Projects/cargo-express-freight.png'
import radwi from '../assets/Projects/radwi-website.jpg'
import pixal from '../assets/Projects/Pixal-craft.jpg'
import travectio from '../assets/Projects/travectio-showcase.png'
import vanisher from '../assets/Projects/vanisher-showcase.png'

const projects = [
  { name: 'MyNext9to5', url: 'https://mynext9to5.com', image: cv, description: 'AI resume processing' },
  { name: 'Cargo Express Freight CRM', url: 'https://cargoexpressfreight.com', image: cargo, description: 'Visit client website' },
  { name: 'RADWI', url: 'https://rad-wi.com', image: radwi, description: 'Corporate website' },
  { name: 'Pixal Craft', url: 'https://pixal-craft.vercel.app', image: pixal, description: 'Creative React interface' },
  { name: 'Travectio Solutions', url: 'https://travectiosolutions.com', image: travectio, description: 'Transportation financial workflows' },
  { name: 'Vanisher', url: 'https://chromewebstore.google.com/detail/vanisher-auto-delete-brow/bebdehdpolcbjpbbcgmcfalppgbfhind', image: vanisher, description: 'Published Chrome extension' },
]

export function ChatProjects({ content }: { content: string }) {
  const matches = projects.filter((project) => content.includes(project.url)).slice(0, 2)
  return matches.length ? <div className="chat-projects">{matches.map((project) => <a key={project.url} href={project.url} target="_blank" rel="noreferrer"><img src={project.image} alt="" loading="lazy" /><span><strong>{project.name}</strong><small>{project.description} ↗</small></span></a>)}</div> : null
}

export function ChatText({ content }: { content: string }) {
  return <>{content.split(/(https:\/\/[^\s<>]+)/g).map((part, index) => {
    if (!part.startsWith('https://')) return part
    const url = part.replace(/[.,;)]+$/, '')
    if (url === 'https://wa.me/923437836578') return <a key={index} href={url} target="_blank" rel="noreferrer">WhatsApp Awais</a>
    // Only link recorded project/profile hosts. Other model output stays plain text.
    const allowed = ['mynext9to5.com', 'cargoexpressfreight.com', 'rad-wi.com', 'pixal-craft.vercel.app', 'travectiosolutions.com', 'chromewebstore.google.com', 'github.com', 'awadul.github.io', 'www.linkedin.com']
    try { if (allowed.includes(new URL(url).hostname)) return <a key={index} href={url} target="_blank" rel="noreferrer">{url}</a> } catch { /* Render as text. */ }
    return part
  })}</>
}
