"use client";

import { useRef, useMemo } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useExploreStore, JobNode } from "@/lib/exploreStore";

const CLUSTER_COUNT = 4; // 4 categories
const STARS_PER_CLUSTER = 800;
const TOTAL_STARS = CLUSTER_COUNT * STARS_PER_CLUSTER;

// Generate cluster centers
const clusterCenters = [
    new THREE.Vector3(20, 10, -30),
    new THREE.Vector3(-25, -15, -40),
    new THREE.Vector3(15, -20, -20),
    new THREE.Vector3(-10, 25, -50),
];

const categories: JobNode['category'][] = ['frontend', 'backend', 'ai', 'design'];
const budgets: JobNode['budget'][] = ['low', 'medium', 'high'];

export default function NexusConstellations() {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const { setHoveredJob, setCameraTarget, setSelectedJob } = useExploreStore();

    // Generate strict deterministic data for the instanced mesh
    const { jobData, colorArray } = useMemo(() => {
        const jobs: JobNode[] = [];
        const colors = new Float32Array(TOTAL_STARS * 3);
        const color = new THREE.Color();

        for (let c = 0; c < CLUSTER_COUNT; c++) {
            const center = clusterCenters[c];
            const category = categories[c];

            for (let i = 0; i < STARS_PER_CLUSTER; i++) {
                const index = c * STARS_PER_CLUSTER + i;

                // Globular cluster distribution formula
                const r = Math.pow(Math.random(), 3) * 15; // Deeper concentration at center
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);

                const x = center.x + r * Math.sin(phi) * Math.cos(theta);
                const y = center.y + r * Math.sin(phi) * Math.sin(theta);
                const z = center.z + r * Math.cos(phi);

                const position = new THREE.Vector3(x, y, z);
                const budget = budgets[Math.floor(Math.random() * budgets.length)];

                // Color picking based on category
                if (category === 'frontend') color.setHex(0x3b82f6); // Blue
                else if (category === 'backend') color.setHex(0x10b981); // Emerald
                else if (category === 'ai') color.setHex(0xa855f7); // Purple
                else if (category === 'design') color.setHex(0xf59e0b); // Amber

                color.toArray(colors, index * 3);

                jobs.push({
                    id: index,
                    title: `Project ${index.toString(16).toUpperCase()}`,
                    category,
                    budget,
                    position
                });
            }
        }
        return { jobData: jobs, colorArray: colors };
    }, []);

    // Set matrices on mount
    useMemo(() => {
        if (!meshRef.current) return;
        const dummy = new THREE.Object3D();

        jobData.forEach((job, i) => {
            dummy.position.copy(job.position);

            // Random scales
            const scale = Math.random() * 0.5 + 0.1;
            dummy.scale.set(scale, scale, scale);

            // Random rotations
            dummy.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [jobData]);

    useFrame((state) => {
        if (meshRef.current) {
            // Slow majestic galaxy rotation
            meshRef.current.rotation.y += 0.0002;
        }

        // Camera Lerp
        const currentTarget = useExploreStore.getState().cameraTarget;
        if (currentTarget) {
            // Swoop towards the selected target
            // Pull the camera slightly back and up from the target
            const offsetTarget = currentTarget.clone().add(new THREE.Vector3(0, 0, 5));
            state.camera.position.lerp(offsetTarget, 0.05);
            state.camera.lookAt(currentTarget);
        } else {
            // Default ambient sway if no target
            state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 2;
            state.camera.position.y = Math.cos(state.clock.elapsedTime * 0.1) * 2;
            state.camera.lookAt(0, 0, -30);
        }
    });

    const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        const instanceId = e.instanceId;
        if (instanceId !== undefined) {
            setHoveredJob(jobData[instanceId]);
        }
    };

    const handlePointerOut = () => {
        document.body.style.cursor = 'auto';
        setHoveredJob(null);
    };

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        const instanceId = e.instanceId;
        if (instanceId !== undefined) {
            const job = jobData[instanceId];
            setSelectedJob(job);

            // The position is relative to the mesh, need to calculate world pos based on mesh rotation
            if (meshRef.current) {
                const worldPos = job.position.clone();
                worldPos.applyEuler(meshRef.current.rotation);
                setCameraTarget(worldPos);
            }
        }
    };

    return (
        <instancedMesh
            ref={meshRef}
            args={[null as any, null as any, TOTAL_STARS]}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onClick={handleClick}
        >
            <icosahedronGeometry args={[1, 0]}>
                <instancedBufferAttribute
                    attach="attributes-color"
                    args={[colorArray, 3]}
                />
            </icosahedronGeometry>
            <meshStandardMaterial
                vertexColors
                roughness={0.2}
                envMapIntensity={1}
                transparent
                opacity={0.9}
            />
        </instancedMesh>
    );
}
