"use client";

import { Zap, Activity, ShieldCheck, Globe } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

export default function MissionDeployment() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.fromTo(".mission-panel",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.2)" }
        );
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="space-y-4 w-72">
            <div className="mission-panel glass-panel p-5 border-blue-500/20 bg-blue-500/[0.02]">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
                        <span className="text-[10px] text-white font-black uppercase tracking-[0.2em]">Project HUD</span>
                    </div>
                    <div className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30">
                        <span className="text-[8px] text-blue-300 font-bold uppercase tracking-tight">Active</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <div className="flex justify-between mb-1">
                                <span className="text-[9px] text-neutral-500 uppercase font-bold">Signal Strength</span>
                                <span className="text-[9px] text-blue-400 font-mono tracking-tighter">98.2%</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[98%] shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-sm">
                            <span className="block text-[8px] text-neutral-500 uppercase font-bold mb-1">Uptime</span>
                            <span className="text-xs text-white font-mono font-bold">99.99%</span>
                        </div>
                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-sm">
                            <span className="block text-[8px] text-neutral-500 uppercase font-bold mb-1">Latency</span>
                            <span className="text-xs text-blue-400 font-mono font-bold">12ms</span>
                        </div>
                    </div>
                </div>
            </div>

            <button className="mission-panel w-full py-4 glass-panel border border-blue-500/30 hover:bg-blue-500/10 transition-all text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 group">
                <Globe className="w-3 h-3 text-blue-400 group-hover:rotate-180 transition-transform duration-700" />
                Post Project
            </button>
        </div>
    );
}
