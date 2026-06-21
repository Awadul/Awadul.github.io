import { motion, Variants } from 'motion/react'
import { useRef } from 'react'

export function About() {
  const ref = useRef(null)

  const wipeVariants: Variants = {
    hidden: { scaleX: 0, scaleY: 0, x: "0%" },
    visible: { 
      scaleX: [0, 1, 1], 
      scaleY: [0, 1, 1],
      x: ["0%", "0%", "100%"],
      transition: { duration: 1.6, ease: [0.76, 0, 0.24, 1], times: [0, 0.5, 1] }
    }
  }

  const contentVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.8 // Start fading in content exactly as the wipe reveals it
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }

  return (
    <motion.section 
      id="about" 
      className="py-32 bg-neutral-offwhite relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* The Blue Paper Flip Wipe Animation */}
      <motion.div
        className="absolute inset-y-0 left-0 w-full bg-blue-electric z-20 origin-bottom-left"
        variants={wipeVariants}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={ref}
          variants={contentVariants}
          className="max-w-5xl mx-auto"
        >
          {/* Section Heading with Blue System styling */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="text-blue-electric text-xs uppercase tracking-[0.1em] mb-2 font-bold">
              Discover
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-blue-abyss tracking-tighter mb-4">
              About Me
            </h2>
            <div className="h-[3px] w-10 bg-gradient-to-r from-blue-electric to-accent-cyan" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left Content */}
            <motion.div variants={itemVariants} className="space-y-6">
              <p className="text-lg text-neutral-ink leading-relaxed font-medium">
                I'm a passionate developer with a keen eye for design and a love for creating 
                seamless digital experiences. With expertise in modern web technologies, 
                I bridge the gap between design and functionality.
              </p>
              
              <p className="text-base text-neutral-slate leading-relaxed">
                My approach combines clean, efficient code with thoughtful user experience design. 
                I believe in the power of simplicity and the importance of attention to detail 
                in crafting products that users love.
              </p>

              <motion.div className="flex flex-wrap gap-2 pt-6" variants={itemVariants}>
                {['Backend Development', 'Frontend Development', 'Database Design', 'API Development'].map((skill, index) => (
                  <span 
                    key={index}
                    className="bg-accent-frost text-blue-ocean border border-blue-sky rounded-none px-4 py-2 text-xs uppercase font-bold tracking-wider"
                  >
                    {skill}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content / Card */}
            <motion.div variants={itemVariants} className="relative mt-8 md:mt-0">
              <motion.div
                className="bg-white border border-neutral-mist border-t-4 border-t-blue-electric rounded-none p-10 transition-all hover:border-blue-electric hover:shadow-[0_4px_20px_rgba(55,138,221,0.12)]"
              >
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-neutral-mist pb-4">
                    <span className="text-sm font-bold uppercase tracking-wider text-neutral-slate">Experience</span>
                    <span className="text-3xl font-extrabold text-blue-abyss">1+ Years</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-neutral-mist pb-4">
                    <span className="text-sm font-bold uppercase tracking-wider text-neutral-slate">Projects</span>
                    <span className="text-3xl font-extrabold text-blue-abyss">4+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold uppercase tracking-wider text-neutral-slate">Happy Clients</span>
                    <span className="text-3xl font-extrabold text-blue-abyss">3+</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}