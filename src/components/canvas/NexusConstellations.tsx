import { useRef, useMemo } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useExploreStore, JobNode, FreelancerNode } from "@/lib/exploreStore";
import { useUserStore } from "@/lib/userStore";

const CLUSTER_COUNT = 4; // 4 categories
const STARS_PER_CLUSTER = 800;
const TOTAL_STARS = CLUSTER_COUNT * STARS_PER_CLUSTER;

const clusterCenters = [
    new THREE.Vector3(20, 10, -30),
    new THREE.Vector3(-25, -15, -40),
    new THREE.Vector3(15, -20, -20),
    new THREE.Vector3(-10, 25, -50),
];

const categories: ('frontend' | 'backend' | 'ai' | 'design')[] = ['frontend', 'backend', 'ai', 'design'];
const budgets: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
const levels = ['Junior', 'Mid-Level', 'Senior', 'Lead'];

export default function NexusConstellations() {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const { setHoveredJob, setSelectedJob, setHoveredFreelancer, setSelectedFreelancer, setCameraTarget } = useExploreStore();
    const { role } = useUserStore();

    const isOrg = role === 'organization';

    const { data, colorArray } = useMemo(() => {
        const nodes: (JobNode | FreelancerNode)[] = [];
        const colors = new Float32Array(TOTAL_STARS * 3);
        const color = new THREE.Color();

        for (let c = 0; c < CLUSTER_COUNT; c++) {
            const center = clusterCenters[c];
            const category = categories[c];

            for (let i = 0; i < STARS_PER_CLUSTER; i++) {
                const index = c * STARS_PER_CLUSTER + i;
                const r = Math.pow(Math.random(), 3) * 15;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);

                const x = center.x + r * Math.sin(phi) * Math.cos(theta);
                const y = center.y + r * Math.sin(phi) * Math.sin(theta);
                const z = center.z + r * Math.cos(phi);
                const position = new THREE.Vector3(x, y, z);

                if (isOrg) {
                    const level = levels[Math.floor(Math.random() * levels.length)];
                    nodes.push({
                        id: index,
                        name: `Freelancer ${index.toString(16).toUpperCase()}`,
                        role: `${level} ${category.charAt(0).toUpperCase() + category.slice(1)} Engineer`,
                        level,
                        category,
                        position
                    } as FreelancerNode);
                } else {
                    const budget = budgets[Math.floor(Math.random() * budgets.length)];
                    nodes.push({
                        id: index,
                        title: `Project ${index.toString(16).toUpperCase()}`,
                        category,
                        budget,
                        position
                    } as JobNode);
                }

                // Color based on category
                if (category === 'frontend') color.setHex(0x3b82f6); // Blue
                else if (category === 'backend') color.setHex(0x10b981); // Emerald
                else if (category === 'ai') color.setHex(0xa855f7); // Purple
                else if (category === 'design') color.setHex(0xf59e0b); // Amber
                color.toArray(colors, index * 3);
            }
        }
        return { data: nodes, colorArray: colors };
    }, [isOrg]);

    useMemo(() => {
        if (!meshRef.current) return;
        const dummy = new THREE.Object3D();
        data.forEach((node, i) => {
            dummy.position.copy(node.position);
            const scale = Math.random() * 0.5 + 0.1;
            dummy.scale.set(scale, scale, scale);
            dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [data]);

    useFrame((state) => {
        if (meshRef.current) meshRef.current.rotation.y += 0.0002;
        const currentTarget = useExploreStore.getState().cameraTarget;
        if (currentTarget) {
            const offsetTarget = currentTarget.clone().add(new THREE.Vector3(0, 0, 5));
            state.camera.position.lerp(offsetTarget, 0.05);
            state.camera.lookAt(currentTarget);
        } else {
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
            if (isOrg) setHoveredFreelancer(data[instanceId] as FreelancerNode);
            else setHoveredJob(data[instanceId] as JobNode);
        }
    };

    const handlePointerOut = () => {
        document.body.style.cursor = 'auto';
        setHoveredJob(null);
        setHoveredFreelancer(null);
    };

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        const instanceId = e.instanceId;
        if (instanceId !== undefined) {
            const node = data[instanceId];
            if (isOrg) setSelectedFreelancer(node as FreelancerNode);
            else setSelectedJob(node as JobNode);

            if (meshRef.current) {
                const worldPos = node.position.clone();
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
                <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
            </icosahedronGeometry>
            <meshStandardMaterial vertexColors roughness={0.2} transparent opacity={0.9} />
        </instancedMesh>
    );
}
