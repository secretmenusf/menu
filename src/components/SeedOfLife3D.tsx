import { Canvas, useFrame } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/components/theme-provider';

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

    // Rainbow glow pulse - cycles through all colors
    if (materialRef.current) {
      const pulse1 = Math.sin(t * (1 / PHI) * 0.4);
      const pulse2 = Math.sin(t * (1 / (PHI * PHI)) * 0.6);
      const combined = 1.4 + (pulse1 * 0.4 + pulse2 * 0.3);
      materialRef.current.emissiveIntensity = combined;

      // Slow rainbow cycle through all hues
      const hue = (t * 0.03) % 1; // Full spectrum cycle
      const saturation = 0.5 + Math.sin(t * 0.5) * 0.2; // Richer saturation
      const color = new THREE.Color();
      color.setHSL(hue, saturation, 0.7);
      materialRef.current.emissive = color;

      // Also shift base color slightly for more vibrance
      const baseColor = new THREE.Color();
      baseColor.setHSL(hue, 0.15, 0.95);
      materialRef.current.color = baseColor;
    }
  });

  const r = 0.35;
  const tubeRadius = 0.025; // Thinner lines for more elegant look

  const positions: [number, number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 - 90) * (Math.PI / 180);
    positions.push([r * Math.cos(angle), r * Math.sin(angle), 0]);
  }

  // White/silver glowing material with ethereal emission
  const silverMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      emissive: '#d0d8ff',
      emissiveIntensity: 1.4,
      metalness: 0.4,
      roughness: 0.02,
      toneMapped: false,
    });
    return mat;
  }, []);

  // Store ref for animation
  useEffect(() => {
    materialRef.current = silverMaterial;
  }, [silverMaterial]);

  return (
    <group ref={groupRef}>
      {/* Center torus */}
      <mesh>
        <torusGeometry args={[r, tubeRadius, 32, 100]} />
        <primitive object={silverMaterial} attach="material" />
      </mesh>

      {/* 6 outer tori */}
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <torusGeometry args={[r, tubeRadius, 32, 100]} />
          <primitive object={silverMaterial} attach="material" />
        </mesh>
      ))}
    </group>
  );
};

// Golden glowing geometry for light mode - WITH ROTATION
const SeedOfLifeGeometryGold = () => {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Light mode: rotation, breathing, and golden glow pulse
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const PHI = 1.618033988749;

    if (groupRef.current) {
      // Continuous rotation - same speed as dark mode
      groupRef.current.rotation.y = t * 0.8;

      // Subtle golden ratio vibration on z-axis
      groupRef.current.rotation.z = Math.sin(t * PHI * 0.3) * 0.02;

      // Subtle scale breathing based on phi
      const breathe = 1 + Math.sin(t * (1 / PHI) * 0.5) * 0.025;
      groupRef.current.scale.setScalar(breathe);
    }

    // Golden glow pulse
    if (materialRef.current) {
      const pulse = 1.2 + Math.sin(t * 0.8) * 0.3;
      materialRef.current.emissiveIntensity = pulse;
    }
  });

  const r = 0.35;
  const tubeRadius = 0.028;

  const positions: [number, number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 - 90) * (Math.PI / 180);
    positions.push([r * Math.cos(angle), r * Math.sin(angle), 0]);
  }

  // Golden glowing material
  const goldMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: '#d4a574',
      emissive: '#ffd700',
      emissiveIntensity: 1.2,
      metalness: 0.8,
      roughness: 0.2,
      toneMapped: false,
    });
    return mat;
  }, []);

  // Store ref for animation
  useEffect(() => {
    materialRef.current = goldMaterial;
  }, [goldMaterial]);

  return (
    <group ref={groupRef}>
      <mesh>
        <torusGeometry args={[r, tubeRadius, 32, 100]} />
        <primitive object={goldMaterial} attach="material" />
      </mesh>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <torusGeometry args={[r, tubeRadius, 32, 100]} />
          <primitive object={goldMaterial} attach="material" />
        </mesh>
      ))}
    </group>
  );
};

const SeedOfLife3D = ({ size = 28, className = "" }: SeedOfLife3DProps) => {
  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check if we're in dark mode (either via theme context or dark class on document)
  useEffect(() => {
    const checkDarkMode = () => {
      const hasDarkClass = document.documentElement.classList.contains('dark') ||
        document.body.classList.contains('dark') ||
        !!document.querySelector('.dark');
      setIsDarkMode(theme === 'dark' || hasDarkClass);
    };

    checkDarkMode();

    // Observe class changes on document
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, [theme]);

  // In light mode, show golden glowing version
  if (!isDarkMode) {
    return (
      <div
        className={`${className}`}
        style={{
          width: size,
          height: size,
          position: 'relative',
        }}
      >
        {/* Outer golden glow layer */}
        <div
          className="absolute animate-pulse-glow"
          style={{
            inset: '-20%',
            filter: 'blur(25px)',
            opacity: 0.6,
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
              <SeedOfLifeGeometryGold />
            </Center>
          </Canvas>
        </div>
        {/* Inner golden glow layer */}
        <div
          className="absolute"
          style={{
            inset: '-10%',
            filter: 'blur(10px)',
            opacity: 0.4,
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 2.5], fov: 40 }}
            gl={{ alpha: true, antialias: true }}
            frameloop="always"
            dpr={[1, 1]}
          >
            <ambientLight intensity={1.5} />
            <Center>
              <SeedOfLifeGeometryGold />
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
            <ambientLight intensity={0.8} />
            <pointLight position={[0, 0, 4]} intensity={2.0} color="#ffd700" />
            <pointLight position={[2, 2, 3]} intensity={1.0} color="#ffaa00" />
            <pointLight position={[-2, -2, 3]} intensity={1.0} color="#ffcc00" />
            <Center>
              <SeedOfLifeGeometryGold />
            </Center>
          </Canvas>
        </div>
      </div>
    );
  }

  // In dark mode, show 3D animated version with glow
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
