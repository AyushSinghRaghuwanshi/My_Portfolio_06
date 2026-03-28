/**
 * AvatarHero.jsx
 * Wrapper that sizes and positions the full R3F AvatarScene
 * inside the Hero section. No longer uses plain CSS tilt —
 * everything is driven by the Three.js canvas in AvatarScene.
 */

import { Suspense } from 'react'
import AvatarScene  from './three/AvatarScene'

export default function AvatarHero() {
  return (
    /* Click hint shown once per session */
    <div className="relative" style={{ width: 520, height: 520 }}>
      {/* Ambient background glow behind the canvas */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(145,94,255,0.18) 0%, rgba(0,217,255,0.06) 55%, transparent 75%)',
          borderRadius: '50%',
        }}
        aria-hidden
      />

      {/* R3F canvas */}
      <Suspense fallback={null}>
        <AvatarScene />
      </Suspense>

      {/* Click hint */}
      <p
        className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white/20 select-none pointer-events-none whitespace-nowrap"
        aria-hidden
      >
        click to interact · hover to activate
      </p>
    </div>
  )
}
