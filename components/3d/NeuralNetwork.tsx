"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

function NeuralNodes({ count = 48 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);
  const positions = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.2 + Math.random() * 1.8;
      pts.push([
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ]);
    }
    return pts;
  }, [count]);

  const linePositions = useMemo(() => {
    const lines: number[] = [];
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const a = new THREE.Vector3(...positions[i]);
        const b = new THREE.Vector3(...positions[j]);
        if (a.distanceTo(b) < 2.1) {
          lines.push(...positions[i], ...positions[j]);
        }
      }
    }
    return new Float32Array(lines);
  }, [positions]);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.08;
    group.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.15) * 0.12;
  });

  return (
    <group ref={group}>
      {positions.map((pos, i) => (
        <Float
          key={i}
          speed={1.5 + (i % 5) * 0.2}
          rotationIntensity={0.2}
          floatIntensity={0.4}
        >
          <mesh position={pos}>
            <sphereGeometry args={[0.06 + (i % 3) * 0.02, 16, 16]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? "#4F46E5" : i % 3 === 1 ? "#06B6D4" : "#A5B4FC"}
              emissive={i % 3 === 0 ? "#4F46E5" : "#06B6D4"}
              emissiveIntensity={0.45}
              roughness={0.3}
            />
          </mesh>
        </Float>
      ))}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#4F46E5" transparent opacity={0.35} />
      </lineSegments>
    </group>
  );
}

function Particles({ count = 80 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#67E8F9"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

export function NeuralNetworkScene() {
  return (
    <div className="absolute inset-0 -z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#4F46E5" />
        <pointLight position={[-5, -2, 3]} intensity={0.8} color="#06B6D4" />
        <NeuralNodes />
        <Particles />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.4}
          maxPolarAngle={Math.PI / 1.6}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}
