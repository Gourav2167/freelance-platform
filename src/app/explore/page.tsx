"use client";

import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import NexusOverlay from "@/components/explore/NexusOverlay";

// To avoid SSR Window mismatch
const NexusConstellations = dynamic(() => import("@/components/canvas/NexusConstellations"), {
    ssr: false,
});

export default function ExplorePage() {
    return (
        <div className="relative w-full h-full">
            {/* The 2D Overlay HUD */}
            <NexusOverlay />

            {/* The 3D Engine */}
            <Canvas
                camera={{ position: [0, 0, -30], fov: 60 }}
                style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
                dpr={[1, 2]}
            >
                <Suspense fallback={null}>
                    {/* Deep Space Lighting */}
                    <ambientLight intensity={0.1} color="#ffffff" />
                    <directionalLight position={[0, 40, 20]} intensity={1.5} color="#3b82f6" />
                    <pointLight position={[20, -10, -50]} intensity={2} color="#a855f7" distance={100} />

                    {/* The Constellations */}
                    <NexusConstellations />

                    {/* Deep Void Fog */}
                    <fog attach="fog" args={["#030305", 20, 100]} />
                </Suspense>
            </Canvas>
        </div>
    );
}
