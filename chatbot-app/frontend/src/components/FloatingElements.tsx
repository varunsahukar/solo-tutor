import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function FloatingOrb({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.rotation.x = Math.sin(time) * 0.3;
      meshRef.current.rotation.y = Math.sin(time * 1.2) * 0.4;
      
      // More dynamic floating motion
      meshRef.current.position.x = position[0] + Math.sin(time * 0.7 + position[0]) * 0.5;
      meshRef.current.position.y = position[1] + Math.cos(time * 0.5 + position[1]) * 0.5;
      meshRef.current.position.z = position[2] + Math.sin(time * 0.3 + position[2]) * 0.5;
      
      // Pulsing scale
      const scale = 0.3 + Math.sin(time * 2) * 0.05;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.1}
          transparent={true}
          opacity={0.9}
        />
      </mesh>
    </Float>
  );
}

function FloatingTorus({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.rotation.x = Math.sin(time * 0.8) * 0.5;
      meshRef.current.rotation.y = Math.cos(time * 1.1) * 0.5;
      
      // Orbital motion
      const radius = 1.5;
      meshRef.current.position.x = position[0] + Math.cos(time * 0.6) * radius;
      meshRef.current.position.y = position[1] + Math.sin(time * 0.4) * radius;
      meshRef.current.position.z = position[2] + Math.sin(time * 0.3) * radius;
      
      // Pulsing scale
      const scale = 0.4 + Math.sin(time * 1.5) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.7} floatIntensity={1.2}>
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[0.4, 0.15, 16, 100]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.1}
          wireframe={true}
          transparent={true}
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
}

function FloatingText({ position, text }: { position: [number, number, number]; text: string }) {
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <Text
        position={position}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </Float>
  );
}

export default function FloatingElements() {
  return (
    <Canvas className="absolute inset-0 -z-10" camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00ff88" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
      <pointLight position={[0, 10, 5]} intensity={0.7} color="#0088ff" />
      <pointLight position={[0, -10, -5]} intensity={0.7} color="#ffaa00" />
      
      <FloatingOrb position={[-2, 1, 0]} color="#00ff88" />
      <FloatingOrb position={[2, -1, 0]} color="#ff00ff" />
      <FloatingOrb position={[0, 2, -1]} color="#0088ff" />
      <FloatingOrb position={[0, -2, 1]} color="#ffaa00" />
      
      <FloatingTorus position={[-3, 0, -2]} color="#00ff88" />
      <FloatingTorus position={[3, 0, 2]} color="#ff6bff" />
      <FloatingTorus position={[0, -3, -2]} color="#00ffff" />
      <FloatingTorus position={[0, 3, 2]} color="#ffff00" />
      
      <FloatingText position={[-1.5, 0, 0]} text="Learn" />
      <FloatingText position={[1.5, 0, 0]} text="Create" />
      <FloatingText position={[0, 0, -1]} text="Explore" />
    </Canvas>
  );
}