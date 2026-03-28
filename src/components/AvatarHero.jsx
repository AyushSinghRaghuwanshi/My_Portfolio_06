import { useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'

// ─── Tech badges orbiting the avatar ───────────────────────────
// Positions are (angle in degrees, radius in px from center)
const TECH_ORBS = [
  { label: 'PyTorch',      color: 'purple', angle: -80,  r: 195, delay: 0    },
  { label: 'LLMs',         color: 'cyan',   angle: -20,  r: 205, delay: 0.4  },
  { label: 'RAG',          color: 'purple', angle: 35,   r: 195, delay: 0.8  },
  { label: 'Azure AI',     color: 'cyan',   angle: 95,   r: 200, delay: 1.2  },
  { label: 'NLP',          color: 'purple', angle: 145,  r: 190, delay: 1.6  },
  { label: 'Python',       color: 'cyan',   angle: 200,  r: 200, delay: 2.0  },
  { label: 'MLOps',        color: 'purple', angle: 255,  r: 195, delay: 2.4  },
  { label: 'Transformers', color: 'cyan',   angle: 305,  r: 205, delay: 2.8  },
]

// Degree → radians helper
const toRad = (deg) => (deg * Math.PI) / 180

export default function AvatarHero() {
  const containerRef = useRef()

  // Framer Motion mouse-tracking values
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotateY  = useSpring(useTransform(rawX, [-0.5, 0.5], [-12, 12]),  { stiffness: 120, damping: 22 })
  const rotateX  = useSpring(useTransform(rawY, [-0.5, 0.5], [10, -10]),  { stiffness: 120, damping: 22 })
  const glowX    = useSpring(useTransform(rawX, [-0.5, 0.5], [-12, 12]),  { stiffness: 80,  damping: 20 })
  const glowY    = useSpring(useTransform(rawY, [-0.5, 0.5], [-12, 12]),  { stiffness: 80,  damping: 20 })

  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    rawX.set((e.clientX - rect.left) / rect.width  - 0.5)
    rawY.set((e.clientY - rect.top)  / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center select-none"
      style={{ width: 440, height: 440 }}
    >
      {/* ── Outer ambient glow ── */}
      <motion.div
        style={{ x: glowX, y: glowY }}
        className="absolute w-72 h-72 rounded-full pointer-events-none"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden
      >
        <div className="w-full h-full rounded-full bg-glow-purple opacity-60" />
      </motion.div>

      {/* ── Rotating orbital ring 1 ── */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute pointer-events-none"
        style={{ width: 310, height: 310 }}
        aria-hidden
      >
        <div className="w-full h-full rounded-full border border-primary/25" />
        {/* Ring dot */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary shadow-glow-sm" />
      </motion.div>

      {/* ── Rotating orbital ring 2 ── */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
        className="absolute pointer-events-none"
        style={{ width: 350, height: 350 }}
        aria-hidden
      >
        <div className="w-full h-full rounded-full border border-secondary/15" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-secondary shadow-glow-cyan" />
      </motion.div>

      {/* ── Floating tech badges ── */}
      {TECH_ORBS.map((orb) => {
        const bx = Math.cos(toRad(orb.angle)) * orb.r
        const by = Math.sin(toRad(orb.angle)) * orb.r
        return (
          <motion.div
            key={orb.label}
            className="absolute pointer-events-none"
            style={{ x: bx, y: by }}
            animate={{ y: [by - 7, by + 7, by - 7] }}
            transition={{
              duration: 2.8 + orb.delay * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: orb.delay,
            }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + orb.delay * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={`block whitespace-nowrap text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full border shadow-lg ${
                orb.color === 'cyan'
                  ? 'bg-secondary/10 border-secondary/30 text-secondary backdrop-blur-sm'
                  : 'bg-primary/12 border-primary/35 text-primary backdrop-blur-sm'
              }`}
              style={{ background: orb.color === 'cyan' ? 'rgba(0,217,255,0.10)' : 'rgba(145,94,255,0.12)' }}
            >
              {orb.label}
            </motion.span>
          </motion.div>
        )
      })}

      {/* ── Avatar with 3D tilt ── */}
      <motion.div
        style={{ rotateX, rotateY, transformPerspective: 900 }}
        className="relative z-10"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Glow behind avatar */}
        <div
          className="absolute -inset-4 rounded-full blur-2xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(145,94,255,0.35) 0%, rgba(0,217,255,0.15) 60%, transparent 100%)' }}
          aria-hidden
        />

        {/* Avatar frame */}
        <div
          className="relative overflow-hidden shadow-2xl"
          style={{
            width: 220,
            height: 220,
            borderRadius: '50%',
            border: '2px solid rgba(145,94,255,0.5)',
            boxShadow: '0 0 40px rgba(145,94,255,0.4), 0 0 80px rgba(0,217,255,0.15)',
          }}
        >
          {/* Avatar image — replace avatar.png in /public with your own photo/avatar */}
          <img
            src="/avatar.png"
            alt="Ayush Singh Raghuwanshi"
            className="w-full h-full object-cover object-top"
            style={{ transform: 'scale(1.05)' }}
            onError={(e) => { e.currentTarget.src = '/avatar.svg' }}
          />

          {/* Shine overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)' }}
            aria-hidden
          />
        </div>

        {/* Status badge below avatar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap backdrop-blur-sm border border-green-500/30"
          style={{ background: 'rgba(0,0,0,0.5)' }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          <span className="text-green-300">Open to Work</span>
        </motion.div>
      </motion.div>
    </div>
  )
}
