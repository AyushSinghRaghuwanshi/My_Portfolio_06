import { useRef, useCallback, Suspense } from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, fadeInUp, fadeInLeft, fadeInRight } from '../utils/motion'
import { CV_URL, SOCIAL } from '../utils/constants'
import NeuralBackground from './three/NeuralBackground'
import AvatarHero from './AvatarHero'

export default function Hero() {
  const mouseRef   = useRef({ x: 0, y: 0 })
  const sectionRef = useRef()

  const handleMouseMove = useCallback((e) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = {
      x: ((e.clientX - rect.left)  / rect.width  - 0.5) * 2,
      y: ((e.clientY - rect.top)   / rect.height - 0.5) * 2,
    }
  }, [])

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* ── Neural network background ── */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-35">
        <Suspense fallback={null}>
          <NeuralBackground mouseX={mouseRef.current.x} mouseY={mouseRef.current.y} />
        </Suspense>
      </div>

      {/* ── Radial gradient overlay ── */}
      <div className="absolute inset-0 z-0 bg-hero-gradient pointer-events-none" aria-hidden />

      {/* ── Bottom fade ── */}
      <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-dark to-transparent z-0 pointer-events-none" aria-hidden />

      {/* ── Main content ── */}
      <div className="relative z-10 section-max section-padding w-full">
        <div className="grid lg:grid-cols-2 gap-8 xl:gap-12 items-center">

          {/* ── Left: minimal text ── */}
          <motion.div
            variants={staggerContainer(0.12, 0.2)}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6 max-w-lg"
          >
            {/* Availability pill */}
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-xs font-mono text-primary backdrop-blur-sm"
                style={{ background: 'rgba(145,94,255,0.08)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Available for Opportunities
              </span>
            </motion.div>

            {/* Name */}
            <motion.div variants={fadeInUp} className="space-y-1">
              <h1 className="font-display font-bold leading-[1.05]">
                <span className="block text-5xl sm:text-6xl xl:text-7xl text-white">Ayush Singh</span>
                <span className="block text-5xl sm:text-6xl xl:text-7xl shimmer-text">Raghuwanshi</span>
              </h1>
            </motion.div>

            {/* Role tags */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-2">
              {['ML Engineer', 'AI Engineer', 'Applied AI Researcher'].map((r, i) => (
                <span
                  key={r}
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    i === 0
                      ? 'bg-primary/12 border-primary/30 text-primary'
                      : i === 1
                      ? 'bg-secondary/10 border-secondary/25 text-secondary'
                      : 'bg-white/5 border-white/15 text-white/70'
                  }`}
                  style={{ background: i === 0 ? 'rgba(145,94,255,0.12)' : i === 1 ? 'rgba(0,217,255,0.10)' : undefined }}
                >
                  {r}
                </span>
              ))}
            </motion.div>

            {/* One-liner */}
            <motion.p variants={fadeInUp} className="text-muted text-base leading-relaxed">
              Building <span className="text-white font-medium">production-grade LLM systems</span> and enterprise AI pipelines.
              MSc AI @ Warwick · 3+ yrs at scale.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
              <button
                onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                View Work
              </button>
              <a href={CV_URL} download className="btn-secondary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                Download CV
              </a>
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact
              </button>
            </motion.div>

            {/* Social row */}
            <motion.div variants={fadeInUp} className="flex items-center gap-4 pt-1">
              <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer"
                className="text-muted hover:text-primary transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href={SOCIAL.github} target="_blank" rel="noopener noreferrer"
                className="text-muted hover:text-white transition-colors" aria-label="GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href={`mailto:${SOCIAL.email}`}
                className="text-muted hover:text-secondary transition-colors" aria-label="Email">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>

              {/* Divider + quick stats */}
              <div className="h-5 w-px bg-white/10" />
              <div className="flex items-center gap-3 text-xs text-muted">
                <span><span className="text-white font-semibold">3+</span> yrs</span>
                <span className="text-white/20">·</span>
                <span><span className="text-white font-semibold">120k+</span> docs</span>
                <span className="text-white/20">·</span>
                <span><span className="text-white font-semibold">3</span> papers</span>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right: 3D interactive avatar ── */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center"
          >
            <AvatarHero />
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10"
      >
        <span className="text-[10px] font-mono text-muted/40 uppercase tracking-widest">scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-0.5 h-8 bg-gradient-to-b from-primary/50 to-transparent rounded-full"
        />
      </motion.div>
    </section>
  )
}
