"use client";

import { Search, TrendingUp, Users } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

export default function TalentSearch() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;
        
        const panels = containerRef.current.querySelectorAll(".talent-panel");
        if (panels.length > 0) {
            gsap.fromTo(panels,
                { x: 50, opacity: 0 },
                { x: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" }
            );
        }
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="space-y-4 w-80">
            {/* Search Module */}
            <div className="talent-panel glass-panel p-4 border-blue-500/20">
                <div className="flex items-center gap-3 mb-4">
                    <Search className="w-4 h-4 text-blue-400" />
                    <span className="text-[10px] text-neutral-400 font-black uppercase tracking-widest font-mono">Talent Discovery</span>
                </div>
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Search top freelancers..."
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-blue-500/50 transition-all outline-none"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-blue-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
                </div>
            </div>

            {/* Quick Stats Module */}
            <div className="talent-panel glass-panel p-4 border-blue-500/10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                        <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">Market Flow</span>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-neutral-400">Available Talent</span>
                        <span className="text-xs text-white font-mono">12,842</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-neutral-400">Avg. Response</span>
                        <span className="text-xs text-blue-400 font-mono">14m</span>
                    </div>
                </div>
            </div>

            {/* Active Links Module */}
            <div className="talent-panel glass-panel p-4 border-blue-500/10 hover:border-blue-500/30 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3 mb-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-[10px] text-neutral-300 font-bold uppercase tracking-widest">Active Connections</span>
                </div>
                <p className="text-[10px] text-neutral-500 group-hover:text-neutral-400 transition-colors">
                    You have 3 active freelancer negotiations in progress.
                </p>
                <div className="mt-3 flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-[8px] text-blue-400 font-bold">
                            {String.fromCharCode(64 + i)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
