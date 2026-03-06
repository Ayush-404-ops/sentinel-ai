import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshReflectorMaterial,
  OrbitControls,
  RoundedBox,
  Text,
} from "@react-three/drei";
import * as THREE from "three";

function ContainerBox() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15 + Math.PI * 0.15;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  const containerColor = new THREE.Color("hsl(215, 90%, 52%)");
  const accentColor = new THREE.Color("hsl(0, 72%, 63%)");

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} scale={1.2}>
        {/* Main body */}
        <RoundedBox args={[2.4, 1.2, 1]} radius={0.04} smoothness={4} position={[0, 0.6, 0]}>
          <meshPhysicalMaterial
            color={containerColor}
            metalness={0.7}
            roughness={0.2}
            clearcoat={0.8}
            clearcoatRoughness={0.1}
            envMapIntensity={1.5}
          />
        </RoundedBox>

        {/* Corrugation ridges */}
        {Array.from({ length: 8 }).map((_, i) => (
          <RoundedBox
            key={i}
            args={[0.03, 1.1, 0.92]}
            radius={0.01}
            smoothness={2}
            position={[-1.0 + i * 0.28, 0.6, 0.01]}
          >
            <meshPhysicalMaterial
              color={containerColor}
              metalness={0.8}
              roughness={0.15}
              clearcoat={1}
            />
          </RoundedBox>
        ))}

        {/* Door bars */}
        {[-0.15, 0.15].map((x, i) => (
          <RoundedBox key={`bar-${i}`} args={[0.04, 1.0, 0.06]} radius={0.01} position={[1.18, 0.6, x]}>
            <meshPhysicalMaterial color="#8B949E" metalness={0.9} roughness={0.1} />
          </RoundedBox>
        ))}

        {/* Risk indicator light */}
        <mesh position={[1.22, 1.05, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>

        {/* Glow around risk light */}
        <pointLight position={[1.22, 1.05, 0]} color={accentColor} intensity={0.5} distance={1} />

        {/* Container ID text */}
        <Text
          position={[0, 0.6, 0.52]}
          fontSize={0.12}
          color="#E6EDF3"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPVmUsaaDhw.woff2"
        >
          MSCU-7483920
        </Text>

        {/* Small risk label */}
        <Text
          position={[0, 0.35, 0.52]}
          fontSize={0.07}
          color="#F85149"
          anchorX="center"
          anchorY="middle"
        >
          ● CRITICAL RISK — 94/100
        </Text>
      </group>
    </Float>
  );
}

function ReflectiveFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[15, 15]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={0.8}
        mixStrength={0.6}
        roughness={0.8}
        depthScale={0.5}
        minDepthThreshold={0.4}
        maxDepthThreshold={1}
        color="#0D1117"
        metalness={0.6}
        mirror={0.5}
      />
    </mesh>
  );
}

function ParticleField() {
  const count = 80;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = Math.random() * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

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
      <pointsMaterial size={0.02} color="#58A6FF" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export default function ShippingContainer3D() {
  return (
    <div className="w-full h-[320px] rounded-lg overflow-hidden border border-border bg-background relative">
      <Canvas
        camera={{ position: [3, 2, 3], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <fog attach="fog" args={["#0D1117", 5, 15]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#58A6FF" />
        <directionalLight position={[-3, 3, -3]} intensity={0.3} color="#D2A8FF" />
        <spotLight position={[0, 5, 0]} intensity={0.5} angle={0.5} penumbra={1} color="#1F6FEB" />

        <ContainerBox />
        <ReflectiveFloor />
        <ParticleField />

        <Environment preset="city" />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>

      {/* Overlay gradient */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-5 pointer-events-none">
        <p className="text-xs text-muted-foreground">Real-time 3D Container Visualization</p>
      </div>
    </div>
  );
}
