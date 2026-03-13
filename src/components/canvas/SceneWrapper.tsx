"use client";

import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

// Dynamically import the Nebula to avoid SSR Window issues completely
const KnowledgeNebula = dynamic(() => import("./KnowledgeNebula"), {
    ssr: false,
});

export default function SceneWrapper() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none w-full h-full bg-[#030305]">
            {/* We allow pointer events on canvas itself if needed, but wrapper is pointer-events-none
          Actually, we want to click on shards, so canvas must have pointer-events-auto */}
            <Canvas
                camera={{ position: [0, 0, 10], fov: 45 }}
                style={{ width: "100%", height: "100%", pointerEvents: "auto" }}
                dpr={[1, 2]}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.4} />
                    <directionalLight position={[10, 20, 10]} intensity={1.5} color="#ffffff" />
                    <pointLight position={[-10, -10, -10]} intensity={1} color="#a855f7" />
                    <spotLight position={[0, 10, 0]} intensity={2} angle={0.5} penumbra={1} color="#3b82f6" />

                    <KnowledgeNebula />

                    {/* subtle fog matching background */}
                    <fog attach="fog" args={["#030305", 5, 30]} />
                </Suspense>
            </Canvas>
        </div>
    );
}
