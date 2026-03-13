"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef, useState } from "react";
import { Target, Activity, Banknote, Shield, Clock, CheckCircle2 } from "lucide-react";
import StatWidget from "./StatWidget";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/lib/userStore";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const DataCoreHologram = dynamic(() => import("@/components/canvas/DataCoreHologram"), {
    ssr: false,
});

export default function FreelancerDashboard() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { user } = useUserStore();
    const [myApplications, setMyApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return;

        const fetchData = async () => {
            const supabase = createClient();
            
            const { data, error } = await supabase
                .from('bids')
                .select(`
                    *,
                    missions (*)
                `)
                .eq('freelancer_id', user.id)
                .order('created_at', { ascending: false });

            if (error) console.error("FETCH_BIDS_ERR", error);
            else setMyApplications(data || []);
            
            setIsLoading(false);
        };

        fetchData();
    }, [user?.id]);

    const activeProjects = myApplications.filter(app => app.status === 'accepted');
    const totalEarnings = activeProjects.reduce((sum, app) => {
        // Simple regex to extract numbers from budget string if it exists
        const budgetStr = app.missions.budget || "0";
        const numeric = parseInt(budgetStr.replace(/[^0-9]/g, "")) || 0;
        return sum + numeric;
    }, 0);

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

    if (isLoading && myApplications.length === 0) {
        return (
            <div className="container mx-auto px-6 py-24 min-h-screen flex items-center justify-center">
                <div className="text-emerald-500 font-mono text-[10px] animate-pulse tracking-[0.4em] uppercase font-black">Connecting to Vault...</div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="container mx-auto px-6 py-24 relative z-10 min-h-screen">
            <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col pt-12">
                {/* Header */}
                <div className="mb-16 flex justify-between items-end animate-item">
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter uppercase drop-shadow-2xl text-white font-outfit">Freelancer Dashboard</h1>
                        <p className="text-emerald-500 font-mono text-[10px] tracking-[0.4em] mt-4 uppercase font-black opacity-80">Profile Verified // Account Status: Active</p>
                    </div>
                    <div className="glass-panel px-8 py-3 font-mono text-[10px] text-neutral-400 tracking-[0.3em] font-black border border-white/5 uppercase rounded-full shadow-2xl">
                        Vault connection: <span className="text-emerald-500 animate-pulse">SECURE</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-item">
                    <StatWidget
                        title="Job Match Rate"
                        value="98.5%"
                        trend="+2.1%"
                        trendUp={true}
                        icon={Target}
                        colorClass="from-emerald-500/10 to-blue-500/10"
                    />
                    <StatWidget
                        title="Active Projects"
                        value={activeProjects.length.toString()}
                        trend={activeProjects.length > 0 ? "IN PROGRESS" : "STANDING BY"}
                        trendUp={activeProjects.length > 0}
                        icon={Activity}
                        colorClass="from-blue-500/10 to-purple-500/10"
                    />
                    <StatWidget
                        title="Projected Earnings"
                        value={`$${totalEarnings.toLocaleString()}`}
                        trend="Live Value"
                        trendUp={true}
                        icon={Banknote}
                        colorClass="from-emerald-500/10 to-emerald-700/10"
                    />
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-item">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Applications Tracker */}
                        <div className="glass-panel p-8 border border-white/5 rounded-2xl">
                            <h2 className="text-white text-[10px] tracking-[0.4em] uppercase font-black opacity-50 mb-8">Active Applications</h2>
                            {myApplications.length === 0 ? (
                                <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                                    <p className="text-[10px] text-neutral-600 font-mono uppercase tracking-[0.2em]">No deployment signals sent.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {myApplications.map((app) => (
                                        <div key={app.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg bg-white/5 border border-white/10`}>
                                                    {app.status === 'pending' ? <Clock className="w-4 h-4 text-amber-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-bold text-sm uppercase tracking-tight">{app.missions.title}</h3>
                                                    <p className="text-[9px] text-neutral-500 font-mono uppercase">{app.missions.budget}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${
                                                    app.status === 'pending' ? 'text-amber-500' : 
                                                    app.status === 'accepted' ? 'text-emerald-500' : 'text-rose-500'
                                                }`}>
                                                    {app.status}
                                                </span>
                                                <span className="text-[8px] text-neutral-600 font-mono uppercase mt-1">
                                                    {new Date(app.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Active Missions (Contracts) */}
                        <div className="glass-panel p-8 border border-white/5 rounded-2xl">
                            <h2 className="text-white text-[10px] tracking-[0.4em] uppercase font-black opacity-50 mb-8">Contracted Work</h2>
                            {activeProjects.length === 0 ? (
                                <p className="text-[10px] text-neutral-600 font-mono uppercase text-center py-6">No active contracts assigned.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {activeProjects.map((proj) => (
                                        <div key={proj.id} className="p-5 bg-emerald-500/[0.02] border border-emerald-500/20 rounded-xl">
                                            <h3 className="text-white font-bold text-sm uppercase tracking-tight mb-2">{proj.missions.title}</h3>
                                            <div className="flex justify-between items-center mt-4">
                                                <span className="text-[10px] text-emerald-400 font-mono font-black uppercase">In Progress</span>
                                                <button className="text-[9px] text-white bg-emerald-500 px-3 py-1 rounded-sm uppercase font-black tracking-widest hover:bg-emerald-400 transition-colors">Workspace</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="glass-panel p-10 border border-white/5 h-full relative overflow-hidden group rounded-2xl shadow-2xl backdrop-blur-3xl">
                        <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000 rotate-12">
                            <Shield className="w-64 h-64 text-emerald-500" />
                        </div>

                        <div className="flex justify-between items-center mb-10 relative z-10">
                            <h2 className="text-white text-[10px] tracking-[0.4em] uppercase font-black opacity-50">Updates</h2>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl hover:border-emerald-500/20 transition-all cursor-pointer group/item">
                                <span className="text-[9px] text-emerald-500 font-mono tracking-[0.2em] uppercase block mb-2 font-black">Transaction Verified</span>
                                <p className="text-white text-base font-bold group-hover/item:text-emerald-400 transition-colors">Nebula Corp Settlement Received</p>
                                <span className="text-[9px] text-neutral-500 mt-4 block font-mono">2.4m ago // Reference #NC-882</span>
                            </div>
                            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl hover:border-blue-500/20 transition-all cursor-pointer group/item">
                                <span className="text-[9px] text-blue-500 font-mono tracking-[0.2em] uppercase block mb-2 font-black">Contract Alert</span>
                                <p className="text-white text-base font-bold group-hover/item:text-blue-400 transition-colors">Quantum Logic Open Tender</p>
                                <span className="text-[9px] text-neutral-500 mt-4 block font-mono">1.2h ago // Relevance 98%</span>
                            </div>
                        </div>

                        <button className="w-full mt-12 py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] uppercase tracking-[0.3em] font-black border border-white/5 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/5">
                            Access Activity Log
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
