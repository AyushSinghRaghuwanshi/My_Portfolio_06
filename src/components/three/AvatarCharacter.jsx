/**
 * AvatarCharacter.jsx — proper cartoon human figure
 *
 * Full body: head · neck · torso · two arms · two legs · feet
 * Animations:
 *   · Float     — gentle up/down bob
 *   · Breathe   — subtle torso pulse
 *   · Head look — head + eyes follow mouse
 *   · Blink     — periodic eyelid close
 *   · Wave      — auto on mount + on click:
 *                 arm rises to side, elbow bends, hand oscillates
 *   · Idle sway — small arms & body sway when not waving
 */

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Torus } from '@react-three/drei'
import * as THREE from 'three'

const L = THREE.MathUtils.lerp

const C = {
  skin:   '#f5c9a0',
  skinD:  '#e0a070',
  hair:   '#2e1f12',
  glass:  '#1a0f06',
  hoodie: '#d96a12',
  hoodieD:'#b05510',
  jeans:  '#1e2f52',
  shoe:   '#1a0f08',
  white:  '#ffffff',
  iris:   '#6a3c18',
  pupil:  '#0a0400',
  smile:  '#b85028',
  blush:  '#f08070',
}

const M = ({ color, rough = 0.75, metal = 0, opacity, transparent }) => (
  <meshStandardMaterial
    color={color} roughness={rough} metalness={metal}
    opacity={opacity ?? 1} transparent={transparent ?? false}
  />
)

/* ── Hair ───────────────────────────────────────────────────── */
function Hair() {
  return (
    <group>
      <Sphere args={[0.345, 24, 16]} position={[0, 0.07, -0.02]}><M color={C.hair} rough={0.95}/></Sphere>
      <Sphere args={[0.30,  18, 14]} position={[0, 0.02, -0.18]} scale={[1.1, 1, 0.65]}><M color={C.hair} rough={0.95}/></Sphere>
      {[
        { p:[0,    0.44, 0.04], r:[0,   0,  0   ], h:0.26 },
        { p:[0.18, 0.42, 0.06], r:[0.0, 0,  0.30], h:0.22 },
        { p:[-0.18,0.42, 0.06], r:[0.0, 0, -0.30], h:0.22 },
        { p:[0.30, 0.36, 0.02], r:[0.0, 0,  0.58], h:0.18 },
        { p:[-0.30,0.36, 0.02], r:[0.0, 0, -0.58], h:0.18 },
        { p:[0,    0.40,-0.10], r:[-0.35,0, 0   ], h:0.16 },
      ].map(({ p, r, h }, i) => (
        <mesh key={i} position={p} rotation={r}>
          <capsuleGeometry args={[0.058, h, 4, 8]} />
          <M color={C.hair} rough={0.9}/>
        </mesh>
      ))}
    </group>
  )
}

/* ── Glasses ────────────────────────────────────────────────── */
function Glasses() {
  const gm = <M color={C.glass} metal={0.7} rough={0.2}/>
  return (
    <group>
      <Torus args={[0.095, 0.013, 8, 28]} position={[-0.155, 0.02, 0.305]}>{gm}</Torus>
      <Torus args={[0.095, 0.013, 8, 28]} position={[ 0.155, 0.02, 0.305]}>{gm}</Torus>
      <mesh position={[0, 0.02, 0.306]}><boxGeometry args={[0.10, 0.011, 0.011]}/>{gm}</mesh>
      <mesh position={[-0.31, 0.02, 0.265]} rotation={[0,-0.28, 0]}><boxGeometry args={[0.18, 0.010, 0.010]}/>{gm}</mesh>
      <mesh position={[ 0.31, 0.02, 0.265]} rotation={[0, 0.28, 0]}><boxGeometry args={[0.18, 0.010, 0.010]}/>{gm}</mesh>
    </group>
  )
}

/* ── Arm (shoulder-pivot → upper arm → elbow-pivot → forearm+hand) ── */
function Arm({ side, upperRef, lowerRef }) {
  const sx   = side === 'R' ? 0.39 : -0.39
  const idle = side === 'R' ? 0.18 : -0.18   // idle outward rotation
  return (
    <group position={[sx, 0.52, 0]}>
      {/* Shoulder joint */}
      <group ref={upperRef} rotation={[0, 0, idle]}>
        {/* Upper arm */}
        <mesh position={[0, -0.20, 0]}>
          <capsuleGeometry args={[0.085, 0.26, 6, 10]}/>
          <M color={C.hoodie} rough={0.85}/>
        </mesh>
        {/* Elbow joint */}
        <group position={[0, -0.38, 0]}>
          <group ref={lowerRef} rotation={[0, 0, side === 'R' ? 0.12 : -0.12]}>
            {/* Forearm */}
            <mesh position={[0, -0.18, 0]}>
              <capsuleGeometry args={[0.073, 0.23, 6, 10]}/>
              <M color={C.skin} rough={0.7}/>
            </mesh>
            {/* Hand */}
            <Sphere args={[0.082, 12, 10]} position={[0, -0.33, 0]}>
              <M color={C.skin} rough={0.7}/>
            </Sphere>
          </group>
        </group>
      </group>
    </group>
  )
}

/* ── Leg (hip-pivot → upper leg → knee-pivot → shin + foot) ── */
function Leg({ side }) {
  const sx      = side === 'R' ?  0.15 : -0.15
  const footOut = side === 'R' ?  0.12 : -0.12
  return (
    <group position={[sx, 0.00, 0]}>
      {/* Upper leg / thigh */}
      <mesh position={[0, -0.20, 0]}>
        <capsuleGeometry args={[0.10, 0.26, 6, 12]}/>
        <M color={C.jeans} rough={0.85}/>
      </mesh>
      {/* Knee */}
      <group position={[0, -0.38, 0]}>
        {/* Shin */}
        <mesh position={[0, -0.20, 0]}>
          <capsuleGeometry args={[0.087, 0.25, 6, 12]}/>
          <M color={C.jeans} rough={0.85}/>
        </mesh>
        {/* Foot/shoe */}
        <Sphere args={[0.10, 14, 10]} position={[footOut, -0.38, 0.06]} scale={[1.1, 0.55, 1.35]}>
          <M color={C.shoe} rough={0.7}/>
        </Sphere>
      </group>
    </group>
  )
}

/* ── Main character ─────────────────────────────────────────── */
export default function AvatarCharacter({ mousePos }) {
  const rootRef    = useRef()
  const bodyRef    = useRef()
  const headRef    = useRef()
  const lLidRef    = useRef()
  const rLidRef    = useRef()
  const lPupilRef  = useRef()
  const rPupilRef  = useRef()
  const rUpperRef  = useRef()
  const rLowerRef  = useRef()
  const lUpperRef  = useRef()

  const blink = useRef({ active: false, t0: 0, next: 2.4 })
  const wave  = useRef({ active: false, t0: 0, booted: false })

  const triggerWave = (t) => { wave.current.active = true; wave.current.t0 = t }

  useFrame(({ clock }) => {
    const t  = clock.getElapsedTime()
    const mx = (mousePos?.current?.x ?? 0.5) - 0.5
    const my = (mousePos?.current?.y ?? 0.5) - 0.5

    /* 1. Float */
    if (rootRef.current) rootRef.current.position.y = Math.sin(t * 0.7) * 0.07

    /* 2. Breathe */
    if (bodyRef.current) {
      const s = 1 + Math.sin(t * 1.2) * 0.010
      bodyRef.current.scale.setScalar(s)
    }

    /* 3. Head tracking */
    if (headRef.current) {
      headRef.current.rotation.y = L(headRef.current.rotation.y, mx * 0.45,  0.04)
      headRef.current.rotation.x = L(headRef.current.rotation.x, my * -0.25, 0.04)
    }

    /* 4. Pupil tracking */
    const px = mx * 0.028, py = -my * 0.020
    if (lPupilRef.current) { lPupilRef.current.position.x = L(lPupilRef.current.position.x, px, 0.07); lPupilRef.current.position.y = L(lPupilRef.current.position.y, py, 0.07) }
    if (rPupilRef.current) { rPupilRef.current.position.x = L(rPupilRef.current.position.x, px, 0.07); rPupilRef.current.position.y = L(rPupilRef.current.position.y, py, 0.07) }

    /* 5. Blink */
    if (!blink.current.active && t > blink.current.next) {
      blink.current.active = true; blink.current.t0 = t
      blink.current.next   = t + 2 + Math.random() * 3.5
    }
    if (blink.current.active) {
      const p  = (t - blink.current.t0) / 0.12
      const sy = Math.max(0.04, p < 0.5 ? 1 - p * 2 : (p - 0.5) * 2)
      const rx = (1 - sy) * (Math.PI / 2)
      if (lLidRef.current) lLidRef.current.rotation.x = rx
      if (rLidRef.current) rLidRef.current.rotation.x = rx
      if (p >= 1) {
        blink.current.active = false
        if (lLidRef.current) lLidRef.current.rotation.x = Math.PI / 2
        if (rLidRef.current) rLidRef.current.rotation.x = Math.PI / 2
      }
    }

    /* 6. Auto-wave once after 1s */
    if (!wave.current.booted && t > 1.0) { wave.current.booted = true; triggerWave(t) }

    /* 7. Wave animation
         Phase 1 (0-0.5s): raise upper arm outward → rotation.z from 0.18 to 1.30
         Phase 2 (0.4-4s):  bend forearm upward → rotation.z from 0.12 to -1.35,
                            then oscillate ±0.42 at 6 Hz
         Phase 3 (4s+):     lower arm back to idle
    */
    if (wave.current.active) {
      const wt = t - wave.current.t0

      if (wt < 4.5) {
        const raise = Math.min(1, wt / 0.45)          // 0→1 over 0.45 s

        // Raise upper arm out to the side (z: idle 0.18 → wave 1.28)
        if (rUpperRef.current) {
          rUpperRef.current.rotation.z = L(rUpperRef.current.rotation.z, 1.28 * raise + 0.18 * (1 - raise), 0.10)
          rUpperRef.current.rotation.x = L(rUpperRef.current.rotation.x, -0.08 * raise, 0.08)
        }

        // Bend elbow + wave hand (starts once arm is ~50% raised)
        if (rLowerRef.current && wt > 0.22) {
          const waveOsc = Math.sin(wt * 6.2) * 0.44 * raise
          rLowerRef.current.rotation.z = L(rLowerRef.current.rotation.z, -1.35 * raise + 0.12 * (1 - raise) + waveOsc, 0.12)
        }

      } else {
        // Lower back to idle
        if (rUpperRef.current) {
          rUpperRef.current.rotation.z = L(rUpperRef.current.rotation.z, 0.18, 0.05)
          rUpperRef.current.rotation.x = L(rUpperRef.current.rotation.x, 0,    0.05)
        }
        if (rLowerRef.current) rLowerRef.current.rotation.z = L(rLowerRef.current.rotation.z, 0.12, 0.05)
        if (wt > 6.5) wave.current.active = false
      }

    } else {
      /* Idle sway */
      if (rUpperRef.current) rUpperRef.current.rotation.z = L(rUpperRef.current.rotation.z, 0.18 + Math.sin(t * 0.5) * 0.022, 0.03)
      if (lUpperRef.current) lUpperRef.current.rotation.z = L(lUpperRef.current.rotation.z,-0.18 - Math.sin(t * 0.5 + 1.1) * 0.022, 0.03)
    }
  })

  const eye = (side) => {
    const x = side === 'L' ? -0.155 : 0.155
    const lidRef  = side === 'L' ? lLidRef  : rLidRef
    const pupRef  = side === 'L' ? lPupilRef : rPupilRef
    return (
      <group position={[x, 0.02, 0.295]}>
        {/* White */}
        <Sphere args={[0.090, 20, 16]}><M color={C.white} rough={0.15}/></Sphere>
        {/* Iris */}
        <Sphere args={[0.057, 14, 12]} position={[0, 0, 0.048]}><M color={C.iris}/></Sphere>
        {/* Pupil */}
        <Sphere ref={pupRef} args={[0.034, 10, 10]} position={[0, 0, 0.080]}><M color={C.pupil}/></Sphere>
        {/* Shine */}
        <Sphere args={[0.015, 6, 6]} position={[0.022, 0.026, 0.097]}>
          <meshStandardMaterial color={C.white} emissive={C.white} emissiveIntensity={0.9}/>
        </Sphere>
        {/* Eyelid — starts open (rotation.x = PI/2) */}
        <group ref={lidRef} rotation={[Math.PI / 2, 0, 0]}>
          <mesh><sphereGeometry args={[0.096, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]}/><M color={C.skin} rough={0.8}/></mesh>
        </group>
      </group>
    )
  }

  return (
    <group
      ref={rootRef}
      position={[0, -0.35, 0]}
      onClick={(e) => { e.stopPropagation(); triggerWave(clock_t()) }}
    >
      {/* ═══ HEAD ═══════════════════════════════════════════ */}
      <group ref={headRef} position={[0, 1.48, 0]}>
        {/* Face */}
        <Sphere args={[0.33, 32, 24]}><M color={C.skin} rough={0.75}/></Sphere>
        {/* Ears */}
        <Sphere args={[0.085, 12, 10]} position={[-0.325, 0, 0]} scale={[0.60, 1.0, 0.55]}><M color={C.skin}/></Sphere>
        <Sphere args={[0.085, 12, 10]} position={[ 0.325, 0, 0]} scale={[0.60, 1.0, 0.55]}><M color={C.skin}/></Sphere>
        {/* Cheek blush */}
        <Sphere args={[0.09, 8, 8]} position={[-0.22, -0.06, 0.26]} scale={[1, 0.5, 0.4]}>
          <M color={C.blush} rough={1} opacity={0.30} transparent/>
        </Sphere>
        <Sphere args={[0.09, 8, 8]} position={[ 0.22, -0.06, 0.26]} scale={[1, 0.5, 0.4]}>
          <M color={C.blush} rough={1} opacity={0.30} transparent/>
        </Sphere>

        <Hair/>

        {/* Eyebrows */}
        {[-1, 1].map(s => (
          <mesh key={s} position={[s * 0.155, 0.165, 0.295]} rotation={[0.05, 0, -s * 0.14]}>
            <capsuleGeometry args={[0.012, 0.105, 4, 8]}/>
            <M color={C.hair} rough={0.9}/>
          </mesh>
        ))}

        {/* Eyes */}
        {eye('L')}{eye('R')}

        <Glasses/>

        {/* Nose */}
        <Sphere args={[0.034, 8, 8]} position={[0, -0.065, 0.32]} scale={[1, 0.80, 0.62]}><M color={C.skinD}/></Sphere>

        {/* Smile */}
        <mesh position={[0, -0.155, 0.300]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.094, 0.016, 6, 22, Math.PI * 0.85]}/>
          <M color={C.smile} rough={0.8}/>
        </mesh>
      </group>

      {/* ═══ NECK ════════════════════════════════════════════ */}
      <mesh position={[0, 1.05, 0]}>
        <capsuleGeometry args={[0.088, 0.18, 6, 10]}/>
        <M color={C.skin} rough={0.7}/>
      </mesh>

      {/* ═══ TORSO ═══════════════════════════════════════════ */}
      <group ref={bodyRef}>
        {/* Hoodie body */}
        <mesh position={[0, 0.60, 0]}>
          <capsuleGeometry args={[0.28, 0.58, 8, 14]}/>
          <M color={C.hoodie} rough={0.85}/>
        </mesh>
        {/* Collar */}
        <mesh position={[0, 0.94, 0.22]}>
          <capsuleGeometry args={[0.10, 0.03, 4, 8]}/>
          <M color="#1a1a1a" rough={0.9}/>
        </mesh>
        {/* Zipper */}
        <mesh position={[0, 0.62, 0.27]}>
          <boxGeometry args={[0.013, 0.52, 0.008]}/>
          <M color={C.hoodieD} rough={0.9}/>
        </mesh>
        {/* Pocket */}
        <mesh position={[0, 0.43, 0.27]}>
          <boxGeometry args={[0.22, 0.11, 0.010]}/>
          <M color={C.hoodieD} rough={0.85}/>
        </mesh>
        {/* Hip/waist join */}
        <mesh position={[0, 0.26, 0]}>
          <capsuleGeometry args={[0.24, 0.06, 6, 12]}/>
          <M color={C.jeans} rough={0.85}/>
        </mesh>
      </group>

      {/* ═══ ARMS ════════════════════════════════════════════ */}
      <Arm side="R" upperRef={rUpperRef} lowerRef={rLowerRef}/>
      <Arm side="L" upperRef={lUpperRef} lowerRef={null}/>

      {/* ═══ LEGS ════════════════════════════════════════════ */}
      <Leg side="R"/>
      <Leg side="L"/>

    </group>
  )
}

// tiny helper so onClick can pass a real timestamp
let _t = 0
function clock_t() { return _t }
// This is updated inside AvatarScene via the exported ref
export function updateClockT(t) { _t = t }
