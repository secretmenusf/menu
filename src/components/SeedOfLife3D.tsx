import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface SeedOfLife3DProps {
  size?: number;
  className?: string;
}

const SeedOfLifeGeometry = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  const r = 0.35; // radius of each torus
  const tubeRadius = 0.02;
  
  // Calculate the 6 outer circle positions (60 degrees apart)
  const positions: [number, number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 - 90) * (Math.PI / 180);
    positions.push([r * Math.cos(angle), r * Math.sin(angle), 0]);
  }

  return (
    <group ref={groupRef}>
      {/* Center torus */}
      <mesh>
        <torusGeometry args={[r, tubeRadius, 16, 64]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* 6 outer tori forming the Seed of Life pattern */}
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <torusGeometry args={[r, tubeRadius, 16, 64]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
};

const SeedOfLife3D = ({ size = 28, className = "" }: SeedOfLife3DProps) => {
  return (
    <div 
      className={className}
      style={{ width: size, height: size }}
    >
      <Canvas
        camera={{ position: [0, 0, 2], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <SeedOfLifeGeometry />
      </Canvas>
    </div>
  );
};

export default SeedOfLife3D;
