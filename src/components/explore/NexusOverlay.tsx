"use client";

import { useExploreStore } from "@/lib/exploreStore";
import { Code, Server, Brain, PenTool, LayoutTemplate } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NexusOverlay() {
    const { hoveredJob, selectedJob } = useExploreStore();
    const router = useRouter();

    const getIcon = (category: string) => {
        switch (category) {
            case 'frontend': return <LayoutTemplate className="w-4 h-4 text-blue-400" />;
            case 'backend': return <Server className="w-4 h-4 text-emerald-400" />;
            case 'ai': return <Brain className="w-4 h-4 text-purple-400" />;
            case 'design': return <PenTool className="w-4 h-4 text-amber-400" />;
            default: return <Code className="w-4 h-4" />;
        }
    };

    const getBudgetLabel = (budget: string) => {
        switch (budget) {
            case 'low': return <span className="text-neutral-500 font-mono text-xs">$</span>;
            case 'medium': return <span className="text-neutral-300 font-mono text-xs">$$</span>;
            case 'high': return <span className="text-emerald-400 font-bold font-mono text-xs">$$$</span>;
            default: return null;
        }
    }

    return (
        <div className="fixed inset-0 pointer-events-none z-10 p-8 flex flex-col justify-between">
            {/* Top Bar / Search */}
            <div className="w-full flex justify-between items-start">
                <div className="glass-panel px-6 py-4 pointer-events-auto">
                    <h1 className="font-bold text-xl tracking-wider text-white">NEXUS DIRECTORY</h1>
                    <p className="text-neutral-400 text-sm mt-1">3,200 Active Projects</p>
                </div>

                <div className="glass-panel w-64 p-2 pointer-events-auto flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse ml-2" />
                    <input
                        type="text"
                        placeholder="Search constellation..."
                        className="bg-transparent border-none outline-none text-sm text-white w-full px-2 placeholder:text-neutral-500"
                    />
                </div>
            </div>

            {/* Dynamic Hover Tooltip - Positioned bottom right for now to avoid rapid mouse jumps */}
            {hoveredJob && !selectedJob && (
                <div className="absolute bottom-8 right-8 glass-panel p-4 w-64 transform translate-y-0 opacity-100 transition-all duration-200">
                    <div className="flex items-center gap-2 mb-2">
                        {getIcon(hoveredJob.category)}
                        <span className="text-xs uppercase tracking-widest text-neutral-400">{hoveredJob.category}</span>
                    </div>
                    <h3 className="text-white font-medium truncate">{hoveredJob.title}</h3>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                        <span className="text-xs text-neutral-500">Budget Match</span>
                        {getBudgetLabel(hoveredJob.budget)}
                    </div>
                </div>
            )}

            {/* Selected Job Action Panel */}
            {selectedJob && (
                <div className="absolute top-1/2 right-8 -translate-y-1/2 glass-panel p-6 w-80 pointer-events-auto border-emerald-500/30">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            {getIcon(selectedJob.category)}
                            <span className="text-xs uppercase tracking-widest text-emerald-400">Match Found</span>
                        </div>
                        <button
                            className="text-neutral-500 hover:text-white transition-colors text-xs"
                            onClick={() => useExploreStore.getState().setSelectedJob(null)}
                        >
                            [ Esc ]
                        </button>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">{selectedJob.title}</h2>
                    <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
                        Telemetry analysis indicates a 94% stack alignment. Client history is verified and payment methods are secure.
                    </p>

                    <button
                        onClick={() => router.push('/')}
                        className="w-full py-3 bg-white text-black font-semibold rounded hover:bg-emerald-400 hover:text-black transition-all duration-300"
                    >
                        APPROACH PROJECT
                    </button>
                </div>
            )}
        </div>
    );
}
