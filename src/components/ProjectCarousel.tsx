import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import cargoExpressImage from '../assets/Projects/cargo-express-freight.png'
import radwiImage from '../assets/Projects/radwi-website.jpg'
import { ChevronLeft, ChevronRight, ExternalLink, Github } from 'lucide-react'

// Data extracted exactly from PersonalInfo.json
const projects = [
  {
    id: 'ai-cv',
    title: 'AI CV Platform',
    shortDescription: 'Automated resume parsing and applicant scoring pipeline for client recruitment at scale.',
    longDescription: 'Fully automated production system that extracts candidate data from PDFs and ranks applicants against job criteria.',
    tech: ['React.js', 'OpenAI API', 'PostgreSQL', 'Supabase'],
    link: 'https://cv.commit-offshore.com',
    github: null,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaSUyMGRhdGF8ZW58MXx8fHwxNzU4MDc4OTczfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'cargo-crm',
    title: 'Cargo Express Freight CRM',
    shortDescription: 'Custom CRM for a freight and logistics company managing shipments and client operations.',
    longDescription: 'A complete logistics management system built for production. Handles complex shipment workflows, customer accounting, and operational synchronization.',
    tech: ['React', 'Node.js', 'Express', 'PostgreSQL'],
    link: 'https://cargoexpressfreight.com/',
    linkText: 'Client Website',
    github: null,
    image: cargoExpressImage
  },
  {
    id: 'nust-bot',
    title: 'NUST Student Guide Bot',
    shortDescription: "RAG-based chatbot over NUST's entire policy document corpus with a custom hybrid retrieval pipeline.",
    longDescription: 'Built a custom retrieval pipeline using TF-IDF for keyword precision, MinHash LSH and SimHash for fuzzy semantic matching — no off-the-shelf vector DB. Academic Big Data semester project.',
    tech: ['Python', 'TF-IDF', 'MinHash LSH', 'SimHash'],
    link: null,
    github: 'https://github.com/Awadul/NUST-Policy-Document-RAG-System.',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGNoYXRib3R8ZW58MXx8fHwxNzU4MTA2MzY0fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'radwi-platform',
    title: 'RADWI Corporate Platform',
    shortDescription: 'Production-grade corporate platform for an IoT hardware and engineering company.',
    longDescription: 'End-to-end architecture and redesign of an enterprise Next.js platform. Developed custom design systems, scroll-triggered animations, and optimized product rendering pipelines.',
    tech: ['React.js', 'Tailwind CSS', 'Framer Motion'],
    link: 'https://rad-wi.com',
    github: null,
    image: radwiImage
  }
]

export function ProjectCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length)
  }

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)
  }

  const currentProject = projects[currentIndex]

  return (
    <section id="projects" className="h-screen w-full relative bg-neutral-void overflow-hidden text-blue-ice flex items-center">
      
      {/* Geometric Architectural Shapes (Blue System walls) */}
      <div className="absolute top-0 right-0 w-32 h-64 bg-blue-abyss hidden lg:block z-0" />
      <div className="absolute bottom-10 right-0 w-64 h-2 bg-accent-cyan z-0" />
      <div className="absolute top-0 left-0 w-8 h-full bg-blue-electric hidden md:block z-0" />

      {/* Massive Background Watermark */}
      <div className="absolute left-16 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-[150px] font-black text-white/5 tracking-tighter uppercase whitespace-nowrap pointer-events-none z-0">
        Work
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-12 right-12 md:right-24 z-50 flex gap-4">
        <button 
          onClick={prevProject} 
          className="p-5 bg-blue-midnight border border-blue-abyss text-white hover:bg-blue-electric hover:border-blue-electric transition-all rounded-none group"
          aria-label="Previous Project"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={nextProject} 
          className="p-5 bg-blue-midnight border border-blue-abyss text-white hover:bg-blue-electric hover:border-blue-electric transition-all rounded-none group"
          aria-label="Next Project"
        >
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100, filter: 'blur(10px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: -100, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-0 flex items-center justify-center z-10 w-full"
        >
          <div className="container mx-auto px-12 md:px-24">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center w-full">
              
              {/* Project Content */}
              <div className="space-y-6 max-w-2xl">
                <div className="space-y-3">
                  <div className="text-accent-cyan text-xs md:text-sm uppercase tracking-[0.2em] font-bold">
                    Featured Project — 0{currentIndex + 1}
                  </div>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tighter leading-tight uppercase">
                    {currentProject.title}
                  </h3>
                  <div className="w-20 h-[4px] bg-gradient-to-r from-blue-electric to-accent-cyan" />
                </div>
                
                <div className="space-y-3">
                  <p className="text-lg md:text-xl text-blue-ice font-semibold">
                    {currentProject.shortDescription}
                  </p>
                  <p className="text-base text-neutral-slate leading-relaxed">
                    {currentProject.longDescription}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  {currentProject.tech.map(tech => (
                    <span 
                      key={tech} 
                      className="bg-blue-midnight text-accent-cyan border border-blue-abyss px-4 py-2 text-xs uppercase font-bold tracking-widest rounded-none"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 pt-6">
                  {currentProject.link && (
                    <a 
                      href={currentProject.link} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="bg-blue-electric text-white px-8 py-4 rounded-none uppercase text-xs font-bold tracking-widest hover:bg-white hover:text-blue-electric transition-colors flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" /> {(currentProject as any).linkText || 'View Live'}
                    </a>
                  )}
                  {currentProject.github && (
                    <a 
                      href={currentProject.github} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="bg-transparent border border-neutral-slate text-neutral-slate px-8 py-4 rounded-none uppercase text-xs font-bold tracking-widest hover:border-white hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Github className="w-4 h-4" /> Source Code
                    </a>
                  )}
                </div>
              </div>

              {/* Project Image */}
              <div className="relative group w-full perspective-1000 hidden lg:block">
                <motion.div
                  initial={{ rotateY: 15, scale: 0.95 }}
                  animate={{ rotateY: 0, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="relative w-full aspect-[4/3] bg-blue-midnight border-2 border-blue-abyss shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden rounded-none"
                >
                  <div className="absolute inset-0 bg-blue-electric/20 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700 z-10" />
                  <img 
                    src={currentProject.image} 
                    alt={currentProject.title} 
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" 
                  />
                </motion.div>
                
                {/* Decorative sharp geometric offset border */}
                <div className="absolute -bottom-8 -left-8 w-full h-full border-2 border-blue-abyss -z-10 transition-transform group-hover:translate-x-3 group-hover:translate-y-3 duration-700 rounded-none" />
              </div>

            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}