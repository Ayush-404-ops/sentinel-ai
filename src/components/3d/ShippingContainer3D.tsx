import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshReflectorMaterial,
  OrbitControls,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { type RiskLevel } from "@/data/mockData";

interface Container3DProps {
  containerId?: string;
  riskScore?: number;
  riskLevel?: RiskLevel | "Clear";
}

function ContainerBox({ containerId = "MSCU-0000000", riskScore = 0, riskLevel = "Clear" }: Container3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const colors = {
    Critical: new THREE.Color("#F85149"),
    "Low Risk": new THREE.Color("#D29922"),
    Clear: new THREE.Color("#3FB950")
  };

  const activeColor = colors[riskLevel as keyof typeof colors] || colors.Clear;

  useFrame((state) => {
    if (groupRef.current) {
      // Slow constant rotation
      groupRef.current.rotation.y += 0.005;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05 + 0.5;
    }
    // Pulsing effect for the glow
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5;
      glowRef.current.scale.set(1 + pulse * 0.1, 1, 1 + pulse * 0.1);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.15 + pulse * 0.1;
    }
  });

  const containerColor = new THREE.Color("#1A202C");

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <group>
          {/* Main body */}
          <RoundedBox args={[2.4, 1.2, 1]} radius={0.04} smoothness={4} position={[0, 0.6, 0]}>
            <meshPhysicalMaterial
              color={containerColor}
              metalness={0.7}
              roughness={0.2}
              clearcoat={0.8}
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
              />
            </RoundedBox>
          ))}

          {/* Door bars */}
          {[-0.15, 0.15].map((x, i) => (
            <RoundedBox key={`bar-${i}`} args={[0.04, 1.0, 0.06]} radius={0.01} position={[1.18, 0.6, x]}>
              <meshPhysicalMaterial color="#8B949E" metalness={0.9} roughness={0.1} />
            </RoundedBox>
          ))}

          {/* Risk indicator light (Pulsing Intensity) */}
          <mesh position={[1.22, 1.05, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial
              color={activeColor}
              emissive={activeColor}
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>

          {/* Point light for the pulse glow */}
          <pointLight position={[1.22, 1.05, 0]} color={activeColor} intensity={0.5} distance={1} />
        </group>
      </Float>

      {/* Ground Glow Shadow */}
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
        <circleGeometry args={[2.5, 32]} />
        <meshBasicMaterial color={activeColor} transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

function ReflectiveFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.41, 0]}>
      <planeGeometry args={[20, 20]} />
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

function StarField() {
  const count = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#ffffff" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

export default function ShippingContainer3D({ containerId, riskScore, riskLevel }: Container3DProps) {
  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden bg-[#0D1117] relative border border-[#21262D]">
      {/* Grid Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{ backgroundImage: "linear-gradient(#21262D 1px, transparent 1px), linear-gradient(90deg, #21262D 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <Canvas
        camera={{ position: [4, 2, 4], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <fog attach="fog" args={["#0D1117", 2, 10]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 10, 5]} intensity={0.5} color="#58A6FF" />

        <Box containerId={containerId} riskScore={riskScore} riskLevel={riskLevel} />
        <ReflectiveFloor />
        <StarField />

        <Environment preset="night" />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>

      {/* Floating UI HUD */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center pt-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center select-none"
        >
          <h2 className="text-[#58A6FF] font-mono-data text-2xl tracking-widest drop-shadow-[0_0_8px_rgba(88,166,255,0.4)]">
            {containerId || "SCANNING..."}
          </h2>
          <div className="mt-2 flex items-center gap-2 px-3 py-1 bg-black/40 border border-[#21262D] rounded-full backdrop-blur-md">
            <span className={`h-2 w-2 rounded-full animate-pulse ${riskLevel === "Critical" ? "bg-[#F85149]" : riskLevel === "Low Risk" ? "bg-[#D29922]" : "bg-[#3FB950]"
              }`} />
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9D1D9]">
              {riskLevel || "Clear"} Risk — {riskScore}/100
            </span>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-4 left-5 pointer-events-none">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest">Real-time 3D Container Visualization</p>
      </div>
    </div>
  );
}

const Box = ContainerBox;
