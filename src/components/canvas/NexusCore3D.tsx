"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeshDistortMaterial, Float, Points, PointMaterial } from "@react-three/drei";
import { useUserStore } from "@/lib/userStore";

export default function NexusCore3D({ reduced = false }: { reduced?: boolean }) {
    const { role } = useUserStore();
    const isOrg = role === 'organization';

    const coreRef = useRef<THREE.Mesh>(null);
    const wireframeRef = useRef<THREE.Mesh>(null);
    const pointsRef = useRef<THREE.Points>(null);

    const primaryColor = isOrg ? "#3b82f6" : "#10b981"; // Blue or Emerald
    const secondaryColor = isOrg ? "#8b5cf6" : "#059669"; // Purple or darker Emerald

    // Generate random particles for the surrounding nebula
    const [positions] = useMemo(() => {
        const count = reduced ? 800 : 3000;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = reduced ? 8 + Math.random() * 15 : 12 + Math.random() * 25; 
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        }
        return [positions];
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        
        // Morphing inner core rotation
        if (coreRef.current) {
            coreRef.current.rotation.y = t * 0.15;
            coreRef.current.rotation.x = t * 0.1;
        }
        
        // Counter-rotating outer wireframe
        if (wireframeRef.current) {
            wireframeRef.current.rotation.y = -t * 0.1;
            wireframeRef.current.rotation.z = t * 0.05;
        }
        
        // Slow particle orbit
        if (pointsRef.current) {
            pointsRef.current.rotation.y = t * 0.03;
            pointsRef.current.rotation.x = t * 0.01;
        }
    });

    return (
        <group position={[0, 0, -35]}>
            {/* Inner dynamic morphing core */}
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
                <mesh ref={coreRef}>
                    <icosahedronGeometry args={[6, 4]} />
                    <MeshDistortMaterial
                        color={primaryColor}
                        emissive={primaryColor}
                        emissiveIntensity={0.4}
                        wireframe={false}
                        distort={0.3}
                        speed={2}
                        roughness={0.2}
                        metalness={0.8}
                        transparent
                        opacity={0.8}
                    />
                </mesh>
            </Float>

            {/* Outer geometric wireframe shell */}
            <mesh ref={wireframeRef}>
                <icosahedronGeometry args={[9, 1]} />
                <meshStandardMaterial
                    color={secondaryColor}
                    wireframe={true}
                    transparent
                    opacity={0.15}
                    emissive={secondaryColor}
                    emissiveIntensity={0.8}
                />
            </mesh>

            {/* Surrounding particle nebula */}
            <Points ref={pointsRef} positions={positions} stride={3}>
                <PointMaterial
                    transparent
                    color={primaryColor}
                    size={0.12}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.4}
                    blending={THREE.AdditiveBlending}
                />
            </Points>

            {/* Ambient Lighting for the core to pop against the dark background */}
            <pointLight position={[0, 0, 0]} intensity={3} color={primaryColor} distance={60} />
            <ambientLight intensity={0.1} />
        </group>
    );
}
