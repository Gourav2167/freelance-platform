import { useExploreStore } from "@/lib/exploreStore";
import { useUserStore } from "@/lib/userStore";
import { Code, Server, Brain, PenTool, LayoutTemplate, UserCheck, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NexusOverlay() {
    const { hoveredJob, selectedJob, hoveredFreelancer, selectedFreelancer } = useExploreStore();
    const { role } = useUserStore();
    const router = useRouter();

    const isOrg = role === 'organization';

    const getIcon = (category: string) => {
        switch (category) {
            case 'frontend': return <LayoutTemplate className="w-4 h-4 text-blue-400" />;
            case 'backend': return <Server className="w-4 h-4 text-emerald-400" />;
            case 'ai': return <Brain className="w-4 h-4 text-purple-400" />;
            case 'design': return <PenTool className="w-4 h-4 text-amber-400" />;
            default: return <Code className="w-4 h-4" />;
        }
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-10 p-8 flex flex-col justify-between">
            {/* Top Bar / Search */}
            <div className="w-full flex justify-between items-start">
                <div className="glass-panel px-6 py-4 pointer-events-auto border-white/5">
                    <h1 className="font-bold text-xl tracking-wider text-white uppercase font-outfit">
                        {isOrg ? "FREELANCER DIRECTORY" : "PROJECT MARKET"}
                    </h1>
                    <p className="text-neutral-500 text-[10px] font-mono mt-1 uppercase tracking-widest">
                        {isOrg ? "12,842 Active Freelancers" : "3,200 Available Projects"}
                    </p>
                </div>

                <div className={`glass-panel w-64 p-2 pointer-events-auto flex items-center gap-2 border-${isOrg ? 'blue' : 'emerald'}-500/20`}>
                    <div className={`w-3 h-3 rounded-full ${isOrg ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'} animate-pulse ml-2`} />
                    <input
                        type="text"
                        placeholder={isOrg ? "Search freelancers..." : "Search projects..."}
                        className="bg-transparent border-none outline-none text-xs text-white w-full px-2 placeholder:text-neutral-600 font-mono tracking-tighter"
                    />
                </div>
            </div>

            {/* Hover Tooltips */}
            {(hoveredJob || hoveredFreelancer) && !(selectedJob || selectedFreelancer) && (
                <div className="absolute bottom-8 right-8 glass-panel p-5 w-72 transform translate-y-0 opacity-100 transition-all duration-300 border-white/10 backdrop-blur-3xl shadow-2xl">
                    <div className="flex items-center gap-3 mb-3">
                        {getIcon(hoveredJob?.category || hoveredFreelancer?.category || '')}
                        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-black">
                            {hoveredJob ? hoveredJob.category : hoveredFreelancer?.level}
                        </span>
                    </div>
                    <h3 className="text-white font-black text-lg tracking-tight uppercase font-outfit">
                        {hoveredJob ? hoveredJob.title : hoveredFreelancer?.name}
                    </h3>
                    {hoveredFreelancer && (
                        <p className="text-[10px] text-neutral-500 font-mono mt-1">{hoveredFreelancer.role}</p>
                    )}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                        <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold">Signal Match</span>
                        <span className={`text-[10px] font-mono ${isOrg ? 'text-blue-400' : 'text-emerald-400'} font-black`}>94.8%</span>
                    </div>
                </div>
            )}

            {/* Selected Action Panel */}
            {(selectedJob || selectedFreelancer) && (
                <div className={`absolute top-1/2 right-8 -translate-y-1/2 glass-panel p-8 w-96 pointer-events-auto border-${isOrg ? 'blue' : 'emerald'}-500/30 backdrop-blur-3xl shadow-2xl hero-animate`}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            {isOrg ? <UserCheck className="w-5 h-5 text-blue-400" /> : <Zap className="w-5 h-5 text-emerald-400" />}
                            <span className={`text-[10px] uppercase tracking-[0.3em] font-black ${isOrg ? 'text-blue-400' : 'text-emerald-400'}`}>
                                {isOrg ? "Freelancer Profile" : "Project Details"}
                            </span>
                        </div>
                        <button
                            className="text-neutral-600 hover:text-white transition-colors text-[10px] font-mono font-bold"
                            onClick={() => {
                                useExploreStore.getState().setSelectedJob(null);
                                useExploreStore.getState().setSelectedFreelancer(null);
                            }}
                        >
                            [ DISCONNECT ]
                        </button>
                    </div>

                    <h2 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase font-outfit leading-tight">
                        {selectedJob ? selectedJob.title : selectedFreelancer?.name}
                    </h2>

                    {selectedFreelancer && (
                        <div className="mb-6 space-y-2">
                            <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 inline-block rounded-sm">
                                <span className="text-[10px] text-blue-300 font-mono font-bold uppercase">{selectedFreelancer.role}</span>
                            </div>
                            <p className="text-sm text-neutral-400 leading-relaxed font-inter opacity-80">
                                This freelancer has been verified. Specialized in {selectedFreelancer.category} architecture with a success ratio of 98%.
                            </p>
                        </div>
                    )}

                    {!selectedFreelancer && (
                        <p className="text-sm text-neutral-400 mb-8 leading-relaxed font-inter opacity-80">
                            Data analysis indicates a strong match. Profile is verified and project benchmarks are standardized for professional delivery.
                        </p>
                    )}

                    <button
                        className={`w-full py-4 ${isOrg ? 'bg-blue-500 hover:bg-blue-400' : 'bg-emerald-500 hover:bg-emerald-400'} text-white font-black text-[12px] uppercase tracking-[0.4em] transition-all duration-500 shadow-2xl rounded-sm`}
                    >
                        {isOrg ? "HIRE FREELANCER" : "APPLY TO PROJECT"}
                    </button>

                    <button className="w-full mt-3 py-2 text-neutral-600 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest">
                        Examine Repository
                    </button>
                </div>
            )}
        </div>
    );
}
