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
      // Slow, smooth rotation around Y-axis
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.25;
    }

    // Bright, slow pulse effect on emissive intensity
    if (materialRef.current) {
      const pulse = 0.6 + Math.sin(state.clock.elapsedTime * 0.5) * 0.4;
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

  // Bright golden material with strong glow
  const goldenMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: '#f0c675',
      emissive: '#ffd700',
      emissiveIntensity: 0.6,
      metalness: 0.7,
      roughness: 0.2,
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
          <ambientLight intensity={0.8} />
          <pointLight position={[0, 0, 5]} intensity={2.5} color="#fff8e7" />
          <pointLight position={[3, 3, 3]} intensity={1.2} color="#ffd700" />
          <pointLight position={[-3, -3, 3]} intensity={1.2} color="#ffd700" />
          <Center>
            <SeedOfLifeGeometry />
          </Center>
        </Canvas>
      </div>
    </div>
  );
};

export default SeedOfLife3D;
