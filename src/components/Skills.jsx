import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer, scaleIn, viewportOnce } from '../utils/motion'
import { SKILL_CATEGORIES } from '../utils/constants'

/* ─── Animated skill chip ──────────────────────────────────── */
function SkillChip({ label, color, delay }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.06, y: -2 }}
      className={color === 'cyan' ? 'skill-chip skill-chip-cyan' : 'skill-chip'}
    >
      {label}
    </motion.span>
  )
}

/* ─── Category card ────────────────────────────────────────── */
function CategoryCard({ category, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      variants={scaleIn}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`glass-card rounded-2xl p-5 sm:p-6 transition-all duration-300 ${
        hovered
          ? category.color === 'purple'
            ? 'border-primary/35 shadow-glow-sm'
            : 'border-secondary/30 shadow-glow-cyan'
          : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${
          category.color === 'purple' ? 'bg-primary/15' : 'bg-secondary/10'
        }`}>
          {category.icon}
        </div>
        <h3 className="font-display font-semibold text-white text-sm">{category.category}</h3>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill, i) => (
          <SkillChip
            key={skill}
            label={skill}
            color={category.color}
            delay={0.05 * i}
          />
        ))}
      </div>
    </motion.div>
  )
}

/* ─── Proficiency bar ──────────────────────────────────────── */
function ProficiencyBar({ label, level, color }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white">{label}</span>
        <span className="text-xs font-mono text-muted">{level}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className={`h-full rounded-full ${
            color === 'cyan'
              ? 'bg-gradient-to-r from-secondary to-cyan-300'
              : 'bg-gradient-to-r from-primary to-purple-300'
          }`}
        />
      </div>
    </div>
  )
}

const PROFICIENCY = [
  { label: 'Python & ML Engineering',        level: 95, color: 'purple' },
  { label: 'NLP / Transformers / LLMs',       level: 92, color: 'purple' },
  { label: 'RAG & Vector Search',             level: 90, color: 'cyan'   },
  { label: 'PyTorch / TensorFlow',            level: 88, color: 'purple' },
  { label: 'Azure OpenAI & Cloud Services',   level: 85, color: 'cyan'   },
  { label: 'MLOps / CI/CD / Docker',          level: 82, color: 'purple' },
  { label: 'Computer Vision / OpenCV',        level: 80, color: 'cyan'   },
]

export default function Skills() {
  return (
    <section id="skills" className="relative section-padding overflow-hidden">

      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 blob-cyan opacity-15 pointer-events-none" aria-hidden />

      <div className="section-max">

        {/* Header */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-14"
        >
          <motion.span variants={fadeInUp} className="section-label">Technical Skills</motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-3xl sm:text-4xl font-bold text-white mt-2"
          >
            Tools of the <span className="gradient-text">Trade</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted text-sm sm:text-base mt-3 max-w-xl">
            A carefully cultivated stack across the full ML lifecycle — from data engineering to model serving and monitoring.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* Left: category cards */}
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="lg:col-span-2 grid sm:grid-cols-2 gap-4"
          >
            {SKILL_CATEGORIES.map((cat, i) => (
              <CategoryCard key={cat.category} category={cat} index={i} />
            ))}
          </motion.div>

          {/* Right: proficiency bars */}
          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="space-y-4"
          >
            <motion.div variants={fadeInUp}>
              <h3 className="font-display font-semibold text-white mb-6">Core Proficiencies</h3>
            </motion.div>
            {PROFICIENCY.map((item) => (
              <motion.div key={item.label} variants={fadeInUp}>
                <ProficiencyBar {...item} />
              </motion.div>
            ))}

            {/* Bottom note */}
            <motion.div
              variants={fadeInUp}
              className="mt-6 pt-4 border-t border-white/5"
            >
              <p className="text-xs text-muted leading-relaxed">
                Proficiency reflects real production experience and research depth, not self-assessment alone.
              </p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
