import { motion, useReducedMotion } from 'motion/react'
import { Github, Linkedin, Mail, ArrowRight } from 'lucide-react'
import profileImage from '../assets/sideimage.jpg'

export function Hero() {
  const reducedMotion = useReducedMotion()
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' })
  }

  return (
    <section className="flex items-center justify-center relative bg-neutral-void overflow-hidden pt-28 pb-10 lg:pt-28 lg:pb-12 lg:min-h-[min(760px,88svh)]">
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#B5D4F412_1px,transparent_1px),linear-gradient(to_bottom,#B5D4F412_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-void via-transparent to-neutral-void opacity-80" />
        <motion.div
          className="absolute top-0 right-0 bg-blue-abyss"
          initial={reducedMotion ? false : { width: '100vw', height: '100vh' }}
          animate={{ width: '15vw', height: '25vh' }}
          transition={{ duration: reducedMotion ? 0 : 1.2, delay: reducedMotion ? 0 : 0.3, ease: [0.76, 0, 0.24, 1] }}
        />
        <motion.div
          className="absolute bottom-0 right-0 bg-accent-cyan"
          initial={reducedMotion ? false : { width: '100vw', height: '100vh' }}
          animate={{ width: '35vw', height: '1vh' }}
          transition={{ duration: reducedMotion ? 0 : 1.2, delay: reducedMotion ? 0 : 0.15, ease: [0.76, 0, 0.24, 1] }}
        />
        <motion.div
          className="absolute top-0 left-0 bg-blue-electric"
          initial={reducedMotion ? false : { width: '100vw', height: '100vh' }}
          animate={{ width: '1vw', height: '45vh' }}
          transition={{ duration: reducedMotion ? 0 : 1.2, ease: [0.76, 0, 0.24, 1] }}
        />
      </div>

      <motion.div
        className="container mx-auto px-6 lg:px-12 relative z-10"
        initial={reducedMotion ? false : { y: 12 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="order-2 flex justify-center lg:justify-end">
            <div className="w-48 sm:w-56 lg:w-72 xl:w-80 aspect-[4/5] relative overflow-hidden bg-card">
              <img src={profileImage} alt="Muhammad Awais Abdullah" width={352} height={440} className="w-full h-full object-cover grayscale" fetchPriority="high" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80 pointer-events-none" />
            </div>
          </div>

          <div className="order-1 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter text-blue-ice leading-[1.1]">
                Awais <br /><span className="text-neutral-slate font-light">Abdullah</span>
              </h1>
              <div className="h-px w-24 bg-gradient-to-r from-blue-electric to-accent-cyan mx-auto lg:mx-0" />
              <h2 className="text-lg lg:text-xl font-medium text-blue-ice tracking-[0.1em] uppercase">AI Engineer &amp; Full-Stack Developer</h2>
            </div>
            <div className="space-y-3 max-w-xl mx-auto lg:mx-0 mt-6">
              <p className="text-xl text-accent-cyan font-mono leading-relaxed font-semibold tracking-tight">Business software. Practical AI. Less repetitive work.</p>
              <p className="text-base text-neutral-slate leading-relaxed">I build websites, business software, and automations that simplify everyday work.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-6">
              <button onClick={() => scrollTo('projects')} className="group px-8 py-4 bg-blue-electric text-white font-semibold uppercase tracking-wider text-sm hover:bg-blue-ocean w-full sm:w-auto flex items-center justify-center gap-3 rounded-none">
                See My Projects <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button onClick={() => scrollTo('contact')} className="px-8 py-4 bg-transparent hover:bg-blue-ocean text-blue-ocean hover:text-white font-semibold uppercase tracking-wider text-sm border border-blue-ocean w-full sm:w-auto rounded-none">Let&apos;s Talk</button>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-2 mt-5">
              {[
                { icon: Github, name: 'GitHub', href: 'https://github.com/Awadul' },
                { icon: Linkedin, name: 'LinkedIn', href: 'https://www.linkedin.com/in/muhammad-awais-abdullah-0a588b330/' },
                { icon: Mail, name: 'Email Awais', href: 'mailto:awaisabdullahm@gmail.com' },
              ].map(({ icon: Icon, name, href }) => (
                <a key={name} href={href} aria-label={name} target="_blank" rel="noopener noreferrer" className="p-3 text-neutral-slate hover:text-accent-cyan"><Icon className="w-5 h-5" aria-hidden="true" /></a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
