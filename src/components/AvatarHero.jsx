/**
 * AvatarHero.jsx — canvas wrapper + CSS tech badges
 * The 3D animated character lives entirely inside AvatarScene.
 */

import { useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import AvatarScene from './three/AvatarScene'

const BADGES = [
  { label: 'PyTorch',      top: '4%',    left: '2%',   color: 'purple', delay: 0.5  },
  { label: 'LLMs',         top: '4%',    right: '2%',  color: 'cyan',   delay: 0.65 },
  { label: 'RAG',          top: '32%',   right: '0%',  color: 'purple', delay: 0.8  },
  { label: 'Azure AI',     top: '32%',   left: '0%',   color: 'cyan',   delay: 0.95 },
  { label: 'Transformers', bottom: '16%',left: '1%',   color: 'purple', delay: 1.1  },
  { label: 'MLOps',        bottom: '16%',right: '1%',  color: 'cyan',   delay: 1.25 },
  { label: 'NLP',          bottom: '3%', left: '20%',  color: 'cyan',   delay: 1.4  },
  { label: 'Python',       bottom: '3%', right: '20%', color: 'purple', delay: 1.55 },
]

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
      style={{ position: 'relative', width: 500, height: 520, flexShrink: 0 }}
    >
      {/* Three.js canvas — character + effects */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <AvatarScene mousePos={mousePos} />
      </div>

      {/* CSS tech badges */}
      {BADGES.map(({ label, color, delay, ...pos }) => {
        const purple = color === 'purple'
        return (
          <motion.span
            key={label}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', zIndex: 10, ...pos,
              padding: '3px 11px', borderRadius: 999,
              fontSize: 11, fontWeight: 600, fontFamily: 'monospace',
              whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none',
              background:     purple ? 'rgba(145,94,255,0.16)' : 'rgba(0,217,255,0.13)',
              border:         purple ? '1px solid rgba(145,94,255,0.45)' : '1px solid rgba(0,217,255,0.40)',
              color:          purple ? '#c4b5fd' : '#67e8f9',
              boxShadow:      purple ? '0 0 10px rgba(145,94,255,0.3)' : '0 0 10px rgba(0,217,255,0.25)',
              backdropFilter: 'blur(6px)',
            }}
          >
            {label}
          </motion.span>
        )
      })}

      {/* Click hint */}
      <p style={{
        position: 'absolute', bottom: 4, left: '50%',
        transform: 'translateX(-50%)', zIndex: 10,
        fontSize: 10, fontFamily: 'monospace',
        color: 'rgba(255,255,255,0.2)', whiteSpace: 'nowrap',
        pointerEvents: 'none', userSelect: 'none',
      }}>
        click avatar to wave · hover to look around
      </p>
    </div>
  )
}
