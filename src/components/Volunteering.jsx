import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer, viewportOnce } from '../utils/motion'
import { VOLUNTEERING } from '../utils/constants'

export default function Volunteering() {
  return (
    <section id="volunteering" className="relative section-padding overflow-hidden">
      <div className="section-max">

        {/* Header */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-12"
        >
          <motion.span variants={fadeInUp} className="section-label">Volunteering</motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-3xl sm:text-4xl font-bold text-white mt-2"
          >
            Community <span className="gradient-text">Engagement</span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="space-y-4 max-w-2xl"
        >
          {VOLUNTEERING.map((vol, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="glass-card rounded-2xl p-6 sm:p-7 hover:border-secondary/30 hover:shadow-glow-cyan transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-white text-sm">{vol.role}</h3>
                      <p className="text-secondary text-xs font-medium mt-0.5">{vol.organisation}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-mono shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse-slow" />
                      {vol.period}
                    </span>
                  </div>
                  <p className="text-muted text-sm leading-relaxed">{vol.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
