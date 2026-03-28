import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, viewportOnce } from '../utils/motion'
import { SOCIAL } from '../utils/constants'

/* ─── Contact info item ────────────────────────────────────── */
function ContactItem({ icon, label, value, href, color }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className={`flex items-center gap-4 p-4 glass-card rounded-xl hover:border-primary/30 transition-all duration-300 group`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
        color === 'cyan' ? 'bg-secondary/10' : 'bg-primary/12'
      }`} style={{ background: color === 'cyan' ? 'rgba(0,217,255,0.1)' : 'rgba(145,94,255,0.12)' }}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted font-mono uppercase tracking-wider mb-0.5">{label}</p>
        <p className={`text-sm font-medium truncate transition-colors group-hover:text-white ${
          color === 'cyan' ? 'text-secondary' : 'text-primary'
        }`}>{value}</p>
      </div>
      <svg className="w-4 h-4 text-muted/40 group-hover:text-primary ml-auto transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  )
}

/* ─── Contact form ─────────────────────────────────────────── */
function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null) // null | 'sending' | 'sent' | 'error'

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    // Opens mailto — replace with your preferred form backend (Formspree, EmailJS, etc.)
    const subject = encodeURIComponent(form.subject || 'Portfolio Contact')
    const body    = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)
    window.location.href = `mailto:${SOCIAL.email}?subject=${subject}&body=${body}`
    setStatus('sent')
  }

  const inputClass = `w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-muted/50
    focus:outline-none focus:border-primary/50 focus:bg-white/6 transition-all duration-200`

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-muted mb-1.5 uppercase tracking-wider">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
            required
            className={inputClass}
            style={{ background: 'rgba(255,255,255,0.04)' }}
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-muted mb-1.5 uppercase tracking-wider">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
            className={inputClass}
            style={{ background: 'rgba(255,255,255,0.04)' }}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-muted mb-1.5 uppercase tracking-wider">Subject</label>
        <input
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="What's this about?"
          className={inputClass}
          style={{ background: 'rgba(255,255,255,0.04)' }}
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-muted mb-1.5 uppercase tracking-wider">Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={5}
          placeholder="Your message here..."
          required
          className={`${inputClass} resize-none`}
          style={{ background: 'rgba(255,255,255,0.04)' }}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sent'}
        className="w-full btn-primary justify-center py-3.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'sent' ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Message Sent!
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Send Message
          </>
        )}
      </button>
    </form>
  )
}

/* ─── Section ──────────────────────────────────────────────── */
export default function Contact() {
  return (
    <section id="contact" className="relative section-padding overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] blob-purple opacity-20 pointer-events-none" aria-hidden />

      <div className="section-max">

        {/* Header */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-14 text-center"
        >
          <motion.span variants={fadeInUp} className="section-label">Get In Touch</motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-3xl sm:text-4xl font-bold text-white mt-2"
          >
            Let's Build Something <span className="gradient-text">Intelligent</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted text-sm sm:text-base mt-3 max-w-xl mx-auto">
            Open to ML Engineering roles, applied AI research positions, and collaborative projects. Reach out and let's talk.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">

          {/* Left: contact info */}
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="lg:col-span-2 space-y-3"
          >
            <motion.div variants={fadeInLeft}>
              <ContactItem
                icon={
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
                label="Email"
                value={SOCIAL.email}
                href={`mailto:${SOCIAL.email}`}
                color="purple"
              />
            </motion.div>

            <motion.div variants={fadeInLeft}>
              <ContactItem
                icon={
                  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
                label="Phone"
                value={SOCIAL.phone}
                href={`tel:${SOCIAL.phone.replace(/\s/g, '')}`}
                color="cyan"
              />
            </motion.div>

            {/* TODO: Update LinkedIn URL in src/utils/constants.js */}
            <motion.div variants={fadeInLeft}>
              <ContactItem
                icon={
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                }
                label="LinkedIn"
                value="linkedin.com/in/your-profile"
                href={SOCIAL.linkedin}
                color="purple"
              />
            </motion.div>

            {/* TODO: Update GitHub URL in src/utils/constants.js */}
            <motion.div variants={fadeInLeft}>
              <ContactItem
                icon={
                  <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                }
                label="GitHub"
                value="github.com/your-username"
                href={SOCIAL.github}
                color="cyan"
              />
            </motion.div>

            {/* Availability badge */}
            <motion.div
              variants={fadeInUp}
              className="mt-2 p-4 glass-card rounded-xl border border-green-500/20"
            >
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
                </span>
                <div>
                  <p className="text-green-300 text-xs font-semibold">Open to Opportunities</p>
                  <p className="text-muted text-[11px] mt-0.5">ML Engineer · AI Engineer · Applied AI Researcher</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="lg:col-span-3 glass-card-strong rounded-2xl p-6 sm:p-8 border-glow"
          >
            <h3 className="font-display font-semibold text-white text-lg mb-6">Send a Message</h3>
            <ContactForm />
          </motion.div>
        </div>

      </div>
    </section>
  )
}
