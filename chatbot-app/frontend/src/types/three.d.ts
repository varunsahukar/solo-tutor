// Type definitions for @react-three/fiber and @react-three/drei
// These extend the existing types from the installed packages

import * as THREE from 'three'
import * as React from 'react'

// Extend the existing module declarations
declare module '@react-three/fiber' {
  // These should already be available from the installed package types
  // This declaration just ensures they're properly recognized
}

declare module '@react-three/drei' {
  // These should already be available from the installed package types
  // This declaration just ensures they're properly recognized
}

// Additional interfaces for our specific usage
interface ExtendedSphereProps {
  args?: [number, number, number];
  scale?: number | [number, number, number] | { x: number; y: number; z: number };
  ref?: React.Ref<THREE.Mesh>;
  children?: React.ReactNode;
  position?: [number, number, number];
}

interface ExtendedMeshDistortMaterialProps {
  color?: string;
  attach?: string;
  distort?: number;
  speed?: number;
  roughness?: number;
  metalness?: number;
  emissive?: string;
  emissiveIntensity?: number;
  children?: React.ReactNode;
}