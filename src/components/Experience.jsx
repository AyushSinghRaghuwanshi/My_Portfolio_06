import { motion } from 'framer-motion'
import { fadeInUp, fadeInLeft, staggerContainer, viewportOnce } from '../utils/motion'
import { EXPERIENCE } from '../utils/constants'

export default function Experience() {
  return (
    <section id="experience" className="relative section-padding overflow-hidden">

      {/* Background accent */}
      <div className="absolute top-0 left-0 w-80 h-80 blob-cyan opacity-15 pointer-events-none" aria-hidden />

      <div className="section-max">

        {/* Header */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-14"
        >
          <motion.span variants={fadeInUp} className="section-label">Work Experience</motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-3xl sm:text-4xl font-bold text-white mt-2"
          >
            Engineering <span className="gradient-text">AI at Scale</span>
          </motion.h2>
        </motion.div>

        {/* Timeline */}
        {EXPERIENCE.map((exp, idx) => (
          <motion.div
            key={idx}
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="relative pl-8 sm:pl-12"
          >
            {/* Timeline vertical line */}
            <div className="timeline-line" />

            {/* Timeline dot */}
            <div className="absolute left-[-5px] top-1 w-3 h-3 rounded-full bg-primary shadow-glow-sm" />

            {/* Card */}
            <div className="glass-card-strong rounded-2xl p-6 sm:p-8 border-glow hover:shadow-glow-md transition-all duration-500">

              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
                <div>
                  <h3 className="font-display font-bold text-white text-lg sm:text-xl">{exp.role}</h3>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-primary font-medium text-sm">{exp.company}</span>
                    <span className="text-white/20 text-xs">·</span>
                    <span className="text-muted text-xs">{exp.location}</span>
                  </div>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {exp.period}
                  </span>
                  <span className="text-muted text-xs">{exp.duration}</span>
                </div>
              </div>

              {/* Highlights */}
              <motion.ul
                variants={staggerContainer(0.08)}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                className="space-y-3 mb-6"
              >
                {exp.highlights.map((h, i) => (
                  <motion.li
                    key={i}
                    variants={fadeInUp}
                    className="flex gap-3 text-sm text-muted leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-[7px] shrink-0" />
                    <span dangerouslySetInnerHTML={{ __html: h }} />
                  </motion.li>
                ))}
              </motion.ul>

              {/* Tech stack */}
              <div className="pt-4 border-t border-white/5">
                <p className="text-xs font-mono text-muted mb-2.5">Tech Stack</p>
                <div className="flex flex-wrap gap-2">
                  {exp.stack.map(s => (
                    <span key={s} className="skill-chip">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Future role teaser */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative pl-8 sm:pl-12 mt-6"
        >
          <div className="absolute left-[-5px] top-1 w-3 h-3 rounded-full border-2 border-primary/50 bg-dark" />
          <div className="glass-card rounded-2xl p-5 border border-dashed border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Open to Opportunities</p>
                <p className="text-muted text-xs mt-0.5">Seeking ML Engineer / AI Engineer roles — full-time or internship</p>
              </div>
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="ml-auto btn-primary text-xs py-1.5 px-4 shrink-0"
              >
                Get in Touch
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
