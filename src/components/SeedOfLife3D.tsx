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
      // Continuous rotation - faster spin
      groupRef.current.rotation.y = t * 0.8;

      // Subtle golden ratio vibration on z-axis
      groupRef.current.rotation.z = Math.sin(t * PHI * 0.3) * 0.02;

      // Subtle scale breathing based on phi
      const breathe = 1 + Math.sin(t * (1 / PHI) * 0.5) * 0.025;
      groupRef.current.scale.setScalar(breathe);
    }

    // Golden glow pulse using golden ratio harmonics - slightly softer
    if (materialRef.current) {
      const pulse1 = Math.sin(t * (1 / PHI) * 0.4);
      const pulse2 = Math.sin(t * (1 / (PHI * PHI)) * 0.6);
      const combined = 1.2 + (pulse1 * 0.3 + pulse2 * 0.2);
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

  // Golden glowing material with warm emission - softer
  const goldenMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: '#ffd700',
      emissive: '#e6a820',
      emissiveIntensity: 1.4,
      metalness: 0.25,
      roughness: 0.05,
      toneMapped: false,
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
      {/* Outer glow layer */}
      <div
        className="absolute animate-pulse-glow"
        style={{
          inset: '-25%',
          filter: 'blur(35px)',
          opacity: 0.5,
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 2.5], fov: 40 }}
          gl={{ alpha: true, antialias: true }}
          frameloop="always"
          dpr={[1, 1]}
        >
          <ambientLight intensity={3} />
          <Center>
            <SeedOfLifeGeometry />
          </Center>
        </Canvas>
      </div>
      {/* Inner glow layer */}
      <div
        className="absolute"
        style={{
          inset: '-12%',
          filter: 'blur(12px)',
          opacity: 0.35,
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 2.5], fov: 40 }}
          gl={{ alpha: true, antialias: true }}
          frameloop="always"
          dpr={[1, 1]}
        >
          <ambientLight intensity={2} />
          <Center>
            <SeedOfLifeGeometry />
          </Center>
        </Canvas>
      </div>
      {/* Main layer */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Canvas
          camera={{ position: [0, 0, 2.5], fov: 40 }}
          gl={{ alpha: true, antialias: true }}
          frameloop="always"
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 0, 4]} intensity={3.0} color="#ffffff" />
          <pointLight position={[2, 2, 2]} intensity={1.5} color="#ffffff" />
          <pointLight position={[-2, -2, 2]} intensity={1.5} color="#ffffff" />
          <Center>
            <SeedOfLifeGeometry />
          </Center>
        </Canvas>
      </div>
    </div>
  );
};

export default SeedOfLife3D;
