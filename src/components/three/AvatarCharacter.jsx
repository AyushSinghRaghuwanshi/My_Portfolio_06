/**
 * AvatarCharacter.jsx
 * Fully animated 3D cartoon character built from Three.js primitives.
 *
 * Animations:
 *  - Floating  : whole body bobs up/down continuously
 *  - Breathing : subtle chest scale pulse
 *  - Head track: head rotates to follow the mouse cursor
 *  - Eye track : pupils shift toward the cursor inside the eye
 *  - Blink     : eyelids close/open periodically (every 2-4 s)
 *  - Wave      : right arm raises + forearm waves; triggers on mount
 *                after 1 s and on every click
 *  - Idle sway : arms gently sway when not waving
 *
 * Style: cartoon — spiky brown hair, glasses, orange hoodie, light skin.
 */

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Torus, Capsule } from '@react-three/drei'
import * as THREE from 'three'

const L = THREE.MathUtils.lerp   // shorthand

// ─── Palette ──────────────────────────────────────────────────
const C = {
  skin:    '#f5c9a0',
  skinD:   '#e0a070',
  hair:    '#2e1f12',
  glass:   '#1a0f06',
  orange:  '#E07820',
  orangeD: '#bf5e10',
  dark:    '#111111',
  white:   '#ffffff',
  iris:    '#7a4520',
  pupil:   '#0a0400',
  smile:   '#c06035',
}

// Tiny helper: standard material shorthand
const Std = ({ color, rough = 0.75, metal = 0, emissive, emissiveIntensity }) => (
  <meshStandardMaterial
    color={color}
    roughness={rough}
    metalness={metal}
    emissive={emissive}
    emissiveIntensity={emissiveIntensity}
  />
)

/* ══════════════════════════════════════════════════════════════
   HAIR  — base cap + 7 spiky protrusions
   ══════════════════════════════════════════════════════════════ */
function Hair() {
  const spikes = [
    { p: [0,     0.56,  0.02], r: [0,     0,     0    ], h: 0.30 },
    { p: [0.22,  0.52,  0.05], r: [0.05,  0,     0.38 ], h: 0.24 },
    { p: [-0.22, 0.52,  0.05], r: [0.05,  0,    -0.38 ], h: 0.24 },
    { p: [0.10,  0.54, -0.05], r: [-0.12, 0,     0.18 ], h: 0.22 },
    { p: [-0.10, 0.54, -0.05], r: [-0.12, 0,    -0.18 ], h: 0.22 },
    { p: [0.32,  0.46,  0.02], r: [0.04,  0,     0.65 ], h: 0.20 },
    { p: [-0.32, 0.46,  0.02], r: [0.04,  0,    -0.65 ], h: 0.20 },
  ]
  return (
    <group>
      {/* Cap */}
      <Sphere args={[0.52, 28, 16]} position={[0, 0.1, -0.02]}>
        <Std color={C.hair} rough={0.95} />
      </Sphere>
      {/* Back volume */}
      <Sphere args={[0.46, 20, 14]} position={[0, 0, -0.22]} scale={[1, 1.05, 0.7]}>
        <Std color={C.hair} rough={0.95} />
      </Sphere>
      {spikes.map(({ p, r, h }, i) => (
        <mesh key={i} position={p} rotation={r}>
          <capsuleGeometry args={[0.065, h, 4, 8]} />
          <Std color={C.hair} rough={0.9} />
        </mesh>
      ))}
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   EYE  — white + iris + pupil (tracked) + lid (blinks)
   ══════════════════════════════════════════════════════════════ */
function Eye({ side, lidRef, pupilRef }) {
  const x = side === 'L' ? -0.185 : 0.185
  return (
    <group position={[x, 0.05, 0.44]}>
      {/* White sclera */}
      <Sphere args={[0.098, 22, 18]}>
        <Std color={C.white} rough={0.15} />
      </Sphere>
      {/* Iris */}
      <Sphere args={[0.062, 16, 14]} position={[0, 0, 0.05]}>
        <Std color={C.iris} />
      </Sphere>
      {/* Pupil — moves with cursor */}
      <Sphere ref={pupilRef} args={[0.036, 10, 10]} position={[0, 0, 0.088]}>
        <Std color={C.pupil} />
      </Sphere>
      {/* Specular highlight */}
      <Sphere args={[0.017, 6, 6]} position={[0.026, 0.032, 0.104]}>
        <meshStandardMaterial color={C.white} emissive={C.white} emissiveIntensity={1} />
      </Sphere>
      {/* Eyelid group — scaleY closes on blink */}
      <group ref={lidRef}>
        {/* Upper lid (skin-coloured half-dome that covers eye from top) */}
        <mesh position={[0, 0.052, 0.01]}>
          <sphereGeometry args={[0.105, 22, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <Std color={C.skin} rough={0.8} />
        </mesh>
      </group>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   GLASSES  — two lens rings + bridge + temples
   ══════════════════════════════════════════════════════════════ */
function Glasses() {
  return (
    <group>
      {/* Left lens */}
      <Torus args={[0.112, 0.015, 8, 32]} position={[-0.185, 0.05, 0.462]}>
        <Std color={C.glass} metal={0.7} rough={0.2} />
      </Torus>
      {/* Right lens */}
      <Torus args={[0.112, 0.015, 8, 32]} position={[0.185, 0.05, 0.462]}>
        <Std color={C.glass} metal={0.7} rough={0.2} />
      </Torus>
      {/* Bridge */}
      <mesh position={[0, 0.05, 0.462]}>
        <boxGeometry args={[0.125, 0.014, 0.014]} />
        <Std color={C.glass} metal={0.7} rough={0.2} />
      </mesh>
      {/* Left temple */}
      <mesh position={[-0.37, 0.05, 0.37]} rotation={[0, -0.32, 0]}>
        <boxGeometry args={[0.23, 0.012, 0.012]} />
        <Std color={C.glass} metal={0.7} rough={0.2} />
      </mesh>
      {/* Right temple */}
      <mesh position={[0.37, 0.05, 0.37]} rotation={[0, 0.32, 0]}>
        <boxGeometry args={[0.23, 0.012, 0.012]} />
        <Std color={C.glass} metal={0.7} rough={0.2} />
      </mesh>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ARM  — shoulder pivot → upper arm → elbow pivot → lower arm + hand
   ══════════════════════════════════════════════════════════════ */
function Arm({ side, upperRef, lowerRef }) {
  const sx   = side === 'R' ? 0.52 : -0.52
  const flip = side === 'R' ? -1 : 1
  return (
    <group position={[sx, 0.06, 0]}>
      {/* Shoulder joint — upperRef rotates here */}
      <group ref={upperRef} rotation={[0, 0, flip * 0.44]}>
        {/* Upper arm */}
        <mesh position={[0, -0.22, 0]}>
          <capsuleGeometry args={[0.095, 0.30, 6, 12]} />
          <Std color={C.orange} rough={0.85} />
        </mesh>
        {/* Elbow pivot → lowerRef (only used for right arm wave) */}
        <group position={[0, -0.40, 0]}>
          <group ref={lowerRef} rotation={[0, 0, flip * -0.30]}>
            {/* Forearm */}
            <mesh position={[0, -0.19, 0]}>
              <capsuleGeometry args={[0.082, 0.26, 6, 12]} />
              <Std color={C.skin} rough={0.7} />
            </mesh>
            {/* Hand */}
            <Sphere args={[0.095, 14, 12]} position={[0, -0.34, 0]}>
              <Std color={C.skin} rough={0.7} />
            </Sphere>
          </group>
        </group>
      </group>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   MAIN CHARACTER
   ══════════════════════════════════════════════════════════════ */
export default function AvatarCharacter({ mousePos }) {
  // Root / body refs
  const rootRef   = useRef()
  const bodyRef   = useRef()
  const headRef   = useRef()

  // Eye refs
  const lLidRef   = useRef()
  const rLidRef   = useRef()
  const lPupilRef = useRef()
  const rPupilRef = useRef()

  // Arm refs
  const rUpperRef = useRef()
  const rLowerRef = useRef()
  const lUpperRef = useRef()
  const lLowerRef = useRef()

  // Animation state
  const blink = useRef({ active: false, t0: 0, next: 2.2 })
  const wave  = useRef({ active: false, t0: 0, booted: false })

  // Expose click handler via group ref so the Canvas onClick can reach it
  const triggerWave = (t) => {
    wave.current.active = true
    wave.current.t0 = t
  }

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mx = (mousePos?.current?.x ?? 0.5) - 0.5   // –0.5 → +0.5
    const my = (mousePos?.current?.y ?? 0.5) - 0.5

    /* ── 1. Float ── */
    if (rootRef.current) {
      rootRef.current.position.y = Math.sin(t * 0.72) * 0.09
    }

    /* ── 2. Breathe ── */
    if (bodyRef.current) {
      const s = 1 + Math.sin(t * 1.3) * 0.012
      bodyRef.current.scale.setScalar(s)
    }

    /* ── 3. Head tracks mouse ── */
    if (headRef.current) {
      headRef.current.rotation.y = L(headRef.current.rotation.y, mx * 0.5,  0.045)
      headRef.current.rotation.x = L(headRef.current.rotation.x, my * -0.28, 0.045)
    }

    /* ── 4. Pupils track mouse ── */
    const px = mx * 0.032
    const py = -my * 0.024
    if (lPupilRef.current) {
      lPupilRef.current.position.x = L(lPupilRef.current.position.x, px, 0.07)
      lPupilRef.current.position.y = L(lPupilRef.current.position.y, py, 0.07)
    }
    if (rPupilRef.current) {
      rPupilRef.current.position.x = L(rPupilRef.current.position.x, px, 0.07)
      rPupilRef.current.position.y = L(rPupilRef.current.position.y, py, 0.07)
    }

    /* ── 5. Blink ── */
    if (!blink.current.active && t > blink.current.next) {
      blink.current.active = true
      blink.current.t0     = t
      blink.current.next   = t + 1.8 + Math.random() * 3.2
    }
    if (blink.current.active) {
      const progress = (t - blink.current.t0) / 0.13   // 130 ms total
      const raw = progress < 0.5 ? 1 - progress * 2 : (progress - 0.5) * 2
      const sy  = Math.max(0.04, Math.min(1, raw))
      // Lower the lid by rotating it (rx: 0=closed, -PI/2=open)
      const rx  = (1 - sy) * (Math.PI / 2)  // 0 → half-pi as lid opens
      if (lLidRef.current) lLidRef.current.rotation.x = rx
      if (rLidRef.current) rLidRef.current.rotation.x = rx
      if (progress >= 1) {
        blink.current.active = false
        if (lLidRef.current) lLidRef.current.rotation.x = Math.PI / 2
        if (rLidRef.current) rLidRef.current.rotation.x = Math.PI / 2
      }
    }

    /* ── 6. Auto-wave 1.2 s after mount ── */
    if (!wave.current.booted && t > 1.2) {
      wave.current.booted = true
      triggerWave(t)
    }

    /* ── 7. Wave animation ── */
    if (wave.current.active) {
      const wt      = t - wave.current.t0
      const raising = Math.min(1, wt * 3.5)           // 0→1 in ~0.3 s

      if (wt < 3.8) {
        // Raise arm toward vertical
        if (rUpperRef.current) {
          rUpperRef.current.rotation.z = L(rUpperRef.current.rotation.z, -2.25 * raising, 0.12)
          rUpperRef.current.rotation.x = L(rUpperRef.current.rotation.x,  0.15 * raising, 0.08)
        }
        // Wave forearm once arm is raised
        if (rLowerRef.current && wt > 0.35) {
          rLowerRef.current.rotation.z = Math.sin(wt * 7.5) * 0.55 * raising
          rLowerRef.current.rotation.x = Math.sin(wt * 7.5 + 1) * 0.15 * raising
        }
      } else {
        // Lower arm back to idle
        if (rUpperRef.current) {
          rUpperRef.current.rotation.z = L(rUpperRef.current.rotation.z, -0.44, 0.055)
          rUpperRef.current.rotation.x = L(rUpperRef.current.rotation.x,  0,    0.055)
        }
        if (rLowerRef.current) {
          rLowerRef.current.rotation.z = L(rLowerRef.current.rotation.z, -0.30, 0.055)
          rLowerRef.current.rotation.x = L(rLowerRef.current.rotation.x,  0,    0.055)
        }
        if (wt > 5.5) wave.current.active = false
      }
    } else {
      /* Idle arm sway */
      if (rUpperRef.current) {
        rUpperRef.current.rotation.z = L(rUpperRef.current.rotation.z, -0.44 + Math.sin(t * 0.55) * 0.025, 0.03)
      }
      if (lUpperRef.current) {
        lUpperRef.current.rotation.z = L(lUpperRef.current.rotation.z,  0.44 + Math.sin(t * 0.55 + 1.2) * 0.025, 0.03)
      }
    }
  })

  return (
    <group
      ref={rootRef}
      position={[0, -0.2, 0]}
      onClick={(e) => { e.stopPropagation(); triggerWave(e.timeStamp / 1000) }}
    >
      {/* ══ HEAD GROUP ══════════════════════════════════════ */}
      <group ref={headRef} position={[0, 0.88, 0]}>

        {/* Head sphere */}
        <Sphere args={[0.50, 36, 28]}>
          <Std color={C.skin} rough={0.75} />
        </Sphere>

        <Hair />

        {/* Ears */}
        <Sphere args={[0.105, 14, 12]} position={[-0.50, 0.02, 0]} scale={[0.68, 1, 0.58]}>
          <Std color={C.skin} />
        </Sphere>
        <Sphere args={[0.105, 14, 12]} position={[ 0.50, 0.02, 0]} scale={[0.68, 1, 0.58]}>
          <Std color={C.skin} />
        </Sphere>

        {/* Eyebrows */}
        <mesh position={[-0.185, 0.215, 0.455]} rotation={[0.05, 0, 0.18]}>
          <capsuleGeometry args={[0.015, 0.13, 4, 8]} />
          <Std color={C.hair} rough={0.9} />
        </mesh>
        <mesh position={[ 0.185, 0.215, 0.455]} rotation={[0.05, 0, -0.18]}>
          <capsuleGeometry args={[0.015, 0.13, 4, 8]} />
          <Std color={C.hair} rough={0.9} />
        </mesh>

        {/* Eyes — lids start open (rotation.x = PI/2) */}
        <group>
          {/* Left */}
          <group position={[-0.185, 0.05, 0.44]}>
            <Sphere args={[0.098, 22, 18]}><Std color={C.white} rough={0.15} /></Sphere>
            <Sphere args={[0.062, 16, 14]} position={[0, 0, 0.05]}><Std color={C.iris} /></Sphere>
            <Sphere ref={lPupilRef} args={[0.036, 10, 10]} position={[0, 0, 0.086]}>
              <Std color={C.pupil} />
            </Sphere>
            <Sphere args={[0.016, 6, 6]} position={[0.026, 0.032, 0.102]}>
              <meshStandardMaterial color={C.white} emissive={C.white} emissiveIntensity={0.9} />
            </Sphere>
            {/* Lid — starts open (rx = PI/2 = rotated up/away) */}
            <group ref={lLidRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
              <mesh>
                <sphereGeometry args={[0.106, 22, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <Std color={C.skin} rough={0.8} />
              </mesh>
            </group>
          </group>

          {/* Right */}
          <group position={[0.185, 0.05, 0.44]}>
            <Sphere args={[0.098, 22, 18]}><Std color={C.white} rough={0.15} /></Sphere>
            <Sphere args={[0.062, 16, 14]} position={[0, 0, 0.05]}><Std color={C.iris} /></Sphere>
            <Sphere ref={rPupilRef} args={[0.036, 10, 10]} position={[0, 0, 0.086]}>
              <Std color={C.pupil} />
            </Sphere>
            <Sphere args={[0.016, 6, 6]} position={[0.026, 0.032, 0.102]}>
              <meshStandardMaterial color={C.white} emissive={C.white} emissiveIntensity={0.9} />
            </Sphere>
            <group ref={rLidRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
              <mesh>
                <sphereGeometry args={[0.106, 22, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <Std color={C.skin} rough={0.8} />
              </mesh>
            </group>
          </group>
        </group>

        <Glasses />

        {/* Nose */}
        <Sphere args={[0.042, 10, 10]} position={[0, -0.07, 0.49]} scale={[1, 0.82, 0.68]}>
          <Std color={C.skinD} />
        </Sphere>

        {/* Smile — arc of torus */}
        <mesh position={[0, -0.185, 0.465]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.105, 0.017, 6, 20, Math.PI * 0.78]} />
          <Std color={C.smile} rough={0.8} />
        </mesh>
      </group>

      {/* ══ NECK ════════════════════════════════════════════ */}
      <mesh position={[0, 0.28, 0]}>
        <capsuleGeometry args={[0.10, 0.22, 6, 12]} />
        <Std color={C.skin} rough={0.7} />
      </mesh>

      {/* ══ TORSO ═══════════════════════════════════════════ */}
      <group ref={bodyRef}>
        {/* Main hoodie body */}
        <mesh position={[0, -0.10, 0]}>
          <capsuleGeometry args={[0.41, 0.55, 8, 16]} />
          <Std color={C.orange} rough={0.85} />
        </mesh>
        {/* Zipper line */}
        <mesh position={[0, -0.10, 0.40]}>
          <boxGeometry args={[0.016, 0.58, 0.01]} />
          <Std color={C.orangeD} rough={0.9} />
        </mesh>
        {/* Collar dark inner */}
        <mesh position={[0, 0.24, 0.31]}>
          <capsuleGeometry args={[0.12, 0.04, 4, 8]} />
          <Std color={C.dark} rough={0.9} />
        </mesh>
        {/* Hoodie front pocket */}
        <mesh position={[0, -0.28, 0.39]}>
          <boxGeometry args={[0.30, 0.14, 0.012]} />
          <Std color={C.orangeD} rough={0.85} />
        </mesh>
      </group>

      {/* ══ ARMS ════════════════════════════════════════════ */}
      <Arm side="R" upperRef={rUpperRef} lowerRef={rLowerRef} />
      <Arm side="L" upperRef={lUpperRef} lowerRef={lLowerRef} />

    </group>
  )
}
