import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

interface SeedOfLife3DProps {
  size?: number;
  className?: string;
}

const Particles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 50;
  
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities: THREE.Vector3[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      // Start particles near center
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.3;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
      
      // Outward velocity
      velocities.push(new THREE.Vector3(
        Math.cos(angle) * 0.01,
        Math.sin(angle) * 0.01,
        (Math.random() - 0.5) * 0.005
      ));
    }
    
    return { positions, velocities };
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      const positionAttr = particlesRef.current.geometry.attributes.position;
      const posArray = positionAttr.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3] += velocities[i].x;
        posArray[i * 3 + 1] += velocities[i].y;
        posArray[i * 3 + 2] += velocities[i].z;
        
        // Reset particles that go too far
        const dist = Math.sqrt(
          posArray[i * 3] ** 2 + 
          posArray[i * 3 + 1] ** 2 + 
          posArray[i * 3 + 2] ** 2
        );
        
        if (dist > 1.5) {
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * 0.2;
          posArray[i * 3] = Math.cos(angle) * radius;
          posArray[i * 3 + 1] = Math.sin(angle) * radius;
          posArray[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
        }
      }
      
      positionAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const SeedOfLifeGeometry = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  const r = 0.35;
  const tubeRadius = 0.025;
  
  const positions: [number, number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 - 90) * (Math.PI / 180);
    positions.push([r * Math.cos(angle), r * Math.sin(angle), 0]);
  }

  // Prismatic glass material
  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    metalness: 0.0,
    roughness: 0.0,
    transmission: 0.95,
    thickness: 0.5,
    envMapIntensity: 1.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    ior: 2.4,
    iridescence: 1.0,
    iridescenceIOR: 1.5,
    iridescenceThicknessRange: [100, 800],
    transparent: true,
    opacity: 0.9,
  }), []);

  return (
    <group ref={groupRef}>
      {/* Center torus */}
      <mesh>
        <torusGeometry args={[r, tubeRadius, 32, 100]} />
        <primitive object={glassMaterial} attach="material" />
      </mesh>
      
      {/* 6 outer tori */}
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <torusGeometry args={[r, tubeRadius, 32, 100]} />
          <primitive object={glassMaterial} attach="material" />
        </mesh>
      ))}
      
      <Particles />
    </group>
  );
};

const SeedOfLife3D = ({ size = 28, className = "" }: SeedOfLife3DProps) => {
  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* macOS-style glass blur background */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, transparent 70%)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          transform: 'scale(1.8)',
        }}
      />
      {/* Subtle pulsing glow */}
      <div 
        className="absolute inset-0 rounded-full animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(200,220,255,0.1) 40%, transparent 70%)',
          filter: 'blur(6px)',
          transform: 'scale(1.6)',
        }}
      />
      {/* Rainbow prismatic edge glow */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, rgba(255,100,100,0.15), rgba(255,200,100,0.15), rgba(100,255,100,0.15), rgba(100,200,255,0.15), rgba(200,100,255,0.15), rgba(255,100,100,0.15))',
          filter: 'blur(8px)',
          transform: 'scale(1.4)',
          animation: 'spin 8s linear infinite',
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 2], fov: 50 }}
        style={{ background: 'transparent', position: 'relative', zIndex: 1 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-5, -5, 5]} intensity={0.8} color="#aaccff" />
        <pointLight position={[0, 0, 5]} intensity={0.5} color="#ffaacc" />
        <SeedOfLifeGeometry />
      </Canvas>
    </div>
  );
};

export default SeedOfLife3D;
