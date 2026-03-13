"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef } from "react";
import { Plus, Users, Layout, Shield } from "lucide-react";
import StatWidget from "./StatWidget";
import ContractTracker from "./ContractTracker";
import { gsap } from "gsap";

const DataCoreHologram = dynamic(() => import("@/components/canvas/DataCoreHologram"), {
    ssr: false,
});

export default function OrgDashboard() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
            tl.fromTo(containerRef.current.querySelectorAll('.animate-item'),
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.1, duration: 1.2, delay: 0.2 }
            );
        }
    }, []);

    return (
        <div ref={containerRef} className="container mx-auto px-6 py-24 relative z-10 min-h-screen">
            <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col pt-12">
                {/* Header */}
                <div className="mb-16 flex justify-between items-end animate-item">
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter uppercase drop-shadow-2xl text-white font-outfit">Organization Dashboard</h1>
                        <p className="text-blue-500 font-mono text-[10px] tracking-[0.4em] mt-4 uppercase font-black opacity-80">Command Authority Group // Node: Prime</p>
                    </div>
                    <div className="glass-panel px-8 py-3 font-mono text-[10px] text-neutral-400 tracking-[0.3em] font-black border border-white/5 uppercase rounded-full shadow-2xl">
                        Network Status: <span className="text-blue-500 animate-pulse">ENCRYPTED</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-item">
                    <StatWidget
                        title="Contractors Engaged"
                        value="24"
                        trend="+4"
                        trendUp={true}
                        icon={Users}
                        colorClass="from-blue-500/10 to-emerald-500/10"
                    />
                    <StatWidget
                        title="Active Deployments"
                        value="8"
                        trend="+2"
                        trendUp={true}
                        icon={Layout}
                        colorClass="from-purple-500/10 to-blue-500/10"
                    />
                    <StatWidget
                        title="Infrastructure Health"
                        value="99.9%"
                        trend="STABLE"
                        trendUp={true}
                        icon={Shield}
                        colorClass="from-blue-500/10 to-blue-700/10"
                    />
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-item">
                    <div className="lg:col-span-2">
                        <ContractTracker />
                    </div>

                    <div className="glass-panel p-10 border border-white/5 h-full relative overflow-hidden group rounded-2xl shadow-2xl backdrop-blur-3xl">
                        <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000 rotate-12">
                            <Plus className="w-64 h-64 text-blue-500" />
                        </div>

                        <div className="flex justify-between items-center mb-10 relative z-10">
                            <h2 className="text-white text-[10px] tracking-[0.4em] uppercase font-black opacity-50">Strategic Operations</h2>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl hover:border-blue-500/20 transition-all cursor-pointer group/item">
                                <span className="text-[9px] text-blue-500 font-mono tracking-[0.2em] uppercase block mb-2 font-black">Strategic Deployment</span>
                                <p className="text-white text-base font-bold group-hover/item:text-blue-400 transition-colors">Post High-Priority Contract</p>
                                <span className="text-[9px] text-neutral-500 mt-4 block font-mono">Immediate Response Required</span>
                            </div>
                            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl hover:border-emerald-500/20 transition-all cursor-pointer group/item">
                                <span className="text-[9px] text-emerald-500 font-mono tracking-[0.2em] uppercase block mb-2 font-black">Intelligence Acquisition</span>
                                <p className="text-white text-base font-bold group-hover/item:text-emerald-400 transition-colors">Scan Global Talent Directory</p>
                                <span className="text-[9px] text-neutral-500 mt-4 block font-mono">342 New Operatives Detected</span>
                            </div>
                        </div>

                        <button className="w-full mt-12 py-4 bg-blue-500 hover:bg-blue-600 text-white text-[10px] uppercase tracking-[0.3em] font-black rounded-xl transition-all shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:shadow-blue-500/40">
                            Initiate Deployment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
