"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";

export default function DataCoreHologram() {
    const coreRef = useRef<THREE.Mesh>(null);
    const ringRef1 = useRef<THREE.Mesh>(null);
    const ringRef2 = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Gentle hovering and rotation for the core
        if (coreRef.current) {
            coreRef.current.rotation.y = t * 0.2;
            coreRef.current.position.y = Math.sin(t * 0.5) * 0.2;
        }

        // Counter-rotating tech rings
        if (ringRef1.current && ringRef2.current) {
            ringRef1.current.rotation.x = t * 0.3;
            ringRef1.current.rotation.y = t * 0.1;

            ringRef2.current.rotation.x = -t * 0.2 + Math.PI / 4;
            ringRef2.current.rotation.y = -t * 0.4;
        }
    });

    return (
        <group position={[0, 0, 0]}>
            {/* The pulsing inner core */}
            <Sphere ref={coreRef} args={[1.5, 64, 64]}>
                <MeshDistortMaterial
                    color="#059669" // Emerald 600
                    envMapIntensity={1}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    metalness={0.8}
                    roughness={0.2}
                    distort={0.4}
                    speed={2}
                    wireframe={false}
                    transparent
                    opacity={0.8}
                />
            </Sphere>

            {/* Orbital Ring 1 */}
            <mesh ref={ringRef1}>
                <torusGeometry args={[2.2, 0.02, 16, 100]} />
                <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2} transparent opacity={0.5} />
            </mesh>

            {/* Orbital Ring 2 */}
            <mesh ref={ringRef2}>
                <torusGeometry args={[2.8, 0.01, 16, 100]} />
                <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={1.5} transparent opacity={0.3} />
            </mesh>

            {/* Core Glow */}
            <pointLight distance={10} intensity={2} color="#10b981" />
        </group>
    );
}
