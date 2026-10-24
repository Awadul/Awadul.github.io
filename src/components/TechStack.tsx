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


export function TechStack(){return <section id="tech" className="tech-section panel" aria-labelledby="tech-heading"><header><h2 id="tech-heading">/THE TOOLKIT</h2><p>The tools behind the work.</p></header><div className="tech-category-list">{groups.map(group=><div className="tech-category" key={group.name}><h3>{group.name}</h3><ul>{group.technologies.map(tool=><li key={tool.name}><img src={logoFiles[`../assets/technologies/${tool.logo}.png`]} alt="" width={24} height={24} loading="lazy"/><span>{tool.name}</span></li>)}</ul></div>)}</div></section>}
