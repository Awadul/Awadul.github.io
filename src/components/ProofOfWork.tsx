import { ArrowUpRight } from 'lucide-react'
import '../styles/proof-of-work.css'
const evidence = [
 {title:'Published in the Chrome Web Store.', description:'Vanisher offers scheduled and on-demand browser cleanup using Chrome APIs.', href:'https://chromewebstore.google.com/detail/vanisher-auto-delete-brow/bebdehdpolcbjpbbcgmcfalppgbfhind', label:'Explore the extension'},
 {title:'Built around business operations.', description:'Cargo Express Freight CRM brings shipment management and client operations together.', href:'https://cargoexpressfreight.com/', label:'Visit the client website'},
 {title:'Source you can inspect.', description:'The NUST Student Guide Bot explores retrieval and search over university policy documents.', href:'https://github.com/Awadul/NUST-Policy-Document-RAG-System', label:'Read the source'},
]
export function ProofOfWork() { return <section className="proof-section" aria-labelledby="proof-heading"><div className="proof-container"><header className="section-heading"><h2 id="proof-heading">The work, on record.</h2><p>Live products. Public code. A closer look.</p></header><div className="proof-grid">{evidence.map(item=><article className="proof-card" key={item.title}><h3>{item.title}</h3><p>{item.description}</p><a className="editorial-link" href={item.href} target="_blank" rel="noreferrer">{item.label}<ArrowUpRight size={16} aria-hidden="true"/></a></article>)}</div></div></section> }
