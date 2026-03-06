import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Float, Text, Billboard } from "@react-three/drei";
import * as THREE from "three";

interface HotspotData {
  lat: number;
  lng: number;
  label: string;
  risk: number;
  flag: string;
}

const hotspots: HotspotData[] = [
  { lat: 35, lng: 105, label: "China", risk: 72, flag: "🇨🇳" },
  { lat: 24, lng: 54, label: "UAE", risk: 65, flag: "🇦🇪" },
  { lat: 9, lng: 8, label: "Nigeria", risk: 58, flag: "🇳🇬" },
  { lat: 15, lng: 101, label: "Thailand", risk: 45, flag: "🇹🇭" },
  { lat: 36, lng: 128, label: "S. Korea", risk: 38, flag: "🇰🇷" },
  { lat: -6, lng: 107, label: "Indonesia", risk: 42, flag: "🇮🇩" },
  { lat: 20, lng: 78, label: "India", risk: 52, flag: "🇮🇳" },
  { lat: 4, lng: -72, label: "Colombia", risk: 60, flag: "🇨🇴" },
  { lat: -23, lng: -46, label: "Brazil", risk: 35, flag: "🇧🇷" },
  { lat: 51, lng: 10, label: "Germany", risk: 12, flag: "🇩🇪" },
];

function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function GlobeCore() {
  const globeRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (globeRef.current) globeRef.current.rotation.y = t * 0.08;
    if (wireRef.current) wireRef.current.rotation.y = t * 0.08;
  });

  return (
    <group>
      {/* Inner solid globe */}
      <Sphere ref={globeRef} args={[1.5, 64, 64]}>
        <meshPhysicalMaterial
          color="#0D1117"
          metalness={0.3}
          roughness={0.7}
          transparent
          opacity={0.9}
          envMapIntensity={0.5}
        />
      </Sphere>

      {/* Wireframe overlay */}
      <Sphere ref={wireRef} args={[1.52, 32, 32]}>
        <meshBasicMaterial color="#1F6FEB" wireframe transparent opacity={0.15} />
      </Sphere>

      {/* Atmosphere glow */}
      <Sphere ref={glowRef} args={[1.65, 32, 32]}>
        <meshBasicMaterial color="#1F6FEB" transparent opacity={0.05} side={THREE.BackSide} />
      </Sphere>
    </group>
  );
}

function RiskHotspot({ data }: { data: HotspotData }) {
  const pos = latLngToVec3(data.lat, data.lng, 1.55);
  const ref = useRef<THREE.Group>(null);

  const color = useMemo(() => {
    if (data.risk > 60) return new THREE.Color("hsl(0, 72%, 63%)");
    if (data.risk > 35) return new THREE.Color("hsl(25, 87%, 59%)");
    return new THREE.Color("hsl(140, 60%, 48%)");
  }, [data.risk]);

  const scale = 0.02 + (data.risk / 100) * 0.04;

  useFrame((state) => {
    if (ref.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2 + data.risk) * 0.3 + 1;
      ref.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={pos}>
      {/* Core dot */}
      <mesh ref={ref}>
        <sphereGeometry args={[scale, 12, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[scale * 1.5, scale * 2.2, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Label */}
      <Billboard position={[0, scale * 4 + 0.05, 0]}>
        <Text fontSize={0.07} color="#E6EDF3" anchorX="center" anchorY="bottom">
          {data.label} ({data.risk}%)
        </Text>
      </Billboard>

      <pointLight color={color} intensity={0.3} distance={0.5} />
    </group>
  );
}

function ConnectionArcs() {
  const arcs = useMemo(() => {
    const result: THREE.BufferGeometry[] = [];
    for (let i = 0; i < hotspots.length - 1; i++) {
      if (hotspots[i].risk > 40 && hotspots[i + 1].risk > 40) {
        const start = latLngToVec3(hotspots[i].lat, hotspots[i].lng, 1.56);
        const end = latLngToVec3(hotspots[i + 1].lat, hotspots[i + 1].lng, 1.56);
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        mid.normalize().multiplyScalar(2.2);
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const points = curve.getPoints(32);
        result.push(new THREE.BufferGeometry().setFromPoints(points));
      }
    }
    return result;
  }, []);

  return (
    <group>
      {arcs.map((geo, i) => (
        <primitive key={i} object={new THREE.Line(geo, new THREE.LineBasicMaterial({ color: "#1F6FEB", transparent: true, opacity: 0.25 }))} />
      ))}
    </group>
  );
}

function OrbitalRing() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * 0.1;
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 6, 0, 0]}>
      <ringGeometry args={[1.9, 1.92, 64]} />
      <meshBasicMaterial color="#1F6FEB" transparent opacity={0.12} side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function RiskGlobe3D() {
  return (
    <div className="w-full h-[420px] rounded-lg overflow-hidden border border-border bg-background relative">
      <Canvas
        camera={{ position: [0, 1, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <fog attach="fog" args={["#0D1117", 6, 14]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 3, 5]} intensity={0.6} color="#58A6FF" />
        <directionalLight position={[-3, 2, -3]} intensity={0.2} color="#D2A8FF" />

        <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.2}>
          <GlobeCore />
          {hotspots.map((h) => (
            <RiskHotspot key={h.label} data={h} />
          ))}
          <ConnectionLines />
          <OrbitalRing />
        </Float>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/60 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-5 pointer-events-none">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
          Interactive 3D Risk Globe — Drag to Rotate
        </p>
      </div>
      <div className="absolute top-4 right-5 pointer-events-none flex gap-3">
        {[
          { label: "Critical >60%", cls: "bg-risk-critical" },
          { label: "Medium 35-60%", cls: "bg-risk-low" },
          { label: "Low <35%", cls: "bg-risk-clear" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className={`h-2 w-2 rounded-full ${l.cls}`} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}
