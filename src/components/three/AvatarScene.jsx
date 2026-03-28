/**
 * AvatarScene.jsx — effects-only Three.js canvas (no custom shader)
 *
 * Removed the custom GLSL shaderMaterial (was causing black screen via
 * Vite tree-shaking, inverted smoothstep args, and bufferAttribute API
 * mismatches). The avatar image is now rendered purely in CSS/DOM
 * by AvatarHero.jsx on top of this canvas.
 *
 * This canvas renders ONLY the 3D effects surrounding the avatar:
 *  - Neural-network nodes + pulsing connection lines
 *  - 3 orbital Torus rings at different 3D tilt angles
 *  - 4 data-stream particle columns
 *  - Mouse-reactive scene rotation
 */

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Torus, Sphere } from '@react-three/drei'
import * as THREE from 'three'

/* ══════════════════════════════════════════════════════════════
   ORBITAL RING  — Torus + glowing orbiting dot
   ══════════════════════════════════════════════════════════════ */
function OrbitalRing({ radius, tube, tiltX, tiltZ, color, speed, opacity, dotSize = 0.04 }) {
  const groupRef = useRef()
  const dotRef   = useRef()
  const angle    = useRef(Math.random() * Math.PI * 2)

  useFrame((_, dt) => {
    if (groupRef.current) groupRef.current.rotation.z += speed * dt
    if (dotRef.current) {
      angle.current += speed * dt * 2.2
      dotRef.current.position.x = Math.cos(angle.current) * radius
      dotRef.current.position.y = Math.sin(angle.current) * radius
    }
  })

  return (
    <group ref={groupRef} rotation={[tiltX, 0, tiltZ]}>
      <Torus args={[radius, tube, 6, 128]}>
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </Torus>
      <Sphere ref={dotRef} args={[dotSize, 8, 8]} position={[radius, 0, 0]}>
        <meshBasicMaterial color={color} />
      </Sphere>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   NEURAL NETWORK — nodes + connection lines, slow drift
   ══════════════════════════════════════════════════════════════ */
function NeuralNetwork() {
  const NODE_COUNT   = 28
  const CONNECT_DIST = 1.1

  // Compute stable base positions once
  const { basePosArr, linePos, offsets } = useMemo(() => {
    const base = new Float32Array(NODE_COUNT * 3)
    for (let i = 0; i < NODE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      const r     = 1.6 + Math.random() * 0.8
      base[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      base[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      base[i * 3 + 2] = r * Math.cos(phi)
    }

    // Connections between nearby nodes
    const lines = []
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = base[i*3]   - base[j*3]
        const dy = base[i*3+1] - base[j*3+1]
        const dz = base[i*3+2] - base[j*3+2]
        if (Math.sqrt(dx*dx + dy*dy + dz*dz) < CONNECT_DIST) {
          lines.push(
            base[i*3], base[i*3+1], base[i*3+2],
            base[j*3], base[j*3+1], base[j*3+2],
          )
        }
      }
    }

    const offs = Array.from({ length: NODE_COUNT }, () => ({
      sx:  (Math.random() - 0.5) * 1.2,
      sy:  (Math.random() - 0.5) * 1.2,
      ph:   Math.random() * Math.PI * 2,
    }))

    return {
      basePosArr: base,
      linePos:    new Float32Array(lines),
      offsets:    offs,
    }
  }, [])

  // Mutable node positions array (updated each frame)
  const nodePos  = useMemo(() => new Float32Array(basePosArr), [basePosArr])

  const nodesRef = useRef()
  const linesRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Drift nodes
    for (let i = 0; i < NODE_COUNT; i++) {
      nodePos[i*3]     = basePosArr[i*3]     + Math.sin(t * offsets[i].sx + offsets[i].ph) * 0.07
      nodePos[i*3 + 1] = basePosArr[i*3 + 1] + Math.cos(t * offsets[i].sy + offsets[i].ph) * 0.07
    }

    // Push updates to geometry
    const attr = nodesRef.current?.geometry?.attributes?.position
    if (attr) { attr.array.set(nodePos); attr.needsUpdate = true }

    // Pulse line opacity
    const lm = linesRef.current?.material
    if (lm) lm.opacity = 0.09 + Math.sin(t * 1.5) * 0.05
  })

  return (
    <group>
      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePos.length / 3}
            array={linePos}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#915EFF" transparent opacity={0.10} />
      </lineSegments>

      {/* Node dots */}
      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nodePos.length / 3}
            array={nodePos}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.04} color="#00d9ff" transparent opacity={0.85} sizeAttenuation />
      </points>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   DATA STREAM — particles flowing upward
   ══════════════════════════════════════════════════════════════ */
function DataStream({ x, z, count = 20, speed = 0.42, color }) {
  const ref = useRef()

  const pos = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i*3]     = x + (Math.random() - 0.5) * 0.08
      arr[i*3 + 1] = (Math.random() - 0.5) * 4.4
      arr[i*3 + 2] = z + (Math.random() - 0.5) * 0.08
    }
    return arr
  }, [x, z, count])

  useFrame((_, dt) => {
    const attr = ref.current?.geometry?.attributes?.position
    if (!attr) return
    const arr = attr.array
    for (let i = 0; i < count; i++) {
      arr[i*3 + 1] += speed * dt
      if (arr[i*3 + 1] > 2.2) arr[i*3 + 1] = -2.2
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={pos.length / 3}
          array={pos}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.028} color={color} transparent opacity={0.55} sizeAttenuation />
    </points>
  )
}

/* ══════════════════════════════════════════════════════════════
   LIGHTS
   ══════════════════════════════════════════════════════════════ */
function Lights() {
  const kRef = useRef()
  useFrame(({ clock }) => {
    if (kRef.current) kRef.current.intensity = 1.5 + Math.sin(clock.getElapsedTime() * 1.4) * 0.3
  })
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight ref={kRef} position={[2, 2, 2.5]}   color="#915EFF" intensity={1.5} />
      <pointLight             position={[-2, 1.5, 2]}  color="#00d9ff" intensity={1.1} />
      <pointLight             position={[0, -2.5, 1]}  color="#3d1a8a" intensity={0.4} />
    </>
  )
}

/* ══════════════════════════════════════════════════════════════
   SCENE ROOT — mouse-reactive rotation
   ══════════════════════════════════════════════════════════════ */
function Scene({ mousePos }) {
  const groupRef = useRef()

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y, (mousePos.current.x - 0.5) * 0.55, 0.04)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x, (mousePos.current.y - 0.5) * -0.40, 0.04)
  })

  return (
    <>
      <Lights />
      <group ref={groupRef}>
        <NeuralNetwork />
        <OrbitalRing radius={1.45} tube={0.009} tiltX={0.55} tiltZ={0.20} color="#915EFF" speed={0.38}  opacity={0.55} />
        <OrbitalRing radius={1.70} tube={0.007} tiltX={1.10} tiltZ={0.75} color="#00d9ff" speed={-0.24} opacity={0.42} dotSize={0.032} />
        <OrbitalRing radius={1.95} tube={0.005} tiltX={0.30} tiltZ={1.40} color="#915EFF" speed={0.17}  opacity={0.24} dotSize={0.028} />
        <DataStream x={-1.75} z={0.4}  color="#915EFF" speed={0.44} count={18} />
        <DataStream x={ 1.75} z={0.4}  color="#00d9ff" speed={0.38} count={18} />
        <DataStream x={-0.85} z={1.55} color="#00d9ff" speed={0.51} count={14} />
        <DataStream x={ 0.85} z={1.55} color="#915EFF" speed={0.42} count={14} />
      </group>
    </>
  )
}

/* ══════════════════════════════════════════════════════════════
   EXPORTED CANVAS
   ══════════════════════════════════════════════════════════════ */
export default function AvatarScene({ mousePos }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.8], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <Scene mousePos={mousePos} />
    </Canvas>
  )
}
