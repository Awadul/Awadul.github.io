import { Database, Workflow, PanelsTopLeft, ArrowUpRight } from 'lucide-react'
import '../styles/services.css'

const services = [
  {
    id: 'platform', icon: Database, title: 'Business applications',
    category: 'Custom business applications',
    description: 'Custom software that brings your team’s workflows and data together.',
    deliverables: ['CRMs & dashboards', 'APIs & integrations', 'Databases & full-stack builds'],
    example: 'Cargo Express Freight CRM',
  },
  {
    id: 'automation', icon: Workflow, title: 'AI & automation',
    category: 'AI integrations & automation',
    description: 'Automate document processing, data collection, and knowledge search.',
    deliverables: ['PDF parsing & data extraction', 'LLM integrations & retrieval', 'Scraping & workflow automation'],
    example: 'MyNext9to5 & NUST Guide Bot',
  },
  {
    id: 'website', icon: PanelsTopLeft, title: 'Websites & interfaces',
    category: 'Websites & frontend development',
    description: 'Responsive websites and product interfaces that make your offering clear.',
    deliverables: ['React & Next.js development', 'Components & design systems', 'Website redesigns'],
    example: 'RADWI & Pixal Craft',
  },
]

export function Services() {
  return (
    <section id="services" className="services-section" aria-labelledby="services-title">
      <div className="services-container">
        <header className="services-header">
          <h2 id="services-title">How I can help</h2>
          <p>I build the software, connect the systems, and automate the work that slows your team down.</p>
        </header>
        <div className="services-list">
          {services.map(service => (
            <a key={service.id} href={`mailto:awaisabdullahm@gmail.com?subject=${encodeURIComponent(`Project enquiry: ${service.category}`)}`} className={`service-row service-${service.id}`}>
              <div className="service-heading">
                <service.icon className="service-icon" size={24} aria-hidden="true" />
                <h3>{service.title}</h3>
              </div>
              <div className="service-content">
                <p className="service-description">{service.description}</p>
                <ul aria-label="What I provide">{service.deliverables.map(item => <li key={item}>{item}</li>)}</ul>
                <p className="service-evidence"><span>Related work</span>{service.example}</p>
              </div>
              <span className="service-action">Discuss this service <ArrowUpRight size={16} aria-hidden="true" /></span>
            </a>
          ))}
        </div>
        <div className="services-process">
          <h3>A clear process, from scope to handover.</h3>
          <ol>
            <li><strong>Define the scope</strong><p>Clarify the users, workflows, and priorities before development.</p></li>
            <li><strong>Build & review</strong><p>Review the working interface and refine the details together.</p></li>
            <li><strong>Launch & hand over</strong><p>Prepare deployment, documentation, and the next steps for maintaining the software.</p></li>
          </ol>
          <a className="work-btn" href="#contact">Tell me what you need <ArrowUpRight size={18} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  )
}
