import { motion } from 'motion/react'
import { ChevronDown, Github, Linkedin, Mail, ArrowRight } from 'lucide-react'
import profileImage from '../assets/sideimage.jpg'

export function Hero() {
  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative bg-neutral-void overflow-hidden pt-20 pb-12">
      {/* Sleek Corporate Grid Background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#B5D4F412_1px,transparent_1px),linear-gradient(to_bottom,#B5D4F412_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-void via-transparent to-neutral-void opacity-80"></div>
        <div className="absolute top-0 w-full h-px bg-gradient-to-r from-blue-electric via-accent-cyan to-blue-electric opacity-50"></div>
      </div>

      {/* Geometric Intro Animation & Edge Shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Layer 1: Abyss Block (Settles Top Right) */}
        <motion.div
          className="absolute top-0 right-0 bg-blue-abyss rounded-none"
          initial={{ width: "100vw", height: "100vh" }}
          animate={{ width: "15vw", height: "25vh" }}
          transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
        />
        
        {/* Layer 2: Cyan Accent Line (Settles Bottom Right) */}
        <motion.div
          className="absolute bottom-0 right-0 bg-accent-cyan rounded-none"
          initial={{ width: "100vw", height: "100vh" }}
          animate={{ width: "35vw", height: "1vh" }}
          transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
        />

        {/* Layer 3: Electric Blue Column (Settles Left Edge) */}
        <motion.div
          className="absolute top-0 left-0 bg-blue-electric rounded-none"
          initial={{ width: "100vw", height: "100vh" }}
          animate={{ width: "1vw", height: "45vh" }}
          transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0 }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-16 items-center">
          
          {/* Right Side: Image (order-2) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="order-2 flex justify-center lg:justify-end relative"
          >
            <div className="relative w-72 lg:w-[22rem] aspect-[4/5] z-10 group mx-auto lg:mx-0">
              {/* Main Image Container */}
              <div className="relative w-full h-full overflow-hidden bg-card shadow-2xl rounded-none">
                <motion.img
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  src={profileImage}
                  alt="Muhammad Awais Abdullah"
                  className="w-full h-full object-cover grayscale transition-all duration-700"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80 pointer-events-none"></div>
              </div>
            </div>
          </motion.div>

          {/* Left Side: Information (order-1) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-12 order-1 text-center lg:text-left z-10"
          >
            <div className="space-y-6">
              <motion.h1 
                className="text-5xl lg:text-7xl font-extrabold tracking-tighter text-blue-ice leading-[1.1]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              >
                Awais <br />
                <span className="text-neutral-slate font-light">Abdullah</span>
              </motion.h1>

              <motion.div 
                className="h-px w-24 bg-gradient-to-r from-blue-electric to-accent-cyan mx-auto lg:mx-0"
                initial={{ width: 0 }}
                animate={{ width: 96 }}
                transition={{ delay: 0.6, duration: 0.8, ease: "easeInOut" }}
              />

              <motion.h2 
                className="text-lg lg:text-xl font-medium text-blue-ice tracking-[0.1em] uppercase"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                AI Engineer & Full-Stack Developer
              </motion.h2>
            </div>
            
            <motion.div
              className="space-y-6 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <p className="text-xl text-accent-cyan font-mono leading-relaxed font-semibold text-center lg:text-left tracking-tight">
                REST APIs that don&apos;t break. Real-time systems that scale. Readable code. No shortcuts.
              </p>
              <p className="text-base text-neutral-slate leading-relaxed font-light text-center lg:text-left">
                Currently pursuing a BS in Computer Science at NUST. I specialize in integrating robust full-stack solutions and architecting automated workflows to reduce operational overhead for forward-thinking enterprises.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              <button
                onClick={scrollToAbout}
                className="group relative px-8 py-4 bg-blue-electric text-white font-semibold uppercase tracking-wider text-sm overflow-hidden transition-all hover:bg-blue-ocean w-full sm:w-auto flex items-center justify-center gap-3 rounded-none shadow-sm"
              >
                <span>Explore Work</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={scrollToContact}
                className="px-8 py-4 bg-transparent hover:bg-blue-ocean text-blue-ocean hover:text-white font-semibold uppercase tracking-wider text-sm border border-blue-ocean transition-colors w-full sm:w-auto rounded-none"
              >
                Let&apos;s Talk
              </button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="flex items-center justify-center lg:justify-start gap-4 pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 1 }}
            >
              {[
                { icon: Github, href: "https://github.com/Awadul" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/muhammad-awais-abdullah-0a588b330/" },
                { icon: Mail, href: "mailto:awaisabdullahm79@gmail.com" }
              ].map((social, i) => {
                const Icon = social.icon;
                return (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 text-neutral-slate hover:text-accent-cyan transition-all"
                  >
                    <Icon className="w-6 h-6" />
                  </a>
                );
              })}
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <button
          onClick={scrollToAbout}
          className="p-4 text-slate-500 hover:text-white transition-colors"
        >
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </button>
      </motion.div>
    </section>
  )
}