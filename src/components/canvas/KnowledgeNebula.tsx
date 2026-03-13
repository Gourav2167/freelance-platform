"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { globalState } from "@/lib/store";

// Register ScrollTrigger if not in SSR
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// Temporary mock data for shards
const SHARD_COUNT = 50;

export default function KnowledgeNebula() {
    const groupRef = useRef<THREE.Group>(null);
    const cameraPathRef = useRef<THREE.CatmullRomCurve3 | null>(null);

    // Generate random shard positions and orientations
    const shardsData = useMemo(() => {
        return Array.from({ length: SHARD_COUNT }).map((_, i) => {
            // Create a long nebula distribution along Z axis
            const z = (i / SHARD_COUNT) * -50 + 5;
            const radius = 4 + Math.random() * 6;
            const theta = Math.random() * Math.PI * 2;

            const x = Math.cos(theta) * radius;
            const y = Math.sin(theta) * radius + (Math.random() - 0.5) * 4;

            // Select color based on random category
            const categories = ['budget', 'tech', 'timeline', 'neutral'];
            const category = categories[Math.floor(Math.random() * categories.length)];

            let color = "#ffffff";
            if (category === 'budget') color = "#10b981"; // Emerald
            if (category === 'tech') color = "#3b82f6"; // Blue
            if (category === 'timeline') color = "#f59e0b"; // Amber

            return {
                position: new THREE.Vector3(x, y, z),
                rotation: new THREE.Euler(
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                ),
                scale: 0.5 + Math.random() * 1.5,
                color,
                category,
                id: i
            };
        });
    }, []);

    // Create a spline path for the camera to fly through
    useMemo(() => {
        const points = [];
        points.push(new THREE.Vector3(0, 0, 10)); // Start pos
        points.push(new THREE.Vector3(2, 1, 0));
        points.push(new THREE.Vector3(-2, -1, -10));
        points.push(new THREE.Vector3(3, 0, -20));
        points.push(new THREE.Vector3(-1, 2, -30));
        points.push(new THREE.Vector3(0, 0, -45)); // End pos

        cameraPathRef.current = new THREE.CatmullRomCurve3(points);
    }, []);

    useFrame((state) => {
        if (groupRef.current) {
            // Subtle continuous rotation of the whole nebula
            groupRef.current.rotation.z += 0.0005;

            // Handle redaction blurring
            const isRedacted = globalState.isRedacted;
            const targetRoughness = isRedacted ? 0.8 : 0.2;
            const targetTransmission = isRedacted ? 0.1 : 0.9;

            groupRef.current.children.forEach((child) => {
                child.traverse((obj) => {
                    if (obj instanceof THREE.Mesh) {
                        const mat = obj.material as THREE.MeshPhysicalMaterial;
                        if (mat) {
                            mat.roughness += (targetRoughness - mat.roughness) * 0.1;
                            mat.transmission += (targetTransmission - mat.transmission) * 0.1;
                        }
                    }
                });
            });
        }

        if (cameraPathRef.current) {
            if (globalState.focusTarget) {
                // Focus mode: Lerp camera to target
                const targetPos = globalState.focusTarget.clone().add(new THREE.Vector3(0, 0, 4));
                state.camera.position.lerp(targetPos, 0.05);
                state.camera.lookAt(globalState.focusTarget);
            } else {
                // Normal scroll mode
                const progress = globalState.scrollProgress; // 0 to 1
                // Avoid getting points exactly at 1 as getPointAt may complain
                const safeProgress = Math.min(Math.max(progress, 0), 0.99);
                const point = cameraPathRef.current.getPointAt(safeProgress);

                // Look slightly ahead on the spline
                const lookAtProgress = Math.min(safeProgress + 0.05, 1);
                const lookAtPoint = cameraPathRef.current.getPointAt(lookAtProgress);

                state.camera.position.lerp(point, 0.1);

                // Slerp rotation towards looking down the path
                const targetQuat = new THREE.Quaternion().setFromRotationMatrix(
                    new THREE.Matrix4().lookAt(state.camera.position, lookAtPoint, state.camera.up)
                );
                state.camera.quaternion.slerp(targetQuat, 0.1);
            }
        }
    });

    return (
        <group ref={groupRef}>
            {shardsData.map((data) => (
                <Float
                    key={data.id}
                    speed={1.5 + Math.random()}
                    rotationIntensity={1.5}
                    floatIntensity={2}
                    position={data.position.toArray() as [number, number, number]}
                    rotation={data.rotation.toArray() as [number, number, number]}
                >
                    <mesh
                        scale={data.scale}
                        onClick={(e) => {
                            e.stopPropagation();
                            // Set focus target to this shard's exact world position
                            const worldPos = new THREE.Vector3();
                            e.object.getWorldPosition(worldPos);
                            globalState.focusTarget = worldPos;
                        }}
                        onPointerOver={(e) => {
                            e.stopPropagation();
                            document.body.style.cursor = 'pointer';
                        }}
                        onPointerOut={(e) => {
                            e.stopPropagation();
                            document.body.style.cursor = 'auto';
                        }}
                    >
                        {/* Geometric Shards: Icosahedrons look like nice data crystals */}
                        <icosahedronGeometry args={[1, 0]} />
                        <meshPhysicalMaterial
                            color={new THREE.Color(data.color)}
                            transparent
                            opacity={0.8}
                            roughness={0.2} // Will be driven by useFrame
                            transmission={0.9} // Glass-like
                            thickness={1.5}
                            envMapIntensity={2}
                            clearcoat={1}
                            clearcoatRoughness={0.1}
                            onBeforeCompile={() => {
                                // We can use onBeforeCompile if needed, but simple property update is easier
                            }}
                        />
                    </mesh>
                </Float>
            ))}
        </group>
    );
}
