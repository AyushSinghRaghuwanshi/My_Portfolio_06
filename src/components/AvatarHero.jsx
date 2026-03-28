/**
 * AvatarHero.jsx
 *
 * Hybrid layout:
 *  - Three.js canvas (absolute, full container): neural network,
 *    orbital rings, data streams — zero custom shaders
 *  - Avatar image (CSS / Framer Motion, centered on top):
 *    circular frame, 3D spring tilt, glow aura, floating animation
 *  - Tech badges (CSS, absolutely positioned): no Html-portal issues
 *
 * Splitting the image out of Three.js eliminates the shader + texture
 * bugs that caused the black screen on Vercel production.
 */

import { useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import AvatarScene from './three/AvatarScene'

/* ── Tech badges positioned around the avatar ─────────────────── */
const BADGES = [
  { label: 'PyTorch',       top: '6%',   left: '3%',   color: 'purple' },
  { label: 'LLMs',          top: '6%',   right: '3%',  color: 'cyan'   },
  { label: 'RAG',           top: '30%',  right: '0%',  color: 'purple' },
  { label: 'Azure AI',      top: '30%',  left: '0%',   color: 'cyan'   },
  { label: 'Transformers',  bottom: '18%', left: '2%', color: 'purple' },
  { label: 'MLOps',         bottom: '18%', right: '2%',color: 'cyan'   },
  { label: 'NLP',           bottom: '4%',  left: '22%', color: 'cyan'  },
  { label: 'Python',        bottom: '4%',  right: '22%',color: 'purple'},
]

function TechBadge({ label, color, style, delay }) {
  const purple = color === 'purple'
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'absolute',
        ...style,
        padding: '3px 11px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: 'monospace',
        whiteSpace: 'nowrap',
        background:     purple ? 'rgba(145,94,255,0.15)' : 'rgba(0,217,255,0.12)',
        border:         purple ? '1px solid rgba(145,94,255,0.45)' : '1px solid rgba(0,217,255,0.40)',
        color:          purple ? '#c4b5fd' : '#67e8f9',
        boxShadow:      purple ? '0 0 12px rgba(145,94,255,0.35)' : '0 0 12px rgba(0,217,255,0.28)',
        backdropFilter: 'blur(6px)',
        pointerEvents:  'none',
        userSelect:     'none',
        zIndex: 20,
      }}
    >
      {label}
    </motion.span>
  )
}

/* ── Avatar image with spring 3D tilt ────────────────────────── */
function AvatarImage() {
  const containerRef = useRef()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-14, 14]), { stiffness: 140, damping: 20 })
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [10, -10]),  { stiffness: 140, damping: 20 })

  const onMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    rawX.set((e.clientX - rect.left) / rect.width  - 0.5)
    rawY.set((e.clientY - rect.top)  / rect.height - 0.5)
  }, [rawX, rawY])

  const onLeave = useCallback(() => { rawX.set(0); rawY.set(0) }, [rawX, rawY])

  return (
    <div
      ref={containerRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
    >
      {/* Outer ambient glow */}
      <motion.div
        animate={{ scale: [1, 1.07, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: 220, height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(145,94,255,0.45) 0%, rgba(0,217,255,0.15) 55%, transparent 80%)',
          filter: 'blur(18px)',
          pointerEvents: 'none',
        }}
      />

      {/* 3D-tilting avatar frame */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformPerspective: 900,
          position: 'relative',
          width: 200,
          height: 200,
        }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Glow behind */}
        <div style={{
          position: 'absolute', inset: -10,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(145,94,255,0.40) 0%, rgba(0,217,255,0.18) 55%, transparent 80%)',
          filter: 'blur(14px)',
          pointerEvents: 'none',
        }} />

        {/* Circular avatar */}
        <div style={{
          position: 'relative',
          width: '100%', height: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid rgba(145,94,255,0.55)',
          boxShadow: '0 0 40px rgba(145,94,255,0.45), 0 0 80px rgba(0,217,255,0.15)',
        }}>
          <img
            src="/avatar.png"
            alt="Ayush Singh Raghuwanshi"
            onError={(e) => { e.currentTarget.src = '/avatar.svg' }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', transform: 'scale(1.06)', display: 'block' }}
          />
          {/* Shine overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.13) 0%, transparent 55%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Open to Work badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          style={{
            position: 'absolute',
            bottom: -18, left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 12px',
            borderRadius: 999,
            fontSize: 11, fontWeight: 600,
            whiteSpace: 'nowrap',
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(74,222,128,0.35)',
            color: '#86efac',
            backdropFilter: 'blur(8px)',
            zIndex: 30,
          }}
        >
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }}
          />
          Open to Work
        </motion.div>
      </motion.div>
    </div>
  )
}

/* ── Main export ─────────────────────────────────────────────── */
export default function AvatarHero() {
  const mousePos = useRef({ x: 0.5, y: 0.5 })

  const onMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mousePos.current.x = (e.clientX - rect.left) / rect.width
    mousePos.current.y = (e.clientY - rect.top)  / rect.height
  }, [])

  return (
    <div
      onMouseMove={onMouseMove}
      style={{ position: 'relative', width: 500, height: 500, flexShrink: 0 }}
    >
      {/* Layer 1: Three.js canvas (rings, neural net, particles) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <AvatarScene mousePos={mousePos} />
      </div>

      {/* Layer 2: Avatar image + glow (CSS / Framer Motion) */}
      <AvatarImage />

      {/* Layer 3: Tech badges (CSS positioned, no Html portal) */}
      {BADGES.map(({ label, color, top, bottom, left, right }, i) => (
        <TechBadge
          key={label}
          label={label}
          color={color}
          delay={0.5 + i * 0.1}
          style={{ top, bottom, left, right }}
        />
      ))}

      {/* Hint */}
      <p style={{
        position: 'absolute', bottom: 4, left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 10, fontFamily: 'monospace',
        color: 'rgba(255,255,255,0.18)',
        whiteSpace: 'nowrap', pointerEvents: 'none',
        zIndex: 25, userSelect: 'none',
      }}>
        hover to interact
      </p>
    </div>
  )
}
