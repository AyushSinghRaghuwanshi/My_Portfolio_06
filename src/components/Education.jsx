import { motion } from 'framer-motion'
import { fadeInUp, fadeInLeft, staggerContainer, viewportOnce } from '../utils/motion'
import { EDUCATION } from '../utils/constants'

function EducationCard({ edu, index }) {
  const isEven = index % 2 === 0

  return (
    <motion.div
      variants={fadeInLeft}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="relative pl-8 sm:pl-14"
    >
      {/* Timeline line segment */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/60 to-transparent" />

      {/* Timeline dot */}
      <div className="absolute left-[-6px] top-2 w-3.5 h-3.5 rounded-full bg-dark border-2 border-primary shadow-glow-sm" />

      {/* Card */}
      <div className={`glass-card-strong rounded-2xl overflow-hidden hover:shadow-glow-sm transition-all duration-500 ${
        isEven ? 'border-primary/20' : 'border-secondary/20'
      }`}>
        {/* Top gradient bar */}
        <div className={`h-1 ${
          isEven
            ? 'bg-gradient-to-r from-primary to-purple-400'
            : 'bg-gradient-to-r from-secondary to-cyan-400'
        }`} />

        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
            <div>
              {/* Degree */}
              <h3 className="font-display font-bold text-white text-base sm:text-lg leading-snug">
                {edu.degree}
              </h3>
              {/* Institution */}
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`font-medium text-sm ${isEven ? 'text-primary' : 'text-secondary'}`}>
                  {edu.institution}
                </span>
                <span className="text-white/20 text-xs">·</span>
                <span className="text-muted text-xs">{edu.location}</span>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border ${
                isEven
                  ? 'bg-primary/10 border-primary/25 text-primary'
                  : 'bg-secondary/10 border-secondary/20 text-secondary'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isEven ? 'bg-primary' : 'bg-secondary'}`} />
                {edu.period}
              </span>
              {edu.cgpa && (
                <span className="flex items-center gap-1 text-xs text-muted">
                  <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  CGPA: <span className="text-white font-semibold">{edu.cgpa}</span>
                </span>
              )}
            </div>
          </div>

          {/* Highlights */}
          <ul className="space-y-2">
            {edu.highlights.map((h, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-muted">
                <span className={`w-1 h-1 rounded-full mt-2 shrink-0 ${isEven ? 'bg-primary' : 'bg-secondary'}`} />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

export default function Education() {
  return (
    <section id="education" className="relative section-padding overflow-hidden">

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-64 blob-purple opacity-15 pointer-events-none" aria-hidden />

      <div className="section-max">

        {/* Header */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-14"
        >
          <motion.span variants={fadeInUp} className="section-label">Education</motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-3xl sm:text-4xl font-bold text-white mt-2"
          >
            Academic <span className="gradient-text">Foundation</span>
          </motion.h2>
        </motion.div>

        {/* Cards */}
        <div className="space-y-8 max-w-3xl">
          {EDUCATION.map((edu, i) => (
            <EducationCard key={i} edu={edu} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
