import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, OrbitControls, Sphere } from '@react-three/drei'
import * as THREE from 'three'

/* ─── Orbiting ring ────────────────────────────────────────── */
function OrbitRing({ radius, tubeRadius, tilt, color, speed, opacity }) {
  const ref = useRef()
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += speed * delta
  })
  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, tubeRadius, 8, 128]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  )
}

/* ─── Floating data dots ───────────────────────────────────── */
function DataDots({ count = 60 }) {
  const ref = useRef()

  const { positions, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const ph  = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      const r     = 1.8 + Math.random() * 0.8
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
      ph[i] = Math.random() * Math.PI * 2
    }
    return { positions: pos, phases: ph }
  }, [count])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const pos = ref.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * 0.001
      const x = pos[i * 3]
      const z = pos[i * 3 + 2]
      pos[i * 3]     = x * Math.cos(theta) - z * Math.sin(theta)
      pos[i * 3 + 2] = x * Math.sin(theta) + z * Math.cos(theta)
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#00d9ff"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  )
}

/* ─── Holographic head ─────────────────────────────────────── */
function HolographicBust({ mouseX, mouseY }) {
  const groupRef  = useRef()
  const headRef   = useRef()
  const glowRef   = useRef()
  const wireRef   = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    if (groupRef.current) {
      // Subtle mouse-responsive tilt
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouseX * 0.4,
        0.05,
      )
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mouseY * 0.25,
        0.05,
      )
    }

    if (glowRef.current) {
      glowRef.current.material.emissiveIntensity = 0.4 + Math.sin(t * 1.5) * 0.15
    }

    if (wireRef.current) {
      wireRef.current.material.opacity = 0.12 + Math.sin(t * 0.8) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {/* Head — distorted sphere with holographic material */}
      <Float speed={1.2} rotationIntensity={0.06} floatIntensity={0.25}>
        <group position={[0, 0.55, 0]}>

          {/* Core head sphere */}
          <Sphere ref={headRef} args={[0.68, 64, 64]}>
            <MeshDistortMaterial
              color="#1a0a3d"
              distort={0.18}
              speed={1.2}
              roughness={0.1}
              metalness={0.95}
              emissive="#5B3FA0"
              emissiveIntensity={0.45}
              transparent
              opacity={0.92}
            />
          </Sphere>

          {/* Holographic wireframe overlay */}
          <Sphere ref={wireRef} args={[0.70, 18, 18]}>
            <meshBasicMaterial
              color="#915EFF"
              wireframe
              transparent
              opacity={0.14}
            />
          </Sphere>

          {/* Outer cyan wireframe */}
          <Sphere ref={glowRef} args={[0.72, 10, 10]}>
            <meshStandardMaterial
              color="#00d9ff"
              wireframe
              transparent
              opacity={0.08}
              emissive="#00d9ff"
              emissiveIntensity={0.4}
            />
          </Sphere>

          {/* Inner glow core */}
          <Sphere args={[0.35, 16, 16]}>
            <meshBasicMaterial
              color="#915EFF"
              transparent
              opacity={0.18}
            />
          </Sphere>

          {/* Face plane — subtle highlight suggesting face */}
          <mesh position={[0, 0, 0.62]} rotation={[0, 0, 0]}>
            <planeGeometry args={[0.55, 0.65]} />
            <meshBasicMaterial
              color="#00d9ff"
              transparent
              opacity={0.04}
            />
          </mesh>
        </group>

        {/* Neck */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.14, 0.18, 0.42, 24]} />
          <meshStandardMaterial
            color="#0d0726"
            metalness={0.95}
            roughness={0.05}
            emissive="#915EFF"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Shoulders */}
        <mesh position={[0, -0.48, 0]}>
          <capsuleGeometry args={[0.48, 0.45, 8, 24]} />
          <meshStandardMaterial
            color="#07051a"
            metalness={0.98}
            roughness={0.05}
            emissive="#3d2480"
            emissiveIntensity={0.35}
            transparent
            opacity={0.95}
          />
        </mesh>

        {/* Shoulder wireframe edge */}
        <mesh position={[0, -0.48, 0]}>
          <capsuleGeometry args={[0.50, 0.47, 6, 16]} />
          <meshBasicMaterial color="#915EFF" wireframe transparent opacity={0.07} />
        </mesh>

        {/* Collar/chest accent line */}
        <mesh position={[0, -0.18, 0]}>
          <torusGeometry args={[0.22, 0.012, 8, 64]} />
          <meshBasicMaterial color="#00d9ff" transparent opacity={0.55} />
        </mesh>
      </Float>

      {/* Orbiting rings */}
      <OrbitRing radius={1.15} tubeRadius={0.008} tilt={Math.PI * 0.15} color="#915EFF" speed={0.35} opacity={0.55} />
      <OrbitRing radius={1.35} tubeRadius={0.006} tilt={Math.PI * 0.4}  color="#00d9ff" speed={-0.22} opacity={0.40} />
      <OrbitRing radius={1.55} tubeRadius={0.005} tilt={Math.PI * 0.6}  color="#915EFF" speed={0.18}  opacity={0.25} />

      {/* Floating data particles */}
      <DataDots count={55} />

      {/* Ambient glow sphere */}
      <Sphere args={[1.7, 16, 16]}>
        <meshBasicMaterial color="#3d1a8a" transparent opacity={0.04} side={THREE.BackSide} />
      </Sphere>
    </group>
  )
}

/* ─── Scene lights ─────────────────────────────────────────── */
function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[3, 3, 3]}  intensity={1.8} color="#915EFF" />
      <pointLight position={[-3, 2, 2]} intensity={1.4} color="#00d9ff" />
      <pointLight position={[0, -2, 1]} intensity={0.6} color="#3d1a8a" />
      <spotLight
        position={[0, 4, 4]}
        angle={0.45}
        penumbra={0.8}
        intensity={2.5}
        color="#c4b5fd"
        castShadow={false}
      />
    </>
  )
}

/* ─── Exported canvas ──────────────────────────────────────── */
export default function AvatarCanvas({ mouseX = 0, mouseY = 0 }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <SceneLights />
      <HolographicBust mouseX={mouseX} mouseY={mouseY} />
    </Canvas>
  )
}
