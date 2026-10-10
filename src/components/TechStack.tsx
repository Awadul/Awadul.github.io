import '../styles/tech-stack.css'

const logoFiles = import.meta.glob('../assets/technologies/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
const groups = [
  {
    name: 'Frontend', description: 'Responsive websites, interfaces, and dashboards.',
    technologies: [{ name: 'React', logo: 'react' }, { name: 'Next.js', logo: 'nextdotjs' }, { name: 'TypeScript', logo: 'typescript' }, { name: 'JavaScript', logo: 'javascript' }, { name: 'Tailwind CSS', logo: 'tailwindcss' }],
  },
  {
    name: 'Backend & CRM integrations', description: 'Application logic, connected databases, and Odoo CRM integrations.',
    technologies: [{ name: 'Node.js', logo: 'nodedotjs' }, { name: 'Express.js', logo: 'express' }, { name: 'PostgreSQL', logo: 'postgresql' }, { name: 'MySQL', logo: 'mysql' }, { name: 'MongoDB', logo: 'mongodb' }, { name: 'Supabase', logo: 'supabase' }, { name: 'Odoo CRM', logo: 'odoo' }],
  },
  {
    name: 'AI & automation', description: 'AI tools, automated workflows, document processing, and knowledge search.',
    technologies: [{ name: 'Python', logo: 'python' }, { name: 'OpenAI', logo: 'openai' }, { name: 'LangChain', logo: 'langchain' }, { name: 'LangGraph', logo: 'langgraph' }, { name: 'Vector databases', logo: 'qdrant' }],
    methods: 'LangChain connects AI tools and data. LangGraph coordinates multi-step AI workflows. Vector databases support search by meaning.',
  },
  {
    name: 'Tools', description: 'Interface design, API testing, version control, and application environments.',
    technologies: [{ name: 'Figma', logo: 'figma' }, { name: 'Postman', logo: 'postman' }, { name: 'Git', logo: 'git' }, { name: 'Docker', logo: 'docker' }],
  },
]

export function TechStack() {
  return (
    <section className="tech-section" aria-labelledby="tech-heading">
      <div className="tech-container">
        <div className="tech-header">
          <h2 id="tech-heading">My tech stack.</h2>
          <p>The tools I use to build interfaces, connect systems, and automate work.</p>
        </div>
        <div className="tech-category-list">
          {groups.map((group) => (
            <div className="tech-category" key={group.name}>
              <div className="tech-category-heading"><h3>{group.name}</h3><p>{group.description}</p></div>
              <div className="tech-category-content">
                <ul className="tech-category-tools" aria-label={`${group.name} technologies`}>
                  {group.technologies.map((technology) => (
                    <li key={technology.name}>
                      <img className={`tech-brand-mark${technology.logo === 'express' ? ' tech-brand-on-light' : ''}`} src={logoFiles[`../assets/technologies/${technology.logo}.png`]} alt="" width={32} height={32} loading="lazy" />
                      <span>{technology.name}</span>
                    </li>
                  ))}
                </ul>
                {group.methods && <p className="tech-methods">{group.methods}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
