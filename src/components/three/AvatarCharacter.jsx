/**
 * AvatarCharacter.jsx — Stylized 3D avatar (standing, holding tablet)
 *
 * Look: deep-green crewneck · dark navy pants · white sneakers with gum sole
 *       dark messy hair · warm South-Asian skin · expressive brown eyes
 *
 * Animations
 *   · Float / breathe (idle)
 *   · Head + pupil track mouse
 *   · Blink (periodic, random interval)
 *   · Wave on click + auto-wave on mount
 *   · Tablet screen glow pulse
 *   · Idle arm sway
 */
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

const L = THREE.MathUtils.lerp

/* ── Palette ────────────────────────────────────────────────── */
const C = {
  skin:     '#d4956a',
  skinD:    '#b87040',
  skinL:    '#e8b090',
  hair:     '#261508',
  sweater:  '#2d6a4f',
  sweaterD: '#1f4a37',
  collar:   '#1a3d2b',
  pants:    '#1c2240',
  pantsD:   '#12172e',
  shoe:     '#f0eeea',
  shoeGum:  '#c4a06a',
  shoeAcc:  '#d0ccc0',
  iris:     '#704820',
  pupil:    '#0c0400',
  eyeW:     '#f4f2ee',
  blush:    '#d07060',
  smile:    '#a04828',
  tabletB:  '#1e2028',
  tabletS:  '#1840c0',
}

/* ── Shared material shorthand ──────────────────────────────── */
const M = (props) => (
  <meshStandardMaterial roughness={0.75} metalness={0} {...props} />
)

/* ── Hair ───────────────────────────────────────────────────── */
function Hair() {
  return (
    <group>
      {/* Main cap */}
      <Sphere args={[0.345, 28, 18]} position={[0, 0.09, -0.02]}>
        <M color={C.hair} roughness={0.97} />
      </Sphere>
      {/* Back mass */}
      <Sphere args={[0.295, 18, 14]} position={[0, 0.02, -0.20]} scale={[1.1, 0.92, 0.62]}>
        <M color={C.hair} roughness={0.97} />
      </Sphere>
      {/* Side masses */}
      <Sphere args={[0.20, 14, 10]} position={[-0.24, 0.05, 0.02]} scale={[0.6, 0.88, 0.75]}>
        <M color={C.hair} roughness={0.95} />
      </Sphere>
      <Sphere args={[0.20, 14, 10]} position={[ 0.24, 0.05, 0.02]} scale={[0.6, 0.88, 0.75]}>
        <M color={C.hair} roughness={0.95} />
      </Sphere>
      {/* Tufts / wisps */}
      {[
        { p:[  0.00, 0.46,  0.07], r:[  0,    0,  0.00], s:[0.68, 1.10, 0.70] },
        { p:[  0.18, 0.44,  0.08], r:[  0,    0,  0.32], s:[0.58, 0.95, 0.60] },
        { p:[ -0.18, 0.44,  0.08], r:[  0,    0, -0.32], s:[0.58, 0.95, 0.60] },
        { p:[  0.30, 0.38,  0.03], r:[  0,    0,  0.60], s:[0.50, 0.82, 0.52] },
        { p:[ -0.30, 0.38,  0.03], r:[  0,    0, -0.60], s:[0.50, 0.82, 0.52] },
        { p:[  0.05, 0.43, -0.10], r:[ -0.32, 0,  0.10], s:[0.62, 0.88, 0.54] },
      ].map(({ p, r, s }, i) => (
        <mesh key={i} position={p} rotation={r} scale={s}>
          <capsuleGeometry args={[0.060, 0.14, 4, 8]} />
          <M color={C.hair} roughness={0.94} />
        </mesh>
      ))}
    </group>
  )
}

/* ── Eye ────────────────────────────────────────────────────── */
function Eye({ side, lidRef, pupilRef }) {
  const x = side === 'L' ? -0.148 : 0.148
  return (
    <group position={[x, 0.040, 0.288]}>
      {/* White */}
      <Sphere args={[0.090, 22, 18]}>
        <M color={C.eyeW} roughness={0.22} />
      </Sphere>
      {/* Iris */}
      <Sphere args={[0.062, 18, 16]} position={[0, 0, 0.044]}>
        <M color={C.iris} roughness={0.22} />
      </Sphere>
      {/* Pupil */}
      <Sphere ref={pupilRef} args={[0.040, 14, 12]} position={[0, 0, 0.078]}>
        <M color={C.pupil} roughness={0.10} />
      </Sphere>
      {/* Catchlight */}
      <Sphere args={[0.017, 8, 6]} position={[0.026, 0.030, 0.093]}>
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.85}
          roughness={0.08}
        />
      </Sphere>
      {/* Lower lash line */}
      <mesh position={[0, -0.058, 0.062]}>
        <capsuleGeometry args={[0.008, 0.095, 4, 6]} />
        <M color={C.skinD} roughness={0.8} />
      </mesh>
      {/* Eyelid — rotation.x starts at PI/2 (open), closes toward 0 */}
      <group ref={lidRef} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.096, 22, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <M color={C.skin} roughness={0.78} />
        </mesh>
      </group>
    </group>
  )
}

/* ── Arm ────────────────────────────────────────────────────── */
function Arm({ side, upperRef, lowerRef }) {
  const sx = side === 'R' ? 0.40 : -0.40
  return (
    <group position={[sx, 0.52, 0]}>
      <group ref={upperRef} rotation={[0, 0, side === 'R' ? 0.18 : -0.18]}>
        <mesh position={[0, -0.21, 0]}>
          <capsuleGeometry args={[0.092, 0.27, 6, 14]} />
          <M color={C.sweater} roughness={0.90} />
        </mesh>
        {/* Elbow pivot */}
        <group position={[0, -0.39, 0]}>
          <group ref={lowerRef} rotation={[0, 0, side === 'R' ? 0.12 : -0.12]}>
            <mesh position={[0, -0.18, 0]}>
              <capsuleGeometry args={[0.076, 0.24, 6, 12]} />
              <M color={C.skin} roughness={0.68} />
            </mesh>
            {/* Hand */}
            <Sphere args={[0.082, 16, 14]} position={[0, -0.32, 0]}>
              <M color={C.skin} roughness={0.65} />
            </Sphere>
          </group>
        </group>
      </group>
    </group>
  )
}

/* ── Leg ────────────────────────────────────────────────────── */
function Leg({ side }) {
  const sx = side === 'R' ?  0.155 : -0.155
  const fx = side === 'R' ?  0.055 : -0.055

  return (
    <group position={[sx, 0, 0]}>
      <mesh position={[0, -0.21, 0]}>
        <capsuleGeometry args={[0.108, 0.29, 6, 14]} />
        <M color={C.pants} roughness={0.87} />
      </mesh>
      {/* Knee */}
      <group position={[0, -0.41, 0]}>
        <mesh position={[0, -0.21, 0]}>
          <capsuleGeometry args={[0.093, 0.29, 6, 14]} />
          <M color={C.pants} roughness={0.87} />
        </mesh>
        {/* Ankle + shoe */}
        <group position={[fx, -0.42, 0]}>
          {/* Shoe upper */}
          <Sphere args={[0.103, 16, 12]} position={[0, 0, 0.065]} scale={[1.06, 0.58, 1.44]}>
            <M color={C.shoe} roughness={0.66} />
          </Sphere>
          {/* Gum sole */}
          <Sphere args={[0.103, 14, 10]} position={[0, -0.042, 0.065]} scale={[1.02, 0.22, 1.36]}>
            <M color={C.shoeGum} roughness={0.80} />
          </Sphere>
          {/* Side stripe */}
          <mesh position={[side === 'R' ? 0.095 : -0.095, -0.008, 0.046]}>
            <boxGeometry args={[0.006, 0.034, 0.130]} />
            <M color={C.shoeAcc} roughness={0.70} />
          </mesh>
        </group>
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
  const tabletRef  = useRef()   // tablet screen emissive

  /* Animation state — all mutable, no re-renders */
  const blink = useRef({ active: false, t0: 0, next: 2.5 })
  const wave  = useRef({ active: false, t0: 0, booted: false })
  const click = useRef(false)

  useFrame(({ clock }, dt) => {
    const t  = clock.getElapsedTime()
    const mx = (mousePos?.current?.x ?? 0.5) - 0.5
    const my = (mousePos?.current?.y ?? 0.5) - 0.5

    /* Deferred click → trigger wave with correct timestamp */
    if (click.current) {
      click.current = false
      wave.current.active = true
      wave.current.t0 = t
    }

    /* 1 · Float */
    if (rootRef.current) {
      rootRef.current.position.y = Math.sin(t * 0.72) * 0.065 - 0.35
    }

    /* 2 · Breathe */
    if (bodyRef.current) {
      bodyRef.current.scale.setScalar(1 + Math.sin(t * 1.18) * 0.010)
    }

    /* 3 · Head follows mouse */
    if (headRef.current) {
      headRef.current.rotation.y = L(headRef.current.rotation.y, mx *  0.48, 0.04)
      headRef.current.rotation.x = L(headRef.current.rotation.x, my * -0.26, 0.04)
    }

    /* 4 · Pupil tracking */
    const px = mx * 0.028, py = -my * 0.020
    if (lPupilRef.current) {
      lPupilRef.current.position.x = L(lPupilRef.current.position.x, px, 0.07)
      lPupilRef.current.position.y = L(lPupilRef.current.position.y, py, 0.07)
    }
    if (rPupilRef.current) {
      rPupilRef.current.position.x = L(rPupilRef.current.position.x, px, 0.07)
      rPupilRef.current.position.y = L(rPupilRef.current.position.y, py, 0.07)
    }

    /* 5 · Blink */
    if (!blink.current.active && t > blink.current.next) {
      blink.current.active = true
      blink.current.t0     = t
      blink.current.next   = t + 2.0 + Math.random() * 3.5
    }
    if (blink.current.active) {
      const p  = (t - blink.current.t0) / 0.13
      const frac = p < 0.5 ? p * 2 : Math.max(0, 2 - p * 2)
      const rx = Math.PI / 2 - frac * (Math.PI / 2)
      if (lLidRef.current) lLidRef.current.rotation.x = rx
      if (rLidRef.current) rLidRef.current.rotation.x = rx
      if (p >= 1) {
        blink.current.active = false
        if (lLidRef.current) lLidRef.current.rotation.x = Math.PI / 2
        if (rLidRef.current) rLidRef.current.rotation.x = Math.PI / 2
      }
    }

    /* 6 · Auto-wave once after 1 s */
    if (!wave.current.booted && t > 1.0) {
      wave.current.booted = true
      wave.current.active = true
      wave.current.t0     = t
    }

    /* 7 · Wave / idle arms */
    if (wave.current.active) {
      const wt    = t - wave.current.t0
      const raise = Math.min(1, wt / 0.45)

      if (wt < 4.5) {
        if (rUpperRef.current) {
          rUpperRef.current.rotation.z = L(rUpperRef.current.rotation.z, 1.28 * raise + 0.18 * (1 - raise), 0.10)
          rUpperRef.current.rotation.x = L(rUpperRef.current.rotation.x, -0.08 * raise, 0.08)
        }
        if (rLowerRef.current && wt > 0.22) {
          const osc = Math.sin(wt * 6.2) * 0.44 * raise
          rLowerRef.current.rotation.z = L(rLowerRef.current.rotation.z, -1.35 * raise + 0.12 * (1 - raise) + osc, 0.12)
        }
      } else {
        if (rUpperRef.current) {
          rUpperRef.current.rotation.z = L(rUpperRef.current.rotation.z, 0.18, 0.05)
          rUpperRef.current.rotation.x = L(rUpperRef.current.rotation.x, 0, 0.05)
        }
        if (rLowerRef.current) {
          rLowerRef.current.rotation.z = L(rLowerRef.current.rotation.z, 0.12, 0.05)
        }
        if (wt > 6.5) wave.current.active = false
      }
    } else {
      /* Idle sway */
      if (rUpperRef.current) {
        rUpperRef.current.rotation.z = L(rUpperRef.current.rotation.z, 0.18 + Math.sin(t * 0.55) * 0.022, 0.03)
      }
      if (lUpperRef.current) {
        /* Left arm holds tablet — gentle forward sway */
        lUpperRef.current.rotation.x = L(lUpperRef.current.rotation.x, 1.05 + Math.sin(t * 0.42 + 0.8) * 0.025, 0.03)
      }
    }

    /* 8 · Tablet screen pulse */
    if (tabletRef.current) {
      tabletRef.current.emissiveIntensity = 1.2 + Math.sin(t * 1.8) * 0.35
    }
  })

  return (
    <group
      position={[0, -0.35, 0]}
      onClick={(e) => { e.stopPropagation(); click.current = true }}
    >
      {/* ══ HEAD ════════════════════════════════════════════════ */}
      <group ref={headRef} position={[0, 1.48, 0]}>
        {/* Face sphere */}
        <Sphere args={[0.330, 36, 28]}>
          <M color={C.skin} roughness={0.70} />
        </Sphere>
        {/* Jaw (wider, slightly lower) */}
        <Sphere args={[0.308, 28, 20]} position={[0, -0.065, 0.024]} scale={[1.06, 0.80, 1.04]}>
          <M color={C.skin} roughness={0.72} />
        </Sphere>
        {/* Ears */}
        {[-1, 1].map(s => (
          <Sphere key={s} args={[0.088, 14, 12]} position={[s * 0.320, 0, 0]} scale={[0.54, 0.96, 0.50]}>
            <M color={C.skinD} roughness={0.76} />
          </Sphere>
        ))}
        {/* Cheek blush */}
        {[-1, 1].map(s => (
          <Sphere key={s} args={[0.085, 10, 8]} position={[s * 0.210, -0.050, 0.268]} scale={[1.15, 0.48, 0.36]}>
            <M color={C.blush} roughness={1} opacity={0.26} transparent />
          </Sphere>
        ))}

        <Hair />

        {/* Eyebrows */}
        {[-1, 1].map(s => (
          <mesh key={s} position={[s * 0.148, 0.175, 0.294]} rotation={[0.06, s * 0.04, -s * 0.18]}>
            <capsuleGeometry args={[0.014, 0.110, 4, 8]} />
            <M color={C.hair} roughness={0.92} />
          </mesh>
        ))}

        {/* Eyes */}
        <Eye side="L" lidRef={lLidRef}  pupilRef={lPupilRef} />
        <Eye side="R" lidRef={rLidRef}  pupilRef={rPupilRef} />

        {/* Nose */}
        <Sphere args={[0.032, 12, 10]} position={[0, -0.060, 0.316]} scale={[1.0, 0.76, 0.60]}>
          <M color={C.skinD} roughness={0.76} />
        </Sphere>
        {[-1, 1].map(s => (
          <Sphere key={s} args={[0.018, 8, 6]} position={[s * 0.024, -0.082, 0.306]} scale={[0.78, 0.58, 0.48]}>
            <M color={C.skinD} roughness={0.80} />
          </Sphere>
        ))}

        {/* Smile */}
        <mesh position={[0, -0.152, 0.294]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.088, 0.014, 6, 24, Math.PI * 0.82]} />
          <M color={C.smile} roughness={0.82} />
        </mesh>
        {/* Dimples */}
        {[-1, 1].map(s => (
          <Sphere key={s} args={[0.014, 8, 6]} position={[s * 0.086, -0.143, 0.290]} scale={[0.65, 0.65, 0.38]}>
            <M color={C.skinD} roughness={0.80} />
          </Sphere>
        ))}

        {/* Upper lip */}
        <mesh position={[0, -0.132, 0.306]}>
          <capsuleGeometry args={[0.010, 0.064, 4, 8]} />
          <M color={C.skinD} roughness={0.76} />
        </mesh>
      </group>

      {/* ══ NECK ════════════════════════════════════════════════ */}
      <mesh position={[0, 1.06, 0]}>
        <capsuleGeometry args={[0.092, 0.19, 6, 12]} />
        <M color={C.skin} roughness={0.70} />
      </mesh>

      {/* ══ TORSO ═══════════════════════════════════════════════ */}
      <group ref={bodyRef}>
        {/* Body */}
        <mesh position={[0, 0.60, 0]}>
          <capsuleGeometry args={[0.285, 0.62, 8, 18]} />
          <M color={C.sweater} roughness={0.90} />
        </mesh>
        {/* Shoulder width */}
        <mesh position={[0, 0.74, 0]} scale={[1.14, 0.68, 1.02]}>
          <sphereGeometry args={[0.285, 18, 14]} />
          <M color={C.sweater} roughness={0.90} />
        </mesh>
        {/* Crewneck collar */}
        <mesh position={[0, 0.94, 0.10]}>
          <torusGeometry args={[0.106, 0.032, 10, 28]} />
          <M color={C.collar} roughness={0.88} />
        </mesh>
        {/* Waist / hip join */}
        <mesh position={[0, 0.26, 0]}>
          <capsuleGeometry args={[0.248, 0.09, 6, 14]} />
          <M color={C.pants} roughness={0.87} />
        </mesh>
      </group>

      {/* ══ ARMS ════════════════════════════════════════════════ */}
      <Arm side="R" upperRef={rUpperRef} lowerRef={rLowerRef} />
      <Arm side="L" upperRef={lUpperRef} lowerRef={null}      />

      {/* ══ LEGS ════════════════════════════════════════════════ */}
      <Leg side="R" />
      <Leg side="L" />

      {/* ══ TABLET prop (held in left hand) ═════════════════════ */}
      {/* Positioned to align with left hand area (~waist-hip height) */}
      <group position={[-0.42, 0.08, 0.30]} rotation={[-0.12, 0.20, 0.10]}>
        {/* Body */}
        <mesh>
          <boxGeometry args={[0.215, 0.310, 0.015]} />
          <M color={C.tabletB} roughness={0.28} metalness={0.65} />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0, 0.009]}>
          <boxGeometry args={[0.182, 0.262, 0.002]} />
          <meshStandardMaterial
            ref={tabletRef}
            color="#0a1830"
            emissive={new THREE.Color(C.tabletS)}
            emissiveIntensity={1.2}
            roughness={0.04}
          />
        </mesh>
        {/* Home button / notch */}
        <mesh position={[0, -0.135, 0.010]}>
          <cylinderGeometry args={[0.012, 0.012, 0.004, 12]} />
          <M color="#2a2d38" roughness={0.5} metalness={0.4} />
        </mesh>
        {/* Screen UI — fake glowing lines */}
        {[0.06, 0.00, -0.06, -0.10].map((y, i) => (
          <mesh key={i} position={[i % 2 === 0 ? -0.02 : 0.02, y, 0.011]}>
            <boxGeometry args={[i % 2 === 0 ? 0.10 : 0.07, 0.010, 0.001]} />
            <meshStandardMaterial
              color="#4488ff"
              emissive="#4488ff"
              emissiveIntensity={0.6}
              roughness={0.1}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}
