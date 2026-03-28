import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_LINKS, CV_URL } from '../utils/constants'

export default function Navbar({ scrolled }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active, setActive] = useState('')

  // Observe which section is in view
  useEffect(() => {
    const ids = NAV_LINKS.map(l => l.href.replace('#', ''))
    const observers = ids.map(id => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { threshold: 0.3 },
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [])

  const handleNav = (href) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-dark/80 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="section-max px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

        {/* Logo */}
        <a
          href="#"
          onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          className="flex items-center gap-2 group"
          aria-label="Home"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow-sm">
            <span className="font-display font-bold text-white text-sm">A</span>
          </div>
          <span className="font-display font-semibold text-white hidden sm:block">
            Ayush<span className="gradient-text">.</span>
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(link => {
            const id = link.href.replace('#', '')
            const isActive = active === id
            return (
              <li key={link.href}>
                <button
                  onClick={() => handleNav(link.href)}
                  className={`relative px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                    isActive
                      ? 'text-white'
                      : 'text-muted hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-primary/15 border border-primary/30 rounded-md"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </button>
              </li>
            )
          })}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href={CV_URL}
            download
            className="btn-secondary text-sm py-2 px-4"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            CV
          </a>
          <button
            onClick={() => handleNav('#contact')}
            className="btn-primary text-sm py-2 px-4"
          >
            Hire Me
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="lg:hidden p-2 text-muted hover:text-white transition-colors"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[9px]' : ''}`} />
          </div>
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden bg-dark/95 backdrop-blur-xl border-b border-white/5"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(link => (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className="text-left px-3 py-2.5 text-sm font-medium text-muted hover:text-white hover:bg-primary/10 rounded-md transition-all"
                >
                  {link.label}
                </button>
              ))}
              <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                <a href={CV_URL} download className="btn-secondary text-sm py-2 flex-1 justify-center">
                  Download CV
                </a>
                <button onClick={() => handleNav('#contact')} className="btn-primary text-sm py-2 flex-1 justify-center">
                  Hire Me
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
