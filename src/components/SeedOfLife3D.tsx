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
  const orbitRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.7;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.35) * 0.12;
    }

    if (orbitRef.current) {
      const t = state.clock.elapsedTime * 1.2;
      orbitRef.current.position.set(
        Math.cos(t) * 0.6,
        Math.sin(t) * 0.6,
        Math.sin(t * 0.7) * 0.2
      );
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

      <mesh ref={orbitRef}>
        <sphereGeometry args={[0.035, 24, 24]} />
        <meshStandardMaterial color="#f8f8ff" emissive="#ffffff" emissiveIntensity={1.2} />
      </mesh>
      
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
      {/* Subtle background glow */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%)',
          transform: 'scale(1.5)',
        }}
      />
      {/* Very subtle rainbow edge */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, rgba(255,100,100,0.08), rgba(255,200,100,0.08), rgba(100,255,100,0.08), rgba(100,200,255,0.08), rgba(200,100,255,0.08), rgba(255,100,100,0.08))',
          filter: 'blur(4px)',
          transform: 'scale(1.3)',
          animation: 'spin 12s linear infinite',
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 2], fov: 50 }}
        style={{ background: 'transparent', position: 'relative', zIndex: 1 }}
        gl={{ alpha: true, antialias: true }}
        frameloop="always"
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[5, 5, 5]} intensity={1.6} color="#ffffff" />
        <pointLight position={[-5, -5, 5]} intensity={0.8} color="#ffffff" />
        <pointLight position={[0, 0, 5]} intensity={0.6} color="#ffffff" />
        <SeedOfLifeGeometry />
      </Canvas>
    </div>
  );
};

export default SeedOfLife3D;
