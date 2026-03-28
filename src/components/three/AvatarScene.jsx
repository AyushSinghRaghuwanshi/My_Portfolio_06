/**
 * AvatarScene.jsx — robust version
 * Fixes: texture error handling, defensive useFrame guards,
 *        React ErrorBoundary, stable geometry refs.
 */

import {
  useRef, useMemo, useState, useEffect, Suspense, Component,
} from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { Html, shaderMaterial, Torus, Sphere } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

/* ══════════════════════════════════════════════════════════════
   ERROR BOUNDARY  — catches any R3F / WebGL crash gracefully
   ══════════════════════════════════════════════════════════════ */
class CanvasErrorBoundary extends Component {
  state = { error: false }
  static getDerivedStateFromError() { return { error: true } }
  render() {
    if (this.state.error) return (
      <div className="flex items-center justify-center w-full h-full opacity-30 text-primary text-xs font-mono">
        3D unavailable
      </div>
    )
    return this.props.children
  }
}

/* ══════════════════════════════════════════════════════════════
   SAFE TEXTURE HOOK  (PNG → SVG fallback, never throws)
   ══════════════════════════════════════════════════════════════ */
function useAvatarTexture() {
  const [tex, setTex] = useState(null)
  useEffect(() => {
    let alive = true
    const loader = new THREE.TextureLoader()
    loader.load(
      '/avatar.png',
      (t) => { if (alive) { t.colorSpace = THREE.SRGBColorSpace; setTex(t) } },
      undefined,
      () => loader.load('/avatar.svg',
        (t) => { if (alive) { t.colorSpace = THREE.SRGBColorSpace; setTex(t) } },
      ),
    )
    return () => { alive = false }
  }, [])
  return tex
}

/* ══════════════════════════════════════════════════════════════
   HOLOGRAPHIC SHADER MATERIAL
   ══════════════════════════════════════════════════════════════ */
const HolographicAvatarMaterial = shaderMaterial(
  {
    uTexture:    new THREE.Texture(),
    uTime:       0,
    uHover:      0,
    uMouse:      new THREE.Vector2(0.5, 0.5),
    uRipple:     0,
    uRipplePos:  new THREE.Vector2(0.5, 0.5),
    uHasTexture: 0,
  },
  /* vertex */
  `varying vec2 vUv;
   void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  /* fragment */
  `uniform sampler2D uTexture;
   uniform float uTime,uHover,uRipple,uHasTexture;
   uniform vec2  uMouse,uRipplePos;
   varying vec2  vUv;
   void main(){
     vec2 uv=vUv;
     /* ripple */
     float rd=length(uv-uRipplePos);
     float rw=sin(rd*35.-uTime*8.)*uRipple*.016*smoothstep(.8,0.,rd);
     uv+=normalize(uv-uRipplePos+.001)*rw;
     /* chromatic aberration */
     float ab=(uHover*.009)+(uRipple*.005);
     float r=texture2D(uTexture,uv+vec2(ab,0.)).r;
     float g=texture2D(uTexture,uv).g;
     float b=texture2D(uTexture,uv-vec2(ab,0.)).b;
     float a=texture2D(uTexture,uv).a;
     vec4 col=vec4(r,g,b,a);
     /* scan lines */
     float sc=pow(sin(uv.y*110.+uTime*5.)*.5+.5,22.)*(0.18+uHover*.5+uRipple*.25);
     col.rgb+=vec3(.57,.37,1.)*sc;
     /* circular crop + edge glow */
     float dist=length(uv-.5)*2.;
     col.a*=1.-smoothstep(.55,1.,dist);
     col.rgb+=vec3(.57,.37,1.)*smoothstep(.45,.75,dist)*(0.45+uHover*.45)*.4;
     /* flicker */
     float fl=step(.97,sin(uTime*9.7)*.5+.5)*uHover;
     col.rgb=mix(col.rgb,vec3(0.,.85,1.),fl*.3);
     /* ripple flash */
     col.rgb+=vec3(.57,.37,1.)*uRipple*.2*smoothstep(.5,0.,rd);
     gl_FragColor=col;
   }`,
)
extend({ HolographicAvatarMaterial })

/* ══════════════════════════════════════════════════════════════
   AVATAR PLANE
   ══════════════════════════════════════════════════════════════ */
function AvatarPlane({ mousePos, isHovered, ripple }) {
  const matRef = useRef()
  const tex    = useAvatarTexture()

  useEffect(() => {
    if (matRef.current && tex) {
      matRef.current.uTexture    = tex
      matRef.current.uHasTexture = 1
    }
  }, [tex])

  useFrame(({ clock }) => {
    const m = matRef.current
    if (!m) return
    m.uTime  = clock.getElapsedTime()
    m.uHover = THREE.MathUtils.lerp(m.uHover, isHovered.current ? 1 : 0, 0.06)
    m.uMouse.set(mousePos.current.x, mousePos.current.y)
    if (m.uRipple > 0.001) m.uRipple = THREE.MathUtils.lerp(m.uRipple, 0, 0.035)
  })

  ripple.current = (x, y) => {
    const m = matRef.current
    if (!m) return
    m.uRipplePos.set(x, y)
    m.uRipple = 1
  }

  return (
    <mesh>
      <planeGeometry args={[2.2, 2.2]} />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <holographicAvatarMaterial ref={matRef} transparent depthWrite={false} />
    </mesh>
  )
}

/* ══════════════════════════════════════════════════════════════
   ORBITAL RING
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
   NEURAL NETWORK
   ══════════════════════════════════════════════════════════════ */
function NeuralNetwork() {
  const NODE_COUNT   = 30
  const CONNECT_DIST = 1.05

  const { basePosArr, linePos } = useMemo(() => {
    const base = new Float32Array(NODE_COUNT * 3)
    for (let i = 0; i < NODE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      const r     = 1.55 + Math.random() * 0.75
      base[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      base[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      base[i * 3 + 2] = r * Math.cos(phi)
    }
    const lines = []
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = base[i*3]   - base[j*3]
        const dy = base[i*3+1] - base[j*3+1]
        const dz = base[i*3+2] - base[j*3+2]
        if (Math.sqrt(dx*dx + dy*dy + dz*dz) < CONNECT_DIST) {
          lines.push(base[i*3], base[i*3+1], base[i*3+2])
          lines.push(base[j*3], base[j*3+1], base[j*3+2])
        }
      }
    }
    return { basePosArr: base, linePos: new Float32Array(lines) }
  }, [])

  const nodePos  = useMemo(() => new Float32Array(basePosArr), [basePosArr])
  const nodesRef = useRef()
  const linesRef = useRef()

  const offsets = useMemo(() =>
    Array.from({ length: NODE_COUNT }, (_, i) => ({
      sx: (Math.random() - 0.5) * 0.8,
      sy: (Math.random() - 0.5) * 0.8,
      ph: Math.random() * Math.PI * 2,
    })), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < NODE_COUNT; i++) {
      nodePos[i*3]     = basePosArr[i*3]     + Math.sin(t * offsets[i].sx + offsets[i].ph) * 0.06
      nodePos[i*3 + 1] = basePosArr[i*3 + 1] + Math.cos(t * offsets[i].sy + offsets[i].ph) * 0.06
    }
    if (nodesRef.current?.geometry?.attributes?.position) {
      nodesRef.current.geometry.attributes.position.array.set(nodePos)
      nodesRef.current.geometry.attributes.position.needsUpdate = true
    }
    if (linesRef.current?.material) {
      linesRef.current.material.opacity = 0.10 + Math.sin(t * 1.4) * 0.05
    }
  })

  return (
    <group>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePos, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#915EFF" transparent opacity={0.11} />
      </lineSegments>
      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array(nodePos), 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.042} color="#00d9ff" transparent opacity={0.8} sizeAttenuation />
      </points>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   DATA STREAM
   ══════════════════════════════════════════════════════════════ */
function DataStream({ x, z, count = 22, speed = 0.42, color }) {
  const ref = useRef()
  const pos = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i*3]     = x + (Math.random() - 0.5) * 0.07
      arr[i*3 + 1] = (Math.random() - 0.5) * 4
      arr[i*3 + 2] = z + (Math.random() - 0.5) * 0.07
    }
    return arr
  }, [x, z, count])

  useFrame((_, dt) => {
    if (!ref.current?.geometry?.attributes?.position) return
    const arr = ref.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      arr[i*3 + 1] += speed * dt
      if (arr[i*3 + 1] > 2.2) arr[i*3 + 1] = -2.2
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.028} color={color} transparent opacity={0.55} sizeAttenuation />
    </points>
  )
}

/* ══════════════════════════════════════════════════════════════
   FLOATING HTML BADGES
   ══════════════════════════════════════════════════════════════ */
const BADGE_DEFS = [
  { label: 'PyTorch',      pos: [-2.1,  1.1, 0.3], color: 'purple', delay: 0    },
  { label: 'LLMs',         pos: [ 2.1,  1.0, 0.3], color: 'cyan',   delay: 0.15 },
  { label: 'RAG',          pos: [ 2.2, -0.2, 0.2], color: 'purple', delay: 0.3  },
  { label: 'Azure AI',     pos: [-2.2, -0.3, 0.2], color: 'cyan',   delay: 0.45 },
  { label: 'Transformers', pos: [-1.5, -1.4, 0.4], color: 'purple', delay: 0.6  },
  { label: 'MLOps',        pos: [ 1.6, -1.4, 0.4], color: 'cyan',   delay: 0.75 },
  { label: 'NLP',          pos: [-0.4,  1.8, 0.5], color: 'purple', delay: 0.9  },
  { label: 'Python',       pos: [ 0.4,  1.8, 0.5], color: 'cyan',   delay: 1.05 },
]

function FloatingBadge({ label, pos, color, delay }) {
  const ref = useRef()
  const baseY = pos[1]
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = baseY + Math.sin(clock.getElapsedTime() * 0.9 + delay * 4) * 0.08
    }
  })
  const purple = color === 'purple'
  return (
    <group ref={ref} position={pos}>
      <Html center distanceFactor={9} zIndexRange={[10, 0]}>
        <motion.div
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 + delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            padding: '3px 10px', borderRadius: 999, fontSize: 11,
            fontWeight: 600, fontFamily: 'monospace', whiteSpace: 'nowrap',
            background:    purple ? 'rgba(145,94,255,0.15)' : 'rgba(0,217,255,0.12)',
            border:        purple ? '1px solid rgba(145,94,255,0.45)' : '1px solid rgba(0,217,255,0.40)',
            color:         purple ? '#c4b5fd' : '#67e8f9',
            boxShadow:     purple ? '0 0 12px rgba(145,94,255,0.35)' : '0 0 12px rgba(0,217,255,0.28)',
            backdropFilter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none',
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
  return (
    <mesh
      onPointerMove={(e) => {
        if (e.uv) { mousePos.current.x = e.uv.x; mousePos.current.y = e.uv.y }
        isHovered.current = true
      }}
      onPointerLeave={() => { isHovered.current = false }}
      onClick={(e) => { if (e.uv && rippleFn.current) rippleFn.current(e.uv.x, e.uv.y) }}
    >
      <planeGeometry args={[4.5, 4.5]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

/* ══════════════════════════════════════════════════════════════
   LIGHTS  (pulsing purple key light)
   ══════════════════════════════════════════════════════════════ */
function Lights() {
  const kRef = useRef()
  useFrame(({ clock }) => {
    if (kRef.current) kRef.current.intensity = 1.6 + Math.sin(clock.getElapsedTime() * 1.3) * 0.25
  })
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight ref={kRef} position={[2.5, 2, 2.5]}  color="#915EFF" intensity={1.6} />
      <pointLight              position={[-2.5,1.5,2]}  color="#00d9ff" intensity={1.2} />
      <pointLight              position={[0,-2.5,1]}    color="#3d1a8a" intensity={0.5} />
      <spotLight position={[0,4,3]} angle={0.5} penumbra={0.9} intensity={2} color="#c4b5fd" />
    </>
  )
}

/* ══════════════════════════════════════════════════════════════
   SCENE GROUP  (mouse-reactive rotation)
   ══════════════════════════════════════════════════════════════ */
function SceneGroup({ mousePos, isHovered, rippleFn }) {
  const groupRef = useRef()
  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y, (mousePos.current.x - 0.5) * 0.5, 0.04)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x, (mousePos.current.y - 0.5) * -0.4, 0.04)
  })

  return (
    <>
      <InteractionPlane mousePos={mousePos} isHovered={isHovered} rippleFn={rippleFn} />
      <group ref={groupRef}>
        <Lights />
        <AvatarPlane mousePos={mousePos} isHovered={isHovered} ripple={rippleFn} />
        <NeuralNetwork />
        <OrbitalRing radius={1.35} tube={0.008} tiltX={0.6}  tiltZ={0.2}  color="#915EFF" speed={0.35}  opacity={0.55} />
        <OrbitalRing radius={1.60} tube={0.006} tiltX={1.1}  tiltZ={0.8}  color="#00d9ff" speed={-0.22} opacity={0.40} dotSize={0.035} />
        <OrbitalRing radius={1.85} tube={0.005} tiltX={0.3}  tiltZ={1.4}  color="#915EFF" speed={0.16}  opacity={0.25} dotSize={0.03} />
        <DataStream x={-1.8} z={0.4} color="#915EFF" speed={0.45} />
        <DataStream x={ 1.8} z={0.4} color="#00d9ff" speed={0.38} />
        <DataStream x={-0.9} z={1.6} color="#00d9ff" speed={0.52} count={16} />
        <DataStream x={ 0.9} z={1.6} color="#915EFF" speed={0.41} count={16} />
        {BADGE_DEFS.map((b) => <FloatingBadge key={b.label} {...b} />)}
      </group>
    </>
  )
}

/* ══════════════════════════════════════════════════════════════
   ROOT — shared refs live here (outside Canvas to avoid re-init)
   ══════════════════════════════════════════════════════════════ */
function SceneContent() {
  const mousePos  = useRef({ x: 0.5, y: 0.5 })
  const isHovered = useRef(false)
  const rippleFn  = useRef(null)
  return <SceneGroup mousePos={mousePos} isHovered={isHovered} rippleFn={rippleFn} />
}

export default function AvatarScene() {
  return (
    <CanvasErrorBoundary>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 42 }}
        dpr={[1, 1.5]}          /* cap at 1.5 for perf */
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
      >
        <SceneContent />
      </Canvas>
    </CanvasErrorBoundary>
  )
}
