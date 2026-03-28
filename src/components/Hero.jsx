import { useRef, useCallback, Suspense } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '../utils/motion'
import { CV_URL, SOCIAL } from '../utils/constants'
import AvatarCanvas from './three/AvatarCanvas'
import NeuralBackground from './three/NeuralBackground'

const ROLES = ['Machine Learning Engineer', 'AI Engineer', 'Applied AI Researcher']

function TypewriterRoles() {
  return (
    <div className="flex flex-wrap gap-x-2 gap-y-1 mt-2">
      {ROLES.map((role, i) => (
        <span key={role} className="flex items-center gap-1.5">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.2, duration: 0.5 }}
            className={`text-sm sm:text-base font-medium ${
              i === 0 ? 'text-primary' : i === 1 ? 'text-secondary' : 'text-purple-300'
            }`}
          >
            {role}
          </motion.span>
          {i < ROLES.length - 1 && (
            <span className="text-white/20 text-xs select-none">·</span>
          )}
        </span>
      ))}
    </div>
  )
}

export default function Hero() {
  const mouseRef = useRef({ x: 0, y: 0 })
  const containerRef = useRef()

  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width  - 0.5) * 2,
      y: ((e.clientY - rect.top)  / rect.height - 0.5) * 2,
    }
  }, [])

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Neural network background canvas */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <Suspense fallback={null}>
          <NeuralBackground mouseX={mouseRef.current.x} mouseY={mouseRef.current.y} />
        </Suspense>
      </div>

      {/* Radial hero gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-hero-gradient" aria-hidden />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent z-0 pointer-events-none" aria-hidden />

      {/* Content */}
      <div className="relative z-10 section-max section-padding w-full">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* ── Left: text ── */}
          <motion.div
            variants={staggerContainer(0.1, 0.3)}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-5 max-w-xl"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs font-mono text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow" />
                Available for Opportunities
              </span>
            </motion.div>

            {/* Name */}
            <motion.div variants={fadeInUp}>
              <h1 className="font-display font-bold leading-[1.1]">
                <span className="text-4xl sm:text-5xl xl:text-6xl text-white block">
                  Ayush Singh
                </span>
                <span className="text-4xl sm:text-5xl xl:text-6xl shimmer-text block mt-1">
                  Raghuwanshi
                </span>
              </h1>
              <TypewriterRoles />
            </motion.div>

            {/* Summary */}
            <motion.p
              variants={fadeInUp}
              className="text-muted leading-relaxed text-sm sm:text-base"
            >
              3+ years building <span className="text-white font-medium">production-grade NLP and LLM systems</span> for enterprise clients. Specialist in RAG pipelines, transformer fine-tuning, and Azure OpenAI — turning complex AI research into measurable business impact.
            </motion.p>

            {/* Key stats */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-3 gap-3 py-2"
            >
              {[
                { value: '3+',   label: 'Years Experience'   },
                { value: '120k+', label: 'Docs Processed'   },
                { value: '3',    label: 'Int\'l Publications' },
              ].map(s => (
                <div key={s.label} className="glass-card rounded-xl p-3 text-center border-glow">
                  <div className="text-xl sm:text-2xl font-display font-bold gradient-text">{s.value}</div>
                  <div className="text-[10px] sm:text-xs text-muted mt-0.5 leading-tight">{s.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-3 pt-1">
              <button
                onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                View Projects
              </button>
              <a href={CV_URL} download className="btn-secondary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                Download CV
              </a>
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Me
              </button>
            </motion.div>

            {/* Social links */}
            <motion.div variants={fadeInUp} className="flex items-center gap-4 pt-1">
              <a
                href={SOCIAL.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href={SOCIAL.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a
                href={`mailto:${SOCIAL.email}`}
                className="text-muted hover:text-secondary transition-colors"
                aria-label="Email"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </motion.div>
          </motion.div>

          {/* ── Right: 3D Avatar ── */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            animate="visible"
            className="relative flex items-center justify-center h-[420px] sm:h-[500px] lg:h-[580px]"
          >
            {/* Glow halo behind avatar */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
              <div className="w-72 h-72 rounded-full bg-glow-purple animate-pulse-slow opacity-70" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
              <div className="w-52 h-52 rounded-full bg-glow-cyan animate-pulse-slow opacity-50" style={{ animationDelay: '1.5s' }} />
            </div>

            {/* Avatar canvas */}
            <div className="w-full h-full">
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  </div>
                }
              >
                <AvatarCanvas mouseX={mouseRef.current.x} mouseY={mouseRef.current.y} />
              </Suspense>
            </div>

            {/* Floating label badges */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute top-8 left-4 sm:left-0 glass-card border-glow rounded-xl px-3 py-2 pointer-events-none"
            >
              <div className="text-[10px] font-mono text-muted">Warwick MSc AI</div>
              <div className="text-xs font-semibold text-white mt-0.5">2025–2026</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="absolute bottom-16 right-4 sm:right-0 glass-card border-glow-cyan rounded-xl px-3 py-2 pointer-events-none"
            >
              <div className="text-[10px] font-mono text-muted">Production ML</div>
              <div className="text-xs font-semibold text-secondary mt-0.5">120k+ Docs Processed</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.6 }}
              className="absolute top-1/2 right-2 sm:-right-4 -translate-y-1/2 glass-card border-glow rounded-xl px-3 py-2 pointer-events-none"
            >
              <div className="text-[10px] font-mono text-muted">3 Int'l Papers</div>
              <div className="text-xs font-semibold text-primary mt-0.5">Published Researcher</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10"
      >
        <span className="text-xs font-mono text-muted/50">scroll</span>
        <div className="w-0.5 h-8 bg-gradient-to-b from-primary/60 to-transparent rounded-full" />
      </motion.div>
    </section>
  )
}
