"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { Preload, AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";

// Dynamically import the Nebula to avoid SSR Window issues completely
const NexusCore3D = dynamic<{ reduced?: boolean }>(
    () => import("./NexusCore3D").then((mod) => mod.default),
    { ssr: false }
);

const SceneWrapper = React.memo(function SceneWrapper() {
    const [isVisible, setIsVisible] = React.useState(true);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none w-full h-full">
            <Canvas
                camera={{ position: [0, 0, 10], fov: 45 }}
                style={{ width: "100%", height: "100%", pointerEvents: "auto" }}
                dpr={isLoginPage ? [1, 1] : [1, 2]}
                frameloop={isVisible ? "always" : "demand"}
                gl={{ 
                    antialias: !isLoginPage, 
                    powerPreference: "high-performance",
                    preserveDrawingBuffer: false,
                    alpha: true 
                }}
            >
                <Suspense fallback={null}>
                    {!isLoginPage && <AdaptiveDpr pixelated />}
                    <PerformanceMonitor onDecline={() => console.warn("Performance degradation: scaling down effects")} />
                    
                    <ambientLight intensity={0.4} />
                    <directionalLight position={[10, 20, 10]} intensity={1.5} color="#ffffff" />
                    <pointLight position={[-10, -10, -10]} intensity={1} color="#a855f7" />
                    <spotLight position={[0, 10, 0]} intensity={2} angle={0.5} penumbra={1} color="#3b82f6" />

                    <NexusCore3D reduced={isLoginPage} />

                    <fog attach="fog" args={["#030305", 5, 50]} />
                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    );
});

export default SceneWrapper;
