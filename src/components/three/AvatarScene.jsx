/**
 * AvatarScene.jsx
 * Full R3F 3D interactive avatar for the hero section.
 *
 * Features:
 *  - Avatar image rendered on a plane with a holographic GLSL shader
 *    (scan lines, chromatic aberration, edge glow, flicker)
 *  - Mouse-reactive: avatar tracks cursor + shader reacts on hover
 *  - 3D orbital Torus rings at different tilt angles, each with a
 *    glowing orbiting dot
 *  - Neural-network particle system: ~35 nodes in a sphere shell,
 *    connected by animated lines that pulse
 *  - Data-stream particles flowing upward around the avatar
 *  - Floating HTML tech badges in 3D space
 *  - Click → energy ripple burst
 */

import { useRef, useMemo, useState, useCallback, Suspense } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import {
  useTexture,
  Html,
  Float,
  shaderMaterial,
  Torus,
  Sphere,
} from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

/* ══════════════════════════════════════════════════════════════
   CUSTOM HOLOGRAPHIC SHADER MATERIAL
   ══════════════════════════════════════════════════════════════ */
const HolographicAvatarMaterial = shaderMaterial(
  {
    uTexture:  new THREE.Texture(),
    uTime:     0,
    uHover:    0,
    uMouse:    new THREE.Vector2(0.5, 0.5),
    uRipple:   0,
    uRipplePos: new THREE.Vector2(0.5, 0.5),
  },
  /* ── vertex ── */
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      vUv    = uv;
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* ── fragment ── */
  `
    uniform sampler2D uTexture;
    uniform float     uTime;
    uniform float     uHover;
    uniform vec2      uMouse;
    uniform float     uRipple;
    uniform vec2      uRipplePos;
    varying vec2      vUv;

    void main() {
      vec2 uv = vUv;

      /* Ripple distortion after click */
      float rippleDist = length(uv - uRipplePos);
      float rippleWave  = sin(rippleDist * 35.0 - uTime * 8.0) * uRipple * 0.018
                          * smoothstep(0.8, 0.0, rippleDist);
      uv += normalize(uv - uRipplePos) * rippleWave;

      /* Chromatic aberration (scales with hover + ripple) */
      float aber = (uHover * 0.009) + (uRipple * 0.006);
      float r    = texture2D(uTexture, uv + vec2(aber,  0.0)).r;
      float g    = texture2D(uTexture, uv).g;
      float b    = texture2D(uTexture, uv - vec2(aber,  0.0)).b;
      float a    = texture2D(uTexture, uv).a;
      vec4 color = vec4(r, g, b, a);

      /* Horizontal scan lines */
      float scan  = sin(uv.y * 110.0 + uTime * 5.0) * 0.5 + 0.5;
      scan        = pow(scan, 22.0) * (0.2 + uHover * 0.55 + uRipple * 0.3);
      color.rgb  += vec3(0.57, 0.37, 1.0) * scan;

      /* Vertical data lines */
      float vline  = sin(uv.x * 60.0 - uTime * 2.0) * 0.5 + 0.5;
      vline        = pow(vline, 35.0) * uHover * 0.18;
      color.rgb   += vec3(0.0, 0.85, 1.0) * vline;

      /* Circular crop + edge glow */
      vec2  centered = uv - 0.5;
      float dist     = length(centered) * 2.0;
      float vignette = 1.0 - smoothstep(0.55, 1.0, dist);
      color.a       *= vignette;

      float edgeGlow = smoothstep(0.45, 0.75, dist) * (0.5 + uHover * 0.5);
      color.rgb     += vec3(0.57, 0.37, 1.0) * edgeGlow * 0.4;

      /* Rare holographic flicker */
      float flicker = step(0.97, sin(uTime * 9.7) * 0.5 + 0.5) * uHover;
      color.rgb     = mix(color.rgb, vec3(0.0, 0.85, 1.0), flicker * 0.35);

      /* Ripple flash */
      color.rgb += vec3(0.57, 0.37, 1.0) * uRipple * 0.25
                   * smoothstep(0.6, 0.0, rippleDist);

      gl_FragColor = color;
    }
  `
)
extend({ HolographicAvatarMaterial })

/* ══════════════════════════════════════════════════════════════
   AVATAR PLANE  (image + shader)
   ══════════════════════════════════════════════════════════════ */
function AvatarPlane({ mousePos, isHovered, ripple }) {
  const matRef = useRef()
  // Try PNG first; on error Three.js will log but scene stays intact
  const texture = useTexture('/avatar.png')
  texture.colorSpace = THREE.SRGBColorSpace

  useFrame(({ clock }) => {
    if (!matRef.current) return
    matRef.current.uTime   = clock.getElapsedTime()
    matRef.current.uHover  = THREE.MathUtils.lerp(matRef.current.uHover, isHovered.current ? 1 : 0, 0.06)
    matRef.current.uMouse.set(mousePos.current.x, mousePos.current.y)
    matRef.current.uRipple = THREE.MathUtils.lerp(matRef.current.uRipple, 0, 0.04)
  })

  // Expose ripple trigger
  ripple.current = (x, y) => {
    if (!matRef.current) return
    matRef.current.uRipplePos.set(x, y)
    matRef.current.uRipple = 1
  }

  return (
    <mesh>
      <planeGeometry args={[2.2, 2.2, 1, 1]} />
      {/* @ts-ignore custom shader */}
      <holographicAvatarMaterial
        ref={matRef}
        uTexture={texture}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

/* ══════════════════════════════════════════════════════════════
   ORBITAL RING  (Torus + glowing orbiting dot)
   ══════════════════════════════════════════════════════════════ */
function OrbitalRing({ radius, tube, tiltX, tiltZ, color, speed, opacity, dotSize = 0.04 }) {
  const groupRef = useRef()
  const dotRef   = useRef()
  const angle    = useRef(Math.random() * Math.PI * 2)

  useFrame((_, dt) => {
    if (groupRef.current) groupRef.current.rotation.z += speed * dt
    if (dotRef.current) {
      angle.current += speed * dt * 2
      dotRef.current.position.x = Math.cos(angle.current) * radius
      dotRef.current.position.y = Math.sin(angle.current) * radius
    }
  })

  const col = new THREE.Color(color)
  return (
    <group ref={groupRef} rotation={[tiltX, 0, tiltZ]}>
      <Torus args={[radius, tube, 6, 128]}>
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </Torus>
      {/* Orbiting glow dot */}
      <Sphere ref={dotRef} args={[dotSize, 8, 8]} position={[radius, 0, 0]}>
        <meshBasicMaterial color={color} />
      </Sphere>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   NEURAL NETWORK  (nodes + connections that pulse)
   ══════════════════════════════════════════════════════════════ */
function NeuralNetwork() {
  const NODE_COUNT  = 34
  const CONNECT_DIST = 1.1

  const { basePosArr, linePos } = useMemo(() => {
    // Nodes on a sphere shell  r ∈ [1.55, 2.3]
    const base = []
    for (let i = 0; i < NODE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      const r     = 1.55 + Math.random() * 0.75
      base.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      )
    }

    // Build line segment pairs for nearby nodes
    const lines = []
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = base[i * 3]     - base[j * 3]
        const dy = base[i * 3 + 1] - base[j * 3 + 1]
        const dz = base[i * 3 + 2] - base[j * 3 + 2]
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < CONNECT_DIST) {
          lines.push(base[i * 3], base[i * 3 + 1], base[i * 3 + 2])
          lines.push(base[j * 3], base[j * 3 + 1], base[j * 3 + 2])
        }
      }
    }

    return {
      basePosArr: new Float32Array(base),
      linePos:    new Float32Array(lines),
    }
  }, [])

  /* Animated positions (slow drift) */
  const nodePos  = useMemo(() => new Float32Array(basePosArr), [basePosArr])
  const nodesRef = useRef()
  const linesRef = useRef()
  const speeds   = useMemo(
    () => Array.from({ length: NODE_COUNT }, () => ({
      ax: (Math.random() - 0.5) * 0.003,
      ay: (Math.random() - 0.5) * 0.003,
    })),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Drift nodes
    for (let i = 0; i < NODE_COUNT; i++) {
      nodePos[i * 3]     = basePosArr[i * 3]     + Math.sin(t * speeds[i].ax * 200 + i) * 0.06
      nodePos[i * 3 + 1] = basePosArr[i * 3 + 1] + Math.cos(t * speeds[i].ay * 200 + i) * 0.06
    }
    if (nodesRef.current) {
      nodesRef.current.geometry.attributes.position.array.set(nodePos)
      nodesRef.current.geometry.attributes.position.needsUpdate = true
    }

    // Pulse line opacity
    if (linesRef.current) {
      linesRef.current.material.opacity = 0.10 + Math.sin(t * 1.4) * 0.06
    }
  })

  return (
    <group>
      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePos, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#915EFF" transparent opacity={0.13} />
      </lineSegments>

      {/* Node dots */}
      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color="#00d9ff"
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   DATA STREAM  (particles flowing upward)
   ══════════════════════════════════════════════════════════════ */
function DataStream({ x, z, count = 30, speed = 0.4, color = '#915EFF' }) {
  const ref  = useRef()
  const { initY, initPhase } = useMemo(() => ({
    initY:     Array.from({ length: count }, () => (Math.random() - 0.5) * 4),
    initPhase: Array.from({ length: count }, () => Math.random() * Math.PI * 2),
  }), [count])

  const pos = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = x + (Math.random() - 0.5) * 0.08
      arr[i * 3 + 1] = initY[i]
      arr[i * 3 + 2] = z + (Math.random() - 0.5) * 0.08
    }
    return arr
  }, [count, x, z, initY])

  useFrame((_, dt) => {
    if (!ref.current) return
    const arr = ref.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speed * dt
      if (arr[i * 3 + 1] > 2.2) arr[i * 3 + 1] = -2.2
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color={color} transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

/* ══════════════════════════════════════════════════════════════
   FLOATING HTML TECH BADGES  (3D positioned)
   ══════════════════════════════════════════════════════════════ */
const BADGE_DEFS = [
  { label: 'PyTorch',       pos: [-2.1,  1.1, 0.3],  color: 'purple', delay: 0    },
  { label: 'LLMs',          pos: [ 2.1,  1.0, 0.3],  color: 'cyan',   delay: 0.15 },
  { label: 'RAG',           pos: [ 2.2, -0.2, 0.2],  color: 'purple', delay: 0.3  },
  { label: 'Azure AI',      pos: [-2.2, -0.3, 0.2],  color: 'cyan',   delay: 0.45 },
  { label: 'Transformers',  pos: [-1.5, -1.4, 0.4],  color: 'purple', delay: 0.6  },
  { label: 'MLOps',         pos: [ 1.6, -1.4, 0.4],  color: 'cyan',   delay: 0.75 },
  { label: 'NLP',           pos: [-0.4,  1.8, 0.5],  color: 'purple', delay: 0.9  },
  { label: 'Python',        pos: [ 0.4,  1.8, 0.5],  color: 'cyan',   delay: 1.05 },
]

function FloatingBadge({ label, pos, color, delay }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = pos[1] + Math.sin(clock.getElapsedTime() * 0.9 + delay * 4) * 0.08
    }
  })

  const isDark = color === 'purple'

  return (
    <group ref={ref} position={pos}>
      <Html center distanceFactor={9} zIndexRange={[10, 0]}>
        <motion.div
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none select-none whitespace-nowrap"
          style={{
            padding: '3px 10px',
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 600,
            fontFamily: 'monospace',
            background: isDark ? 'rgba(145,94,255,0.15)' : 'rgba(0,217,255,0.12)',
            border:     isDark ? '1px solid rgba(145,94,255,0.45)' : '1px solid rgba(0,217,255,0.40)',
            color:      isDark ? '#c4b5fd' : '#67e8f9',
            boxShadow:  isDark
              ? '0 0 12px rgba(145,94,255,0.35)'
              : '0 0 12px rgba(0,217,255,0.30)',
            backdropFilter: 'blur(6px)',
          }}
        >
          {label}
        </motion.div>
      </Html>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   INTERACTION PLANE  (invisible — captures mouse + click)
   ══════════════════════════════════════════════════════════════ */
function InteractionPlane({ mousePos, isHovered, rippleFn }) {
  const meshRef = useRef()

  return (
    <mesh
      ref={meshRef}
      onPointerMove={(e) => {
        // Convert intersection UV to [0,1]
        if (e.uv) {
          mousePos.current.x = e.uv.x
          mousePos.current.y = e.uv.y
        }
        isHovered.current = true
      }}
      onPointerLeave={() => { isHovered.current = false }}
      onClick={(e) => {
        if (e.uv && rippleFn.current) {
          rippleFn.current(e.uv.x, e.uv.y)
        }
      }}
    >
      <planeGeometry args={[4.5, 4.5]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

/* ══════════════════════════════════════════════════════════════
   SCENE LIGHTS
   ══════════════════════════════════════════════════════════════ */
function Lights() {
  const purpleLight = useRef()
  useFrame(({ clock }) => {
    if (purpleLight.current) {
      purpleLight.current.intensity = 1.6 + Math.sin(clock.getElapsedTime() * 1.3) * 0.25
    }
  })
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight ref={purpleLight} position={[2.5, 2, 2.5]}  color="#915EFF" intensity={1.6} />
      <pointLight                   position={[-2.5, 1.5, 2]} color="#00d9ff" intensity={1.2} />
      <pointLight                   position={[0, -2.5, 1]}   color="#3d1a8a" intensity={0.5} />
      <spotLight
        position={[0, 4, 3]}
        angle={0.5}
        penumbra={0.9}
        intensity={2}
        color="#c4b5fd"
      />
    </>
  )
}

/* ══════════════════════════════════════════════════════════════
   MOUSE-REACTIVE GROUP  (whole scene gently tracks cursor)
   ══════════════════════════════════════════════════════════════ */
function SceneGroup({ mousePos, isHovered, rippleFn, children }) {
  const groupRef = useRef()

  useFrame(() => {
    if (!groupRef.current) return
    const tx = (mousePos.current.x - 0.5) * 0.5
    const ty = (mousePos.current.y - 0.5) * -0.4
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, tx, 0.04)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, ty, 0.04)
  })

  return (
    <>
      <InteractionPlane mousePos={mousePos} isHovered={isHovered} rippleFn={rippleFn} />
      <group ref={groupRef}>{children}</group>
    </>
  )
}

/* ══════════════════════════════════════════════════════════════
   AVATAR SCENE  (Canvas root)
   ══════════════════════════════════════════════════════════════ */
function SceneContent() {
  const mousePos  = useRef({ x: 0.5, y: 0.5 })
  const isHovered = useRef(false)
  const rippleFn  = useRef(null)

  return (
    <SceneGroup mousePos={mousePos} isHovered={isHovered} rippleFn={rippleFn}>
      <Lights />

      {/* Avatar image plane */}
      <Suspense fallback={null}>
        <AvatarPlane mousePos={mousePos} isHovered={isHovered} ripple={rippleFn} />
      </Suspense>

      {/* Neural network surrounding */}
      <NeuralNetwork />

      {/* Orbital rings — different tilt angles & speeds */}
      <OrbitalRing radius={1.35} tube={0.008} tiltX={0.6}  tiltZ={0.2}  color="#915EFF" speed={0.35}  opacity={0.55} />
      <OrbitalRing radius={1.60} tube={0.006} tiltX={1.1}  tiltZ={0.8}  color="#00d9ff" speed={-0.22} opacity={0.40} dotSize={0.035} />
      <OrbitalRing radius={1.85} tube={0.005} tiltX={0.3}  tiltZ={1.4}  color="#915EFF" speed={0.16}  opacity={0.25} dotSize={0.03} />

      {/* Data streams flowing upward */}
      <DataStream x={-1.8} z={0.4} color="#915EFF" speed={0.45} count={22} />
      <DataStream x={ 1.8} z={0.4} color="#00d9ff" speed={0.38} count={22} />
      <DataStream x={-0.9} z={1.6} color="#00d9ff" speed={0.52} count={16} />
      <DataStream x={ 0.9} z={1.6} color="#915EFF" speed={0.41} count={16} />

      {/* Floating tech badges */}
      {BADGE_DEFS.map((b) => (
        <FloatingBadge key={b.label} {...b} />
      ))}
    </SceneGroup>
  )
}

export default function AvatarScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <SceneContent />
    </Canvas>
  )
}
