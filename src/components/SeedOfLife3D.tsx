import { Canvas, useFrame } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';

interface SeedOfLife3DProps {
  size?: number;
  className?: string;
}

const SeedOfLifeGeometry = () => {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const PHI = 1.618033988749; // Golden ratio

    if (groupRef.current) {
      // Slow rotation based on golden ratio
      groupRef.current.rotation.y = t * (1 / PHI) * 0.1;

      // Subtle golden ratio vibration on z-axis
      groupRef.current.rotation.z = Math.sin(t * PHI * 0.3) * 0.02;

      // Subtle scale breathing based on phi
      const breathe = 1 + Math.sin(t * (1 / PHI) * 0.5) * 0.015;
      groupRef.current.scale.setScalar(breathe);
    }

    // Gentle pulse effect using golden ratio harmonics
    if (materialRef.current) {
      const pulse1 = Math.sin(t * (1 / PHI) * 0.4);
      const pulse2 = Math.sin(t * (1 / (PHI * PHI)) * 0.6);
      const combined = 0.7 + (pulse1 * 0.2 + pulse2 * 0.1);
      materialRef.current.emissiveIntensity = combined;
    }
  });

  const r = 0.35;
  const tubeRadius = 0.025;

  const positions: [number, number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 - 90) * (Math.PI / 180);
    positions.push([r * Math.cos(angle), r * Math.sin(angle), 0]);
  }

  // Pure white glowing material
  const goldenMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      emissive: '#ffffff',
      emissiveIntensity: 0.8,
      metalness: 0.3,
      roughness: 0.1,
    });
    return mat;
  }, []);

  // Store ref for animation
  useEffect(() => {
    materialRef.current = goldenMaterial;
  }, [goldenMaterial]);

  return (
    <group ref={groupRef}>
      {/* Center torus */}
      <mesh>
        <torusGeometry args={[r, tubeRadius, 32, 100]} />
        <primitive object={goldenMaterial} attach="material" />
      </mesh>

      {/* 6 outer tori */}
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <torusGeometry args={[r, tubeRadius, 32, 100]} />
          <primitive object={goldenMaterial} attach="material" />
        </mesh>
      ))}
    </group>
  );
};

const SeedOfLife3D = ({ size = 28, className = "" }: SeedOfLife3DProps) => {
  return (
    <div
      className={`${className}`}
      style={{
        width: size,
        height: size,
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        <Canvas
          camera={{ position: [0, 0, 2.5], fov: 40 }}
          gl={{ alpha: true, antialias: true }}
          frameloop="always"
          dpr={[1, 2]}
        >
          <ambientLight intensity={1.0} />
          <pointLight position={[0, 0, 5]} intensity={2.0} color="#ffffff" />
          <pointLight position={[3, 3, 3]} intensity={1.0} color="#ffffff" />
          <pointLight position={[-3, -3, 3]} intensity={1.0} color="#ffffff" />
          <Center>
            <SeedOfLifeGeometry />
          </Center>
        </Canvas>
      </div>
    </div>
  );
};

export default SeedOfLife3D;
