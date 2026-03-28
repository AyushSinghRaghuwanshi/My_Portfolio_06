import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer, viewportOnce } from '../utils/motion'
import { PROJECTS } from '../utils/constants'

/* ─── 3D tilt card hook ────────────────────────────────────── */
function useTilt() {
  const ref = useRef()

  const handleMouseMove = (e) => {
    const card = ref.current
    if (!card) return
    const rect   = card.getBoundingClientRect()
    const cx     = rect.left + rect.width  / 2
    const cy     = rect.top  + rect.height / 2
    const dx     = (e.clientX - cx) / (rect.width  / 2)
    const dy     = (e.clientY - cy) / (rect.height / 2)
    card.style.transform = `perspective(1000px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg) scale3d(1.02,1.02,1.02)`
  }

  const handleMouseLeave = () => {
    if (ref.current) {
      ref.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    }
  }

  return { ref, handleMouseMove, handleMouseLeave }
}

/* ─── Project card ─────────────────────────────────────────── */
function ProjectCard({ project, index }) {
  const { ref, handleMouseMove, handleMouseLeave } = useTilt()
  const [hovered, setHovered] = useState(false)
  const isLeft = index % 2 === 0

  return (
    <motion.div
      variants={fadeInUp}
      className="relative"
    >
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setHovered(true)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        style={{ transition: 'transform 0.15s ease, box-shadow 0.3s ease' }}
        className={`glass-card-strong rounded-2xl overflow-hidden cursor-default ${
          project.color === 'purple'
            ? hovered ? 'shadow-glow-md border-primary/40' : 'border-primary/15'
            : hovered ? 'shadow-glow-cyan border-secondary/40' : 'border-secondary/15'
        } transition-all duration-300`}
      >
        {/* Top accent bar */}
        <div className={`h-1 w-full ${
          project.color === 'purple'
            ? 'bg-gradient-to-r from-primary via-purple-400 to-secondary'
            : 'bg-gradient-to-r from-secondary via-cyan-400 to-primary'
        }`} />

        <div className="p-6 sm:p-8">
          {/* Project number + title */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <span className={`font-mono text-xs mb-2 block ${project.color === 'purple' ? 'text-primary' : 'text-secondary'}`}>
                {String(index + 1).padStart(2, '0')} / PROJECT
              </span>
              <h3 className="font-display font-bold text-white text-lg sm:text-xl leading-tight">
                {project.title}
              </h3>
              <p className={`text-xs mt-1.5 font-medium ${project.color === 'purple' ? 'text-purple-300' : 'text-cyan-300'}`}>
                {project.subtitle}
              </p>
            </div>

            {/* Icon */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              project.color === 'purple' ? 'bg-primary/15' : 'bg-secondary/10'
            }`}>
              {project.id === 'maintenance-logs' && (
                <svg className={`w-5 h-5 ${project.color === 'purple' ? 'text-primary' : 'text-secondary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                </svg>
              )}
              {project.id === 'pose-estimation' && (
                <svg className={`w-5 h-5 ${project.color === 'purple' ? 'text-primary' : 'text-secondary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
              {project.id === 'eeg-classification' && (
                <svg className={`w-5 h-5 ${project.color === 'purple' ? 'text-primary' : 'text-secondary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-muted text-sm leading-relaxed mb-6">{project.description}</p>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {project.metrics.map(m => (
              <div
                key={m.label}
                className={`rounded-xl p-3 text-center ${
                  project.color === 'purple'
                    ? 'bg-primary/08 border border-primary/20'
                    : 'bg-secondary/06 border border-secondary/15'
                }`}
                style={{ background: project.color === 'purple' ? 'rgba(145,94,255,0.08)' : 'rgba(0,217,255,0.06)' }}
              >
                <div className={`font-display font-bold text-base sm:text-lg ${
                  project.color === 'purple' ? 'text-primary' : 'text-secondary'
                }`}>{m.value}</div>
                <div className="text-muted text-[10px] mt-0.5 leading-tight">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Tech stack */}
          <div className="pt-4 border-t border-white/5">
            <div className="flex flex-wrap gap-2">
              {project.stack.map(s => (
                <span
                  key={s}
                  className={project.color === 'purple' ? 'skill-chip' : 'skill-chip skill-chip-cyan'}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Section ──────────────────────────────────────────────── */
export default function Projects() {
  return (
    <section id="projects" className="relative section-padding overflow-hidden">

      <div className="absolute bottom-0 right-0 w-96 h-96 blob-purple opacity-20 pointer-events-none" aria-hidden />

      <div className="section-max">

        {/* Header */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-14"
        >
          <motion.span variants={fadeInUp} className="section-label">Featured Projects</motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-3xl sm:text-4xl font-bold text-white mt-2"
          >
            AI Systems Built{' '}
            <span className="gradient-text">to Perform</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted text-sm sm:text-base mt-3 max-w-xl">
            Research-grade models engineered for real-world performance — measurable accuracy, production architecture, and documented outcomes.
          </motion.p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </motion.div>

      </div>
    </section>
  )
}
