import { motion, Variants } from 'motion/react'
import { Mail, Github, Linkedin, ArrowUpRight } from 'lucide-react'

export function Contact() {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const pullUpVariants: Variants = {
    hidden: { y: '150%', opacity: 0 },
    visible: {
      y: '0%',
      opacity: 1,
      transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] }
    }
  }

  return (
    <motion.footer 
      id="contact" 
      className="relative bg-blue-abyss pt-32 pb-12 overflow-hidden border-t-[8px] border-blue-electric"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-end">
          
          {/* Left Side: Get In Touch */}
          <div className="space-y-8">
            <div className="overflow-hidden">
              <motion.div variants={pullUpVariants}>
                <div className="text-accent-cyan text-xs uppercase tracking-[0.2em] font-bold mb-4">
                  Initiate Connection
                </div>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none">
                  Let's <br /> Connect
                </h2>
              </motion.div>
            </div>
            
            <div className="overflow-hidden">
              <motion.div variants={pullUpVariants}>
                <div className="w-24 h-[4px] bg-gradient-to-r from-blue-electric to-accent-cyan" />
              </motion.div>
            </div>
            
            <div className="overflow-hidden max-w-md">
              <motion.p variants={pullUpVariants} className="text-lg text-neutral-slate font-medium leading-relaxed">
                Whether you have a complex system to build, want to collaborate on artificial intelligence, 
                or just want to talk code, the pipeline is open.
              </motion.p>
            </div>
            
            <div className="overflow-hidden pt-4">
              <motion.div variants={pullUpVariants}>
                <a
                  href="mailto:awaisabdullahm79@gmail.com"
                  className="inline-flex items-center gap-4 bg-blue-electric text-white px-8 py-5 rounded-none font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-blue-abyss transition-colors duration-300 group"
                >
                  <Mail className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                  <span>Send Transmission</span>
                </a>
              </motion.div>
            </div>
          </div>

          {/* Right Side: Social / Networks */}
          <div className="flex flex-col lg:items-end space-y-6">
            <div className="overflow-hidden w-full lg:w-auto">
              <motion.div variants={pullUpVariants}>
                <a 
                  href="https://github.com/Awadul" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="block bg-blue-midnight p-8 w-full lg:w-80 group hover:-translate-x-2 hover:-translate-y-2 transition-transform duration-500 rounded-none relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                >
                  <div className="absolute inset-0 border border-blue-electric/20 pointer-events-none" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Github className="w-8 h-8 text-accent-cyan" />
                      <div>
                        <div className="text-xs text-neutral-slate uppercase tracking-wider font-bold mb-1">Network</div>
                        <div className="text-white font-bold text-xl uppercase tracking-widest">GitHub</div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-6 h-6 text-neutral-slate group-hover:text-white transition-colors" />
                  </div>
                </a>
              </motion.div>
            </div>

            <div className="overflow-hidden w-full lg:w-auto">
              <motion.div variants={pullUpVariants}>
                <a 
                  href="https://www.linkedin.com/in/muhammad-awais-abdullah-0a588b330/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="block bg-blue-midnight p-8 w-full lg:w-80 group hover:-translate-x-2 hover:-translate-y-2 transition-transform duration-500 rounded-none relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                >
                  <div className="absolute inset-0 border border-blue-electric/20 pointer-events-none" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Linkedin className="w-8 h-8 text-blue-electric" />
                      <div>
                        <div className="text-xs text-neutral-slate uppercase tracking-wider font-bold mb-1">Network</div>
                        <div className="text-white font-bold text-xl uppercase tracking-widest">LinkedIn</div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-6 h-6 text-neutral-slate group-hover:text-white transition-colors" />
                  </div>
                </a>
              </motion.div>
            </div>
          </div>
          
        </div>

        {/* Footer Bottom Line */}
        <div className="mt-16 pt-8 border-t border-blue-electric/20 flex flex-col md:flex-row justify-between items-center gap-4 overflow-hidden">
          <motion.div variants={pullUpVariants} className="text-neutral-slate text-sm font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} Muhammad Awais Abdullah
          </motion.div>
          <motion.div variants={pullUpVariants} className="text-neutral-slate text-xs uppercase tracking-widest flex items-center gap-2">
            Status: <span className="w-2 h-2 bg-accent-cyan block animate-pulse shadow-[0_0_10px_#06B6D4]"></span> Open to opportunities
          </motion.div>
        </div>
      </div>
      
      {/* Background Architectural Watermark */}
      <div className="absolute right-0 bottom-0 text-[200px] md:text-[300px] font-black text-white/[0.02] leading-none pointer-events-none select-none z-0 tracking-tighter translate-x-12 translate-y-12">
        EOF
      </div>
    </motion.footer>
  )
}