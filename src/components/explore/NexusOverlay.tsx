import { useExploreStore } from "@/lib/exploreStore";
import { useUserStore } from "@/lib/userStore";
import { Code, Server, Brain, PenTool, LayoutTemplate, UserCheck, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function NexusOverlay() {
    const { 
        hoveredJob, selectedJob, hoveredFreelancer, selectedFreelancer, 
        setSelectedJob, setSelectedFreelancer, setCameraTarget,
        setHoveredJob, setHoveredFreelancer,
        missions, freelancers 
    } = useExploreStore();
    const { role } = useUserStore();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [search, setSearch] = useState("");
    const supabase = createClient();

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

    const handleAction = async () => {
        setIsSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error("Please log in to continue");
                router.push('/login');
                return;
            }

            if (selectedJob && !isOrg) {
                // Freelancer applying to a mission
                const { error } = await supabase
                    .from('bids')
                    .insert({
                        mission_id: selectedJob.id,
                        freelancer_id: user.id,
                        proposal: "Applied via Nexus Explore",
                        status: 'pending'
                    });

                if (error) throw error;
                toast.success(`Application sent for ${selectedJob.title}`);
                setSelectedJob(null);
            } else if (selectedFreelancer && isOrg) {
                // Org hiring a freelancer
                const { data: missions } = await supabase
                    .from('missions')
                    .select('id')
                    .eq('organization_id', user.id)
                    .eq('status', 'active')
                    .limit(1);

                if (!missions || missions.length === 0) {
                    toast.error("You need an active mission to hire freelancers.");
                    return;
                }

                const { error } = await supabase
                    .from('bids')
                    .insert({
                        mission_id: missions[0].id,
                        freelancer_id: selectedFreelancer.id,
                        proposal: "Initiated hiring via Nexus Explore",
                        status: 'pending'
                    });

                if (error) throw error;
                toast.success(`Hiring request sent to ${selectedFreelancer.name}`);
                setSelectedFreelancer(null);
            }
        } catch (error: any) {
            console.error("ACTION_ERR", error);
            toast.error(error.message || "Failed to process request");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredNodes = isOrg 
        ? freelancers.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
        : missions.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

    const handleSearchSelect = (node: any) => {
        if (isOrg) {
            setSelectedFreelancer(node);
        } else {
            setSelectedJob(node);
        }
        setCameraTarget(node.position);
        setSearch("");
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-10 p-8 pt-24 flex flex-col justify-between">
            {/* Top Bar - Three Column Layout */}
            <div className="w-full flex justify-between items-start">
                {/* Left Area - Aligned with Sidebar (width 64) */}
                <div className="w-64">
                    <div className="glass-panel px-6 py-4 pointer-events-auto border-white/5">
                        <h1 className="font-bold text-base tracking-[0.2em] text-white uppercase font-outfit whitespace-nowrap">
                            {isOrg ? "FREELANCER DIRECTORY" : "PROJECT MARKET"}
                        </h1>
                        <p className="text-neutral-500 text-[9px] font-mono mt-1 uppercase tracking-widest">
                            {isOrg ? `${freelancers.length} Nodes Online` : `${missions.length} Transmissions`}
                        </p>
                    </div>
                </div>

                {/* Center Area - Search */}
                <div className="flex-1 flex justify-center mt-2">
                    <div className="relative">
                        <div className={`glass-panel w-80 p-2.5 pointer-events-auto flex items-center gap-3 border-${isOrg ? 'blue' : 'emerald'}-500/20 bg-white/[0.01] backdrop-blur-xl transition-all hover:bg-white/[0.03]`}>
                            <div className={`w-2.5 h-2.5 rounded-full ${isOrg ? 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]' : 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]'} animate-pulse ml-2`} />
                            <input
                                type="text"
                                placeholder={isOrg ? "Search freelancers..." : "Search projects..."}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-transparent border-none outline-none text-[11px] text-white w-full px-2 placeholder:text-neutral-600 font-mono tracking-tighter"
                            />
                        </div>

                        {search && filteredNodes.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-3 glass-panel p-2 pointer-events-auto border-white/10 backdrop-blur-3xl z-50">
                                {filteredNodes.slice(0, 5).map((node, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSearchSelect(node)}
                                        className="w-full text-left p-2.5 hover:bg-white/5 text-[10px] text-white font-mono uppercase tracking-tighter transition-colors border-b border-white/[0.02] last:border-none"
                                    >
                                        {isOrg ? (node as any).name : (node as any).title}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Area - Empty space or balancing stats */}
                <div className="w-64 flex justify-end">
                    {/* Balanced space */}
                </div>
            </div>

            {/* Centered Discovery Deck (Prominent Samples) */}
            <div className="absolute left-1/2 bottom-24 -translate-x-1/2 w-full max-w-5xl px-8 pointer-events-auto">
                <div className="flex items-center gap-6 overflow-x-auto pb-8 pt-4 scrollbar-hide mask-fade-edges">
                    {(isOrg ? freelancers : missions).slice(0, 6).map((node, i) => (
                        <button
                            key={i}
                            onClick={() => handleSearchSelect(node)}
                            onMouseEnter={() => isOrg ? setHoveredFreelancer(node as any) : setHoveredJob(node as any)}
                            onMouseLeave={() => { setHoveredJob(null); setHoveredFreelancer(null); }}
                            className="flex-shrink-0 w-64 glass-panel p-6 text-left border-white/5 hover:border-white/30 hover:bg-white/[0.04] transition-all duration-500 group relative overflow-hidden active:scale-95"
                        >
                            {/* Interactive Scanline */}
                            <div className="scanline group-hover:block hidden" />
                            
                            <div className="flex items-center justify-between mb-4">
                                <div className={`px-2 py-0.5 rounded-sm ${isOrg ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'} border border-current/20`}>
                                    <span className="text-[7px] font-mono font-black uppercase tracking-widest">
                                        {isOrg ? (node as any).level : (node as any).budget}
                                    </span>
                                </div>
                                {getIcon( (node as any).category || 'general')}
                            </div>

                            <h4 className="text-[13px] text-white font-black uppercase tracking-tight group-hover:text-amber-400 transition-colors mb-2 leading-tight">
                                {isOrg ? (node as any).name : (node as any).title}
                            </h4>
                            
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[8px] text-neutral-500 font-mono uppercase">Establish Link</span>
                                <div className="flex-1 h-[1px] bg-white/10" />
                            </div>
                        </button>
                    ))}
                </div>
                
                {/* Visual Guide */}
                <div className="flex items-center justify-center gap-4 mt-2">
                    <div className="h-[1px] w-12 bg-white/5" />
                    <p className="text-[8px] text-neutral-600 font-mono uppercase tracking-[0.4em] animate-pulse">
                        Click clusters to synchronize viewport
                    </p>
                    <div className="h-[1px] w-12 bg-white/5" />
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
                                setSelectedJob(null);
                                setSelectedFreelancer(null);
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
                            {selectedJob?.description || "Data analysis indicates a strong match. Profile is verified and project benchmarks are standardized for professional delivery."}
                        </p>
                    )}

                    <button
                        onClick={handleAction}
                        disabled={isSubmitting}
                        className={`w-full py-4 ${isOrg ? 'bg-blue-500 hover:bg-blue-400' : 'bg-emerald-500 hover:bg-emerald-400'} text-white font-black text-[12px] uppercase tracking-[0.4em] transition-all duration-500 shadow-2xl rounded-sm disabled:opacity-50 disabled:cursor-wait`}
                    >
                        {isSubmitting ? "PROCESSING..." : (isOrg ? "HIRE FREELANCER" : "APPLY TO PROJECT")}
                    </button>

                    <button className="w-full mt-3 py-2 text-neutral-600 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest">
                        Examine Repository
                    </button>
                </div>
            )}
        </div>
    );
}
