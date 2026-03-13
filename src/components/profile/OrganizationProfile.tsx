"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Building2, MapPin, Globe, Target, Users, Zap } from "lucide-react";
import { useRef } from "react";

interface ProfileData {
    full_name: string | null;
    bio: string | null;
    location: string | null;
    website: string | null;
    industry: string | null;
    company_size: string | null;
}

export default function OrganizationProfile({ data }: { data: ProfileData }) {
    const container = useRef(null);

    useGSAP(() => {
        gsap.from(".mission-box", {
            opacity: 0,
            y: 30,
            duration: 1.2,
            ease: "power2.out"
        });

        gsap.from(".stat-box", {
            opacity: 0,
            scale: 0.9,
            stagger: 0.15,
            duration: 1,
            ease: "expo.out"
        });
    }, { scope: container });

    return (
        <div ref={container} className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Brand Header */}
            <div className="glass-panel rounded-[40px] p-12 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Building2 className="w-64 h-64 text-white" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
                    <div className="w-32 h-32 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-xl">
                        <Building2 className="w-16 h-16 text-blue-400" />
                    </div>

                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <h1 className="text-5xl font-black text-white tracking-tighter font-outfit uppercase">
                            {data.full_name || "Unidentified Organization"}
                        </h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-mono uppercase tracking-widest text-obsidian-200">
                            <span className="flex items-center gap-2"><Target className="w-4 h-4 text-emerald-500" /> {data.industry || "Business Services"}</span>
                            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" /> {data.location || "Global Network"}</span>
                            {data.website && (
                                <a href={data.website} className="flex items-center gap-2 hover:text-white transition-colors">
                                    <Globe className="w-4 h-4 text-fuchsia-500" /> {data.website.replace(/^https?:\/\//, '')}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Stats / Metadata */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="stat-box glass-panel p-6 rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all">
                            <div className="text-emerald-500 mb-2"><Users className="w-5 h-5" /></div>
                            <div className="text-2xl font-black text-white font-outfit">{data.company_size || "10-50"}</div>
                            <div className="text-[10px] uppercase tracking-widest text-obsidian-200 font-black">Employees</div>
                        </div>
                        <div className="stat-box glass-panel p-6 rounded-3xl border border-white/5 hover:border-blue-500/20 transition-all">
                            <div className="text-blue-500 mb-2"><Zap className="w-5 h-5" /></div>
                            <div className="text-2xl font-black text-white font-outfit">1.2k</div>
                            <div className="text-[10px] uppercase tracking-widest text-obsidian-200 font-black">Projects</div>
                        </div>
                    </div>
                </div>

                {/* Legacy / Vision */}
                <div className="lg:col-span-8">
                    <div className="mission-box glass-panel rounded-[32px] p-10 border border-white/10 h-full">
                        <h2 className="text-sm font-black text-blue-500 uppercase tracking-[0.4em] mb-8">Company Mission</h2>
                        <p className="text-neutral-300 text-2xl font-medium leading-tight font-inter tracking-tight">
                            {data.bio || "Crafting the future of decentralized infrastructure with a focus on speed, security, and global impact."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
