"use client";

import dynamic from "next/dynamic";
import { Plus, Users, Layout, Shield, Search, X } from "lucide-react";
import StatWidget from "./StatWidget";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/lib/userStore";
import { toast } from "sonner";
import ContractTracker from "./ContractTracker";
import MissionDeployment from "@/components/MissionDeployment";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const DataCoreHologram = dynamic(() => import("@/components/canvas/DataCoreHologram"), {
    ssr: false,
});

export default function OrgDashboard() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { user } = useUserStore();
    const [myMissions, setMyMissions] = useState<any[]>([]);
    const [incomingBids, setIncomingBids] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeployment, setShowDeployment] = useState(false);

    useEffect(() => {
        if (!user?.id || !isLoading) return; // Wait for initial loading if true

        const fetchData = async () => {
            setIsLoading(true);
            const supabase = createClient();
            
            // Fetch missions
            const { data: missions, error: mError } = await supabase
                .from('missions')
                .select('*')
                .eq('organization_id', user.id)
                .order('created_at', { ascending: false });

            if (mError) {
                console.error(mError);
            } else {
                setMyMissions(missions || []);
                
                // Fetch bids for these missions
                if (missions && missions.length > 0) {
                    const missionIds = missions.map(m => m.id);
                    const { data: bids, error: bError } = await supabase
                        .from('bids')
                        .select(`
                            *,
                            profiles:freelancer_id (full_name, experience_level, bio),
                            missions:mission_id (title)
                        `)
                        .in('mission_id', missionIds)
                        .order('created_at', { ascending: false });

                    if (bError) console.error(bError);
                    else setIncomingBids(bids || []);
                }
            }
            setIsLoading(false);
        };

        fetchData();
    }, [user?.id]);

    const handleBidAction = async (bidId: string, status: 'accepted' | 'rejected') => {
        const supabase = createClient();
        try {
            const { error } = await supabase
                .from('bids')
                .update({ status })
                .eq('id', bidId);

            if (error) throw error;
            
            toast.success(`Application ${status.toUpperCase()}`);
            setIncomingBids(prev => prev.map(b => b.id === bidId ? { ...b, status } : b));
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    useGSAP(() => {
        if (!containerRef.current) return;
        
        const items = containerRef.current.querySelectorAll('.animate-item');
        if (items.length > 0) {
            const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
            tl.fromTo(items,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.1, duration: 1.2, delay: 0.2 }
            );
        }
    }, { scope: containerRef });

    if (isLoading && myMissions.length === 0) {
        return (
            <div className="container mx-auto px-6 py-24 min-h-screen flex items-center justify-center">
                <div className="text-blue-500 font-mono text-[10px] animate-pulse tracking-[0.4em] uppercase font-black">Synchronizing Data...</div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="container mx-auto px-6 py-24 relative z-10 min-h-screen">
            <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col pt-12">
                {/* Header */}
                <div className="mb-16 flex justify-between items-end animate-item">
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter uppercase drop-shadow-2xl text-white font-outfit">Organization Dashboard</h1>
                        <p className="text-blue-500 font-mono text-[10px] tracking-[0.4em] mt-4 uppercase font-black opacity-80">Administration Panel // Root Access</p>
                    </div>
                    <div className="glass-panel px-8 py-3 font-mono text-[10px] text-neutral-400 tracking-[0.3em] font-black border border-white/5 uppercase rounded-full shadow-2xl">
                        Network Status: <span className="text-blue-500 animate-pulse">ENCRYPTED</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-item">
                    <StatWidget
                        title="Contractors Hired"
                        value={incomingBids.filter(b => b.status === 'accepted').length.toString()}
                        trend="+1"
                        trendUp={true}
                        icon={Users}
                        colorClass="from-blue-500/10 to-emerald-500/10"
                    />
                    <StatWidget
                        title="Active Projects"
                        value={myMissions.length.toString()}
                        trend="+2"
                        trendUp={true}
                        icon={Layout}
                        colorClass="from-purple-500/10 to-blue-500/10"
                    />
                    <StatWidget
                        title="System Status"
                        value="99.9%"
                        trend="STABLE"
                        trendUp={true}
                        icon={Shield}
                        colorClass="from-blue-500/10 to-blue-700/10"
                    />
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-item">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Bids Management */}
                        <div className="glass-panel p-8 border border-white/5 rounded-2xl">
                            <h2 className="text-white text-[10px] tracking-[0.4em] uppercase font-black opacity-50 mb-8">Incoming Applications</h2>
                            {incomingBids.length === 0 ? (
                                <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                                    <p className="text-[10px] text-neutral-600 font-mono uppercase tracking-[0.2em]">No signals detected in the Nexus.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {incomingBids.map((bid) => (
                                        <div key={bid.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between group hover:border-blue-500/20 transition-all">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="text-white font-bold text-sm uppercase tracking-tight">{bid.profiles.full_name}</span>
                                                    <span className="text-[8px] text-blue-500 font-mono tracking-tighter bg-blue-500/10 px-2 py-0.5 rounded uppercase">{bid.profiles.experience_level}</span>
                                                </div>
                                                <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-tighter">Applied for: {bid.missions.title}</p>
                                                <p className="text-[10px] text-neutral-400 mt-2 line-clamp-1 italic">"{bid.proposal}"</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {bid.status === 'pending' ? (
                                                    <>
                                                        <button 
                                                            onClick={() => handleBidAction(bid.id, 'accepted')}
                                                            className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-[9px] font-black uppercase tracking-widest rounded transition-all"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button 
                                                            onClick={() => handleBidAction(bid.id, 'rejected')}
                                                            className="px-4 py-2 border border-white/10 hover:border-white/20 text-neutral-500 hover:text-white text-[9px] font-black uppercase tracking-widest rounded transition-all"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className={`text-[10px] font-mono font-black uppercase tracking-[0.2em] ${bid.status === 'accepted' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                        {bid.status}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* My Missions */}
                        <div className="glass-panel p-8 border border-white/5 rounded-2xl">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-white text-[10px] tracking-[0.4em] uppercase font-black opacity-50">Deployed Missions</h2>
                                <span className="text-[9px] text-neutral-600 font-mono">{myMissions.length} ACTIVE</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {myMissions.map((m) => (
                                    <div key={m.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col justify-between hover:bg-blue-500/[0.01] transition-all">
                                        <div>
                                            <h3 className="text-white font-bold text-sm uppercase tracking-tight mb-2">{m.title}</h3>
                                            <p className="text-[10px] text-neutral-500 line-clamp-2 uppercase leading-relaxed font-mono tracking-tighter italic">
                                                {m.description}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-center mt-6">
                                            <span className="text-[9px] text-blue-400 font-black tracking-widest">{m.budget}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[8px] text-emerald-500 font-mono font-black uppercase tracking-widest">{m.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-10 border border-white/5 h-full relative overflow-hidden group rounded-2xl shadow-2xl backdrop-blur-3xl">
                        <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000 rotate-12">
                            <Plus className="w-64 h-64 text-blue-500" />
                        </div>

                        <div className="flex justify-between items-center mb-10 relative z-10">
                            <h2 className="text-white text-[10px] tracking-[0.4em] uppercase font-black opacity-50">Project Management</h2>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl hover:border-blue-500/20 transition-all cursor-pointer group/item">
                                <span className="text-[9px] text-blue-500 font-mono tracking-[0.2em] uppercase block mb-2 font-black">Project Posting</span>
                                <p className="text-white text-base font-bold group-hover/item:text-blue-400 transition-colors">Post High-Priority Project</p>
                                <span className="text-[9px] text-neutral-500 mt-4 block font-mono">Immediate Response Required</span>
                            </div>
                            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl hover:border-emerald-500/20 transition-all cursor-pointer group/item">
                                <span className="text-[9px] text-emerald-500 font-mono tracking-[0.2em] uppercase block mb-2 font-black">Talent Search</span>
                                <p className="text-white text-base font-bold group-hover/item:text-emerald-400 transition-colors">Scan Global Talent Directory</p>
                                <span className="text-[9px] text-neutral-500 mt-4 block font-mono">342 New Freelancers Detected</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => setShowDeployment(true)}
                            className="w-full mt-12 py-4 bg-blue-500 hover:bg-blue-600 text-white text-[10px] uppercase tracking-[0.3em] font-black rounded-xl transition-all shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:shadow-blue-500/40"
                        >
                            Start Project
                        </button>
                    </div>
                </div>

                {/* Mission Deployment Modal */}
                {showDeployment && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowDeployment(false)} />
                        <div className="relative glass-panel p-8 border border-white/10 rounded-2xl w-full max-w-md animate-item">
                            <button 
                                onClick={() => setShowDeployment(false)}
                                className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <MissionDeployment onDeployed={() => {
                                setShowDeployment(false);
                                window.location.reload(); // Hard refresh to show new mission
                            }} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
