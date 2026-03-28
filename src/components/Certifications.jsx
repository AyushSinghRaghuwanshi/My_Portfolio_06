import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer, viewportOnce } from '../utils/motion'
import { CERTIFICATIONS } from '../utils/constants'

export default function Certifications() {
  return (
    <section id="certifications" className="relative section-padding overflow-hidden">
      <div className="section-max">

        {/* Header */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-12"
        >
          <motion.span variants={fadeInUp} className="section-label">Certifications</motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-3xl sm:text-4xl font-bold text-white mt-2"
          >
            Professional <span className="gradient-text">Credentials</span>
          </motion.h2>
        </motion.div>

        {/* Certification cards */}
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl"
        >
          {CERTIFICATIONS.map((cert) => (
            <motion.div
              key={cert.credentialId}
              variants={fadeInUp}
              whileHover={{ y: -4, scale: 1.01 }}
              className="glass-card-strong rounded-2xl p-6 border-primary/20 hover:border-primary/40 hover:shadow-glow-sm transition-all duration-300"
            >
              {/* Badge / Icon */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0078D4] to-[#005A9E] flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm font-mono">{cert.badge}</span>
                </div>
                <svg className="w-5 h-5 text-primary opacity-60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-white text-sm leading-snug mb-1.5">{cert.title}</h3>

              {/* Issuer & date */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-primary text-xs font-medium">{cert.issuer}</span>
                <span className="text-white/20 text-xs">·</span>
                <span className="text-muted text-xs">{cert.date}</span>
              </div>

              {/* Credential ID */}
              <div className="pt-3 border-t border-white/5">
                <span className="text-[10px] font-mono text-muted/60 uppercase tracking-wider">Credential ID</span>
                <p className="font-mono text-xs text-muted mt-0.5 break-all">{cert.credentialId}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
