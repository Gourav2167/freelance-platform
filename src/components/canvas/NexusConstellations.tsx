import { useRef, useMemo, useEffect } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useExploreStore, JobNode, FreelancerNode } from "@/lib/exploreStore";
import { useUserStore } from "@/lib/userStore";

export default function NexusConstellations() {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    
    // Selective selectors to prevent re-renders on every hover/selection
    const missions = useExploreStore(state => state.missions);
    const freelancers = useExploreStore(state => state.freelancers);
    const fetchMissions = useExploreStore(state => state.fetchMissions);
    const fetchFreelancers = useExploreStore(state => state.fetchFreelancers);
    const setHoveredJob = useExploreStore(state => state.setHoveredJob);
    const setSelectedJob = useExploreStore(state => state.setSelectedJob);
    const setHoveredFreelancer = useExploreStore(state => state.setHoveredFreelancer);
    const setSelectedFreelancer = useExploreStore(state => state.setSelectedFreelancer);
    const setCameraTarget = useExploreStore(state => state.setCameraTarget);
    
    const { role } = useUserStore();

    const isOrg = role === 'organization';

    useEffect(() => {
        if (isOrg) {
            fetchFreelancers();
        } else {
            fetchMissions();
        }
    }, [isOrg, fetchFreelancers, fetchMissions]);

    const data = isOrg ? freelancers : missions;
    const totalCount = data.length;

    const colorArray = useMemo(() => {
        const colors = new Float32Array(totalCount * 3);
        const color = new THREE.Color();

        data.forEach((node, i) => {
            if (node.category === 'frontend') color.setHex(0x3b82f6);
            else if (node.category === 'backend') color.setHex(0x10b981);
            else if (node.category === 'ai') color.setHex(0xa855f7);
            else if (node.category === 'design') color.setHex(0xf59e0b);
            else color.setHex(0x3b82f6); // Default blue
            
            color.toArray(colors, i * 3);
        });
        return colors;
    }, [data, totalCount]);

    useEffect(() => {
        if (!meshRef.current || totalCount === 0) return;
        console.log(`RENDER_CONSTELLATIONS: ${totalCount} nodes`);
        const dummy = new THREE.Object3D();
        data.forEach((node, i) => {
            dummy.position.copy(node.position);
            const scale = 1.2; // Increased from 0.5
            dummy.scale.set(scale, scale, scale);
            dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
        meshRef.current.computeBoundingSphere();
    }, [data, totalCount]);

    useFrame((state) => {
        if (meshRef.current) meshRef.current.rotation.y += 0.0002;
        const currentTarget = useExploreStore.getState().cameraTarget;
        if (currentTarget) {
            const offsetTarget = currentTarget.clone().add(new THREE.Vector3(0, 0, 8));
            state.camera.position.lerp(offsetTarget, 0.05);
            state.camera.lookAt(currentTarget);
        } else {
            // Stable orbit when no target
            const time = state.clock.elapsedTime * 0.1;
            state.camera.position.x = Math.sin(time) * 15;
            state.camera.position.y = Math.cos(time * 0.8) * 10;
            state.camera.position.z = Math.cos(time) * 15 + 10;
            state.camera.lookAt(0, 0, -30);
        }
    });

    const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        const instanceId = e.instanceId;
        if (instanceId !== undefined && data[instanceId]) {
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
        console.log("NODE_CLICKED", instanceId);
        if (instanceId !== undefined && data[instanceId]) {
            const node = data[instanceId];
            console.log("SELECTING_NODE", node);
            if (isOrg) setSelectedFreelancer(node as FreelancerNode);
            else setSelectedJob(node as JobNode);

            if (meshRef.current) {
                const worldPos = node.position.clone();
                worldPos.applyEuler(meshRef.current.rotation);
                setCameraTarget(worldPos);
            }
        }
    };

    if (totalCount === 0) return null;

    return (
        <instancedMesh
            ref={meshRef}
            args={[undefined, undefined, totalCount]}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onClick={handleClick}
        >
            <icosahedronGeometry args={[1, 0]}>
                <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
            </icosahedronGeometry>
            <meshStandardMaterial 
                vertexColors 
                roughness={0} 
                emissive="#ffffff" 
                emissiveIntensity={1.2} 
                metalness={1}
                transparent 
                opacity={0.95} 
            />
        </instancedMesh>
    );
}
