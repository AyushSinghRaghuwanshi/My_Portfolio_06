import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer, viewportOnce } from '../utils/motion'
import { AWARDS } from '../utils/constants'

export default function Awards() {
  return (
    <section id="awards" className="relative section-padding overflow-hidden">
      <div className="section-max">

        {/* Header */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-12"
        >
          <motion.span variants={fadeInUp} className="section-label">Awards & Recognition</motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-3xl sm:text-4xl font-bold text-white mt-2"
          >
            National-Level <span className="gradient-text">Recognition</span>
          </motion.h2>
        </motion.div>

        {/* Award cards */}
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid sm:grid-cols-2 gap-5 max-w-2xl"
        >
          {AWARDS.map((award, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -4, scale: 1.01 }}
              className="glass-card-strong rounded-2xl p-6 border-yellow-500/15 hover:border-yellow-400/35 hover:shadow-[0_0_25px_rgba(234,179,8,0.2)] transition-all duration-300"
            >
              {/* Trophy icon */}
              <div className="text-3xl mb-3">{award.icon}</div>

              <h3 className="font-semibold text-white text-sm leading-snug mb-2">{award.title}</h3>

              <p className="text-muted text-xs leading-relaxed mb-3">{award.issuer}</p>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-mono">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                {award.date}
              </span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
