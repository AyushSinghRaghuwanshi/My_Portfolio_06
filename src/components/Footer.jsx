import { motion } from 'framer-motion'
import { SOCIAL, NAV_LINKS } from '../utils/constants'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-white/5 bg-dark/80 backdrop-blur-sm">
      {/* Top gradient bar */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="section-max section-padding py-10 sm:py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="font-display font-bold text-white text-sm">A</span>
              </div>
              <span className="font-display font-semibold text-white">Ayush<span className="gradient-text">.</span></span>
            </div>
            <p className="text-muted text-xs leading-relaxed max-w-xs">
              Machine Learning Engineer · AI Engineer · Applied AI Researcher. Building intelligent systems that make a measurable difference.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-muted/60 mb-3">Navigate</h4>
            <ul className="space-y-2">
              {NAV_LINKS.slice(0, 4).map(l => (
                <li key={l.href}>
                  <button
                    onClick={() => document.querySelector(l.href)?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm text-muted hover:text-white transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-muted/60 mb-3">More</h4>
            <ul className="space-y-2">
              {NAV_LINKS.slice(4).map(l => (
                <li key={l.href}>
                  <button
                    onClick={() => document.querySelector(l.href)?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm text-muted hover:text-white transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-muted/60 mb-3">Connect</h4>
            <div className="flex flex-col gap-2">
              <a
                href={`mailto:${SOCIAL.email}`}
                className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors group"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="truncate">{SOCIAL.email}</span>
              </a>
              {/* TODO: Update LinkedIn URL in src/utils/constants.js */}
              <a
                href={SOCIAL.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors"
              >
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
              {/* TODO: Update GitHub URL in src/utils/constants.js */}
              <a
                href={SOCIAL.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted/50">
            © {year} Ayush Singh Raghuwanshi. All rights reserved.
          </p>
          <p className="text-xs text-muted/40">
            Built with React · Three.js · Framer Motion · Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}
