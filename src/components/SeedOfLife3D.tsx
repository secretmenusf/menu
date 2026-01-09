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
    if (groupRef.current) {
      // Smooth rotation around Y-axis
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }

    // Subtle pulse effect on emissive intensity
    if (materialRef.current) {
      const pulse = 0.3 + Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
      materialRef.current.emissiveIntensity = pulse;
    }
  });

  const r = 0.35;
  const tubeRadius = 0.025;

  const positions: [number, number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 - 90) * (Math.PI / 180);
    positions.push([r * Math.cos(angle), r * Math.sin(angle), 0]);
  }

  // Golden material with subtle glow
  const goldenMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: '#d4a574',
      emissive: '#c9a227',
      emissiveIntensity: 0.3,
      metalness: 0.6,
      roughness: 0.3,
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
          <ambientLight intensity={0.6} />
          <pointLight position={[0, 0, 5]} intensity={1.5} color="#fff8e7" />
          <pointLight position={[3, 3, 3]} intensity={0.6} color="#ffd700" />
          <pointLight position={[-3, -3, 3]} intensity={0.6} color="#ffd700" />
          <Center>
            <SeedOfLifeGeometry />
          </Center>
        </Canvas>
      </div>
    </div>
  );
};

export default SeedOfLife3D;
