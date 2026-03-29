/**
 * AvatarScene.jsx — Three.js canvas with animated character + effects
 * No custom GLSL shaders. All geometry-based.
 */

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Torus, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import AvatarCharacter from './AvatarCharacter'

/* ── Orbital ring with glowing dot ─────────────────────────── */
function OrbitalRing({ radius, tube, tiltX, tiltZ, color, speed, opacity, dotSize = 0.038 }) {
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

/* ── Neural-network nodes + pulsing connection lines ────────── */
function NeuralNetwork() {
  const N    = 26
  const DIST = 1.15

  const { base, linePos, offsets } = useMemo(() => {
    const b = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      const r     = 1.7 + Math.random() * 0.9
      b[i*3]   = r * Math.sin(phi) * Math.cos(theta)
      b[i*3+1] = r * Math.sin(phi) * Math.sin(theta)
      b[i*3+2] = r * Math.cos(phi)
    }
    const lines = []
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = b[i*3]-b[j*3], dy = b[i*3+1]-b[j*3+1], dz = b[i*3+2]-b[j*3+2]
        if (Math.sqrt(dx*dx+dy*dy+dz*dz) < DIST) {
          lines.push(b[i*3],b[i*3+1],b[i*3+2], b[j*3],b[j*3+1],b[j*3+2])
        }
      }
    }
    const offs = Array.from({ length: N }, () => ({
      sx: (Math.random()-.5)*1.1, sy: (Math.random()-.5)*1.1, ph: Math.random()*Math.PI*2,
    }))
    return { base: b, linePos: new Float32Array(lines), offsets: offs }
  }, [])

  const nodePos  = useMemo(() => new Float32Array(base), [base])
  const nodesRef = useRef()
  const linesRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < N; i++) {
      nodePos[i*3]   = base[i*3]   + Math.sin(t*offsets[i].sx + offsets[i].ph) * 0.07
      nodePos[i*3+1] = base[i*3+1] + Math.cos(t*offsets[i].sy + offsets[i].ph) * 0.07
    }
    const attr = nodesRef.current?.geometry?.attributes?.position
    if (attr) { attr.array.set(nodePos); attr.needsUpdate = true }
    const lm = linesRef.current?.material
    if (lm) lm.opacity = 0.08 + Math.sin(t * 1.5) * 0.04
  })

  return (
    <group>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={linePos.length/3} array={linePos} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#915EFF" transparent opacity={0.09} />
      </lineSegments>
      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={nodePos.length/3} array={nodePos} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.038} color="#00d9ff" transparent opacity={0.8} sizeAttenuation />
      </points>
    </group>
  )
}

/* ── Data-stream particles flowing upward ───────────────────── */
function DataStream({ x, z, count = 18, speed = 0.42, color }) {
  const ref = useRef()
  const pos = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i*3]   = x + (Math.random()-.5) * 0.08
      arr[i*3+1] = (Math.random()-.5) * 5
      arr[i*3+2] = z + (Math.random()-.5) * 0.08
    }
    return arr
  }, [x, z, count])

  useFrame((_, dt) => {
    const attr = ref.current?.geometry?.attributes?.position
    if (!attr) return
    const arr = attr.array
    for (let i = 0; i < count; i++) {
      arr[i*3+1] += speed * dt
      if (arr[i*3+1] > 2.6) arr[i*3+1] = -2.6
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={pos.length/3} array={pos} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.026} color={color} transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

/* ── Pulsing ambient light ──────────────────────────────────── */
function Lights() {
  const kRef = useRef()
  useFrame(({ clock }) => {
    if (kRef.current) kRef.current.intensity = 1.4 + Math.sin(clock.getElapsedTime() * 1.4) * 0.3
  })
  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight ref={kRef} position={[2.5, 3, 2]}   color="#ffffff" intensity={1.4} />
      <pointLight              position={[-2,  2, 2]}  color="#00d9ff" intensity={0.5} />
      <pointLight              position={[0,  -2, 1]}  color="#915EFF" intensity={0.4} />
      <spotLight
        position={[0, 5, 3]}
        angle={0.5} penumbra={0.8}
        intensity={1.8} color="#ffe8cc"
      />
    </>
  )
}

/* ── Mouse-reactive scene rotation ─────────────────────────── */
function Scene({ mousePos }) {
  const bgRef = useRef()

  useFrame(() => {
    if (!bgRef.current) return
    bgRef.current.rotation.y = THREE.MathUtils.lerp(
      bgRef.current.rotation.y, (mousePos.current.x - 0.5) * 0.4, 0.04)
    bgRef.current.rotation.x = THREE.MathUtils.lerp(
      bgRef.current.rotation.x, (mousePos.current.y - 0.5) * -0.25, 0.04)
  })

  return (
    <>
      <Lights />

      {/* Animated character */}
      <AvatarCharacter mousePos={mousePos} />

      {/* Background effects — rotate with mouse */}
      <group ref={bgRef}>
        <NeuralNetwork />
        <OrbitalRing radius={1.55} tube={0.009} tiltX={0.5}  tiltZ={0.2}  color="#915EFF" speed={0.38}  opacity={0.45} />
        <OrbitalRing radius={1.80} tube={0.007} tiltX={1.1}  tiltZ={0.75} color="#00d9ff" speed={-0.24} opacity={0.35} dotSize={0.030} />
        <OrbitalRing radius={2.05} tube={0.005} tiltX={0.3}  tiltZ={1.4}  color="#915EFF" speed={0.16}  opacity={0.20} dotSize={0.025} />
        <DataStream x={-1.85} z={0.5}  color="#915EFF" speed={0.44} count={16} />
        <DataStream x={ 1.85} z={0.5}  color="#00d9ff" speed={0.38} count={16} />
        <DataStream x={-0.9}  z={1.65} color="#00d9ff" speed={0.51} count={12} />
        <DataStream x={ 0.9}  z={1.65} color="#915EFF" speed={0.42} count={12} />
      </group>
    </>
  )
}

export default function AvatarScene({ mousePos }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <Scene mousePos={mousePos} />
    </Canvas>
  )
}
