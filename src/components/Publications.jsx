import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer, viewportOnce } from '../utils/motion'
import { PUBLICATIONS } from '../utils/constants'

function PublicationCard({ pub, index }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="relative glass-card rounded-2xl p-6 sm:p-7 hover:border-primary/30 hover:shadow-glow-sm transition-all duration-300 group"
    >
      {/* Index number */}
      <div className="absolute top-5 right-5 font-mono text-2xl font-bold text-white/5 group-hover:text-white/8 transition-colors select-none">
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Icon */}
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/12 flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(145,94,255,0.12)' }}>
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="font-semibold text-white text-sm sm:text-base leading-snug mb-2 pr-8">
            {pub.title}
          </h3>

          {/* Venue + date */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-primary text-xs font-medium">{pub.venue}</span>
            <span className="text-white/20">·</span>
            <span className="text-muted text-xs">{pub.date}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {pub.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-primary/10 border border-primary/20 text-purple-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Publications() {
  return (
    <section id="publications" className="relative section-padding overflow-hidden">

      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 blob-purple opacity-15 pointer-events-none" aria-hidden />

      <div className="section-max">

        {/* Header */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-12"
        >
          <motion.span variants={fadeInUp} className="section-label">Research & Publications</motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-3xl sm:text-4xl font-bold text-white mt-2"
          >
            Peer-Reviewed <span className="gradient-text">Research</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted text-sm sm:text-base mt-3 max-w-xl">
            Three international publications spanning deep learning, EEG analysis, and medical AI — bridging theoretical depth with engineering ambition.
          </motion.p>
        </motion.div>

        {/* Publication list */}
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="space-y-4 max-w-3xl"
        >
          {PUBLICATIONS.map((pub, i) => (
            <PublicationCard key={i} pub={pub} index={i} />
          ))}
        </motion.div>

      </div>
    </section>
  )
}
