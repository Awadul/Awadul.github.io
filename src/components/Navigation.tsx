import { motion } from 'motion/react'
import { useState, useEffect } from 'react'
import { Menu, X, ArrowRight, Home, User, Briefcase, Mail } from 'lucide-react'

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [isDockHovered, setIsDockHovered] = useState(false)

  const navItems = [
    { label: 'Home', id: 'hero', icon: Home },
    { label: 'About', id: 'about', icon: User },
    { label: 'Projects', id: 'projects', icon: Briefcase },
    { label: 'Services', id: 'services', icon: Briefcase },
    { label: 'Contact', id: 'contact', icon: Mail }
  ]

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 50)

      // Active section tracking
      const scrollPosition = currentScrollY + window.innerHeight / 2
      const sections = navItems.map(item => document.getElementById(item.id))

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initialize on mount
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Primary Top Header (Hidden on scroll) */}
      <motion.header
        initial={false}
        animate={{
          y: isScrolled ? -100 : 0,
          opacity: isScrolled ? 0 : 1
        }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        className="fixed top-0 left-0 right-0 z-40 w-full bg-blue-midnight text-blue-ice transition-all duration-300 shadow-sm"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 w-full">
            {/* Logo/Brand Section */}
            <div
              className="flex items-center cursor-pointer group"
              onClick={() => scrollToSection('hero')}
            >
              <div className="flex flex-col group-hover:opacity-80 transition-opacity">
                <span className="text-2xl font-extrabold tracking-tighter text-blue-ice transition-colors duration-300 uppercase">
                  Portfolio
                </span>
                <span className="text-xs text-neutral-slate tracking-[0.2em] uppercase">
                  Muhammad Awais
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-1 items-center justify-end gap-10">
              <div className="flex items-center gap-8">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="py-2 text-xs md:text-sm font-semibold tracking-[0.15em] uppercase text-blue-ice hover:text-accent-cyan hover:border-b-2 hover:border-accent-cyan transition-colors duration-300 rounded-none"
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => scrollToSection('contact')}
                className="bg-blue-electric text-white px-8 py-3 rounded-none transition-opacity duration-300 hover:opacity-80 flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
              >
                <span>Let's Talk</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Modern Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                className="relative p-2 rounded-none hover:bg-white/5 transition-colors duration-300 border border-transparent hover:border-white/10"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Menu"
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Floating Right Dock (Visible on scroll) */}
      <div className="hidden md:block">
        <motion.div
          onMouseEnter={() => setIsDockHovered(true)}
          onMouseLeave={() => setIsDockHovered(false)}
          initial={false}
          animate={{
            x: isScrolled ? (isDockHovered ? 0 : 'calc(100% - 16px)') : '100%',
            opacity: isScrolled ? 1 : 0
          }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-blue-abyss/90 backdrop-blur-md border-l-2 border-t-2 border-b-2 border-blue-electric p-4 pr-6 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] rounded-none flex flex-col gap-6"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                aria-label={item.label}
                className="relative group p-3 flex items-center justify-center"
              >
                <item.icon className={`w-6 h-6 transition-all duration-500 ease-[0.76,0,0.24,1] ${isActive ? 'text-accent-cyan scale-110' : 'text-neutral-slate group-hover:text-white group-hover:scale-110'}`} />

                {/* Tooltip */}
                <div className="absolute right-full mr-6 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-electric text-white text-xs uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-none whitespace-nowrap shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                  {item.label}
                  <div className="absolute top-1/2 -translate-y-1/2 right-[-4px] w-2 h-2 bg-blue-electric rotate-45" />
                </div>

                {/* Active Indicator Line */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -right-4 top-0 bottom-0 w-[2px] bg-accent-cyan shadow-[0_0_10px_#06B6D4]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </motion.div>
      </div>

      {/* Enhanced Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          x: isMobileMenuOpen ? '0%' : '100%'
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="fixed top-0 right-0 bottom-0 w-80 bg-blue-midnight z-50 md:hidden shadow-2xl border-l border-blue-electric/20 text-blue-ice"
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-blue-electric/20 flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-xl font-extrabold uppercase tracking-tighter text-blue-ice">Portfolio</div>
              <div className="text-xs text-neutral-slate uppercase tracking-[0.2em]">Muhammad Awais</div>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-4 px-8">
            {navItems.map((item, index) => {
              const isActive = activeSection === item.id
              return (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-left text-xl font-bold tracking-widest uppercase transition-colors duration-300 py-2 flex items-center gap-4 group ${isActive ? 'text-accent-cyan' : 'text-blue-ice hover:text-white'}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{
                    opacity: isMobileMenuOpen ? 1 : 0,
                    x: isMobileMenuOpen ? 0 : 50
                  }}
                  transition={{ delay: index * 0.1 + 0.1, duration: 0.3 }}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </motion.button>
              )
            })}

            <motion.button
              onClick={() => scrollToSection('contact')}
              className="mt-8 bg-blue-electric text-white px-6 py-4 uppercase tracking-wider text-sm font-bold flex items-center justify-center space-x-2 transition-all duration-300 hover:bg-white hover:text-blue-abyss"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isMobileMenuOpen ? 1 : 0,
                y: isMobileMenuOpen ? 0 : 20
              }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <span>Let's Talk</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Backdrop */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-blue-abyss/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
