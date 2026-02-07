import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Torus, MeshDistortMaterial } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

/* =======================
   Animated Main Sphere
======================= */

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    meshRef.current.rotation.x = Math.sin(t * 0.4) * 0.2;
    meshRef.current.rotation.y = Math.sin(t * 0.3) * 0.2;

    const scale = 2 + Math.sin(t * 2) * 0.1;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <Sphere ref={meshRef} args={[1, 128, 128]}>
      <MeshDistortMaterial
        color="#00ff88"
        distort={0.35}
        speed={2}
        roughness={0.1}
        metalness={0.8}
        emissive="#00ff88"
        emissiveIntensity={0.25}
      />
    </Sphere>
  );
}

/* =======================
   Floating Wire Geometries
======================= */

function FloatingGeometries() {
  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    refs.current.forEach((mesh, i) => {
      if (!mesh) return;

      mesh.rotation.x = t * 0.2 + i;
      mesh.rotation.y = t * 0.15 + i;

      const r = 4 + Math.sin(t * 0.3 + i);
      mesh.position.x = Math.cos(t * 0.4 + i) * r;
      mesh.position.y = Math.sin(t * 0.3 + i) * 2;
      mesh.position.z = Math.sin(t * 0.2 + i) * r;
    });
  });

  return (
    <group>
      {[0, 1, 2, 3, 4].map((_, i) => (
        <Torus
          key={i}
          ref={(el) => (refs.current[i] = el)}
          args={[0.8, 0.25, 16, 100]}
        >
          <meshStandardMaterial
            color="#00ff88"
            wireframe
            transparent
            opacity={0.6}
            emissive="#00ff88"
            emissiveIntensity={0.15}
          />
        </Torus>
      ))}
    </group>
  );
}

/* =======================
   MAIN BACKGROUND EXPORT
======================= */

export default function Hero3DBackground() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.25} />

        <pointLight position={[10, 10, 10]} intensity={1.2} color="#00ff88" />
        <pointLight position={[-10, -10, -10]} intensity={0.6} color="#00ff88" />

        <AnimatedSphere />
        <FloatingGeometries />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.4}
        />
      </Canvas>
    </div>
  );
}
