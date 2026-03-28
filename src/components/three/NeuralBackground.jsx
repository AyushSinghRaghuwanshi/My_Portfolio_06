import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const NODE_COUNT  = 80
const MAX_DIST    = 2.2

/* ─── Neural network nodes + connections ───────────────────── */
function NeuralNet({ mouseX = 0, mouseY = 0 }) {
  const pointsRef = useRef()
  const linesRef  = useRef()

  const { positions, velocities, linePositions } = useMemo(() => {
    const pos = new Float32Array(NODE_COUNT * 3)
    const vel = new Float32Array(NODE_COUNT * 3)

    for (let i = 0; i < NODE_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 16
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4
      vel[i * 3]     = (Math.random() - 0.5) * 0.008
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.006
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.003
    }

    // Max connections: NODE_COUNT * (NODE_COUNT - 1) / 2
    const maxLines = NODE_COUNT * (NODE_COUNT - 1)
    const lp = new Float32Array(maxLines * 3)

    return { positions: pos, velocities: vel, linePositions: lp }
  }, [])

  useFrame(({ clock }) => {
    if (!pointsRef.current || !linesRef.current) return

    const pos = pointsRef.current.geometry.attributes.position.array
    const t   = clock.getElapsedTime()

    // Update node positions
    for (let i = 0; i < NODE_COUNT; i++) {
      pos[i * 3]     += velocities[i * 3]     + Math.sin(t * 0.3 + i) * 0.0008
      pos[i * 3 + 1] += velocities[i * 3 + 1] + Math.cos(t * 0.25 + i) * 0.0006
      pos[i * 3 + 2] += velocities[i * 3 + 2]

      // Bounce within bounds
      if (Math.abs(pos[i * 3])     > 8)  velocities[i * 3]     *= -1
      if (Math.abs(pos[i * 3 + 1]) > 5)  velocities[i * 3 + 1] *= -1
      if (Math.abs(pos[i * 3 + 2]) > 2)  velocities[i * 3 + 2] *= -1
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true

    // Rebuild connections
    let lIdx = 0
    const lp  = linesRef.current.geometry.attributes.position.array

    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = pos[i * 3]     - pos[j * 3]
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1]
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2]
        const d  = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (d < MAX_DIST && lIdx + 5 < lp.length) {
          lp[lIdx++] = pos[i * 3]
          lp[lIdx++] = pos[i * 3 + 1]
          lp[lIdx++] = pos[i * 3 + 2]
          lp[lIdx++] = pos[j * 3]
          lp[lIdx++] = pos[j * 3 + 1]
          lp[lIdx++] = pos[j * 3 + 2]
        }
      }
    }

    // Zero out unused line slots
    for (let k = lIdx; k < lp.length; k++) lp[k] = 0

    linesRef.current.geometry.attributes.position.needsUpdate = true
    linesRef.current.geometry.setDrawRange(0, lIdx / 3)

    // Subtle mouse parallax on the whole group
    if (pointsRef.current.parent) {
      pointsRef.current.parent.rotation.x = THREE.MathUtils.lerp(
        pointsRef.current.parent.rotation.x,
        mouseY * 0.06,
        0.03,
      )
      pointsRef.current.parent.rotation.y = THREE.MathUtils.lerp(
        pointsRef.current.parent.rotation.y,
        mouseX * 0.06,
        0.03,
      )
    }
  })

  const maxLineVerts = NODE_COUNT * (NODE_COUNT - 1)

  return (
    <group>
      {/* Nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={NODE_COUNT}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.055}
          color="#915EFF"
          transparent
          opacity={0.75}
          sizeAttenuation
        />
      </points>

      {/* Connections */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={maxLineVerts}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#4B2EA0"
          transparent
          opacity={0.35}
          linewidth={1}
        />
      </lineSegments>
    </group>
  )
}

/* ─── Exported canvas ──────────────────────────────────────── */
export default function NeuralBackground({ mouseX = 0, mouseY = 0 }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 75 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <NeuralNet mouseX={mouseX} mouseY={mouseY} />
    </Canvas>
  )
}
