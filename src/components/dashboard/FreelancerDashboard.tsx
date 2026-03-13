"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef } from "react";
import { Target, Activity, Banknote, Shield } from "lucide-react";
import StatWidget from "./StatWidget";
import ContractTracker from "./ContractTracker";
import { gsap } from "gsap";

const DataCoreHologram = dynamic(() => import("@/components/canvas/DataCoreHologram"), {
    ssr: false,
});

export default function FreelancerDashboard() {
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
            <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col pt-12">
                {/* Header */}
                <div className="mb-16 flex justify-between items-end animate-item">
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter uppercase drop-shadow-2xl text-white font-outfit">Freelancer Dashboard</h1>
                        <p className="text-emerald-500 font-mono text-[10px] tracking-[0.4em] mt-4 uppercase font-black opacity-80">Identity Verified // Operative Status: Active</p>
                    </div>
                    <div className="glass-panel px-8 py-3 font-mono text-[10px] text-neutral-400 tracking-[0.3em] font-black border border-white/5 uppercase rounded-full shadow-2xl">
                        Vault connection: <span className="text-emerald-500 animate-pulse">SECURE</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-item">
                    <StatWidget
                        title="Job Match Rate"
                        value="94.2%"
                        trend="+2.1%"
                        trendUp={true}
                        icon={Target}
                        colorClass="from-emerald-500/10 to-blue-500/10"
                    />
                    <StatWidget
                        title="Active Projects"
                        value="12"
                        trend="-1"
                        trendUp={false}
                        icon={Activity}
                        colorClass="from-blue-500/10 to-purple-500/10"
                    />
                    <StatWidget
                        title="Total Earnings"
                        value="$14,250"
                        trend="+$3,400"
                        trendUp={true}
                        icon={Banknote}
                        colorClass="from-emerald-500/10 to-emerald-700/10"
                    />
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-item">
                    <div className="lg:col-span-2">
                        <ContractTracker />
                    </div>

                    <div className="glass-panel p-10 border border-white/5 h-full relative overflow-hidden group rounded-2xl shadow-2xl backdrop-blur-3xl">
                        <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000 rotate-12">
                            <Shield className="w-64 h-64 text-emerald-500" />
                        </div>

                        <div className="flex justify-between items-center mb-10 relative z-10">
                            <h2 className="text-white text-[10px] tracking-[0.4em] uppercase font-black opacity-50">Intelligence Stream</h2>
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
                            Access Security Log
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
