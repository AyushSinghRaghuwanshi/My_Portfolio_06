import { motion } from 'framer-motion'
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, viewportOnce } from '../utils/motion'

const PILLARS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Production ML Systems',
    body: 'End-to-end ML pipelines processing 120k+ enterprise documents in production — from data ingestion through model serving and monitoring.',
    color: 'purple',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'LLMs & RAG Engineering',
    body: 'Architected Azure OpenAI-powered retrieval-augmented systems that reduced document analysis turnaround by 40% and rework by 25%.',
    color: 'cyan',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'MLOps & CI/CD',
    body: 'Azure DevOps pipelines with model versioning, validation gates, drift detection, and automated deployment — cutting failures by 15%.',
    color: 'purple',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: 'Applied AI Research',
    body: 'Three peer-reviewed international publications in deep learning, EEG analysis, and medical AI — bridging research depth with engineering impact.',
    color: 'cyan',
  },
]

export default function About() {
  return (
    <section id="about" className="relative section-padding overflow-hidden">

      {/* Background accent */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 blob-purple opacity-25 pointer-events-none" aria-hidden />

      <div className="section-max">

        {/* Header */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-14"
        >
          <motion.span variants={fadeInUp} className="section-label">About Me</motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-3xl sm:text-4xl font-bold text-white mt-2"
          >
            Turning AI Research Into{' '}
            <span className="gradient-text">Enterprise Impact</span>
          </motion.h2>
        </motion.div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">

          {/* Left column — narrative */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="lg:col-span-3 space-y-5 text-muted text-sm sm:text-base leading-relaxed"
          >
            <p>
              I'm a <span className="text-white font-medium">Machine Learning Engineer</span> with 3+ years of experience building AI systems that actually work in production. I like the gap between research and shipping — taking ideas from papers and turning them into things that run reliably at scale.
            </p>
            <p>
              At Cybage, I built ML pipelines processing <span className="text-primary font-medium">120k+ enterprise documents</span> — pulling together Azure OpenAI (GPT-4o), RoBERTa, and spaCy NER into automated workflows. Cut manual effort by 30% and pushed macro F1 up by 8%.
            </p>
            <p>
              I also built <span className="text-secondary font-medium">RAG-based Q&A and summarisation</span> using vector embeddings and prompt engineering — 40% faster turnaround. Set up CI/CD via Azure DevOps with model versioning and drift detection, which made deployments noticeably less stressful.
            </p>
            <p>
              Currently doing my <span className="text-white font-medium">MSc in Applied AI at Warwick</span>. Three published papers at international conferences and a couple of national competition wins along the way.
            </p>

            {/* Tech stack quick view */}
            <div className="pt-2 flex flex-wrap gap-2">
              {['Python', 'PyTorch', 'Azure OpenAI', 'RAG', 'Transformers', 'Docker', 'Azure DevOps', 'spaCy'].map(t => (
                <span key={t} className="skill-chip text-xs">{t}</span>
              ))}
            </div>
          </motion.div>

          {/* Right column — pillars */}
          <motion.div
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="lg:col-span-2 grid sm:grid-cols-2 lg:grid-cols-1 gap-4"
          >
            {PILLARS.map((p) => (
              <motion.div
                key={p.title}
                variants={fadeInUp}
                className="glass-card rounded-2xl p-4 group hover:border-primary/30 transition-all duration-300"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                  p.color === 'purple'
                    ? 'bg-primary/15 text-primary'
                    : 'bg-secondary/10 text-secondary'
                }`}>
                  {p.icon}
                </div>
                <h3 className="font-semibold text-white text-sm mb-1.5">{p.title}</h3>
                <p className="text-muted text-xs leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
