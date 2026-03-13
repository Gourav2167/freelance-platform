"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { User, MapPin, Briefcase, Award, Terminal } from "lucide-react";
import { useRef } from "react";

interface ProfileData {
    full_name: string | null;
    bio: string | null;
    location: string | null;
    skills: string[] | null;
    experience_level: string | null;
}

export default function FreelancerProfile({ data }: { data: ProfileData }) {
    const container = useRef(null);

    useGSAP(() => {
        gsap.from(".skill-shard", {
            opacity: 0,
            scale: 0.8,
            y: 20,
            stagger: 0.1,
            duration: 0.8,
            ease: "back.out(1.7)"
        });

        gsap.from(".profile-card", {
            opacity: 0,
            x: -30,
            duration: 1,
            ease: "power3.out"
        });
    }, { scope: container });

    return (
        <div ref={container} className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto p-6">
            {/* Sidebar / Core Identity */}
            <div className="lg:col-span-4 space-y-6">
                <div className="profile-card glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center mb-6 shadow-2xl">
                            <User className="w-12 h-12 text-emerald-400" />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tighter mb-2 font-outfit uppercase">
                            {data.full_name || "Anonymous Freelancer"}
                        </h1>
                        <div className="flex items-center gap-2 text-obsidian-200 text-sm font-mono uppercase tracking-widest mb-6">
                            <Terminal className="w-4 h-4 text-emerald-500" />
                            {data.experience_level || "Level: Unknown"}
                        </div>

                        <div className="w-full space-y-4 text-left">
                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                <MapPin className="w-4 h-4 text-blue-400" />
                                <span className="text-sm text-neutral-400 font-medium">{data.location || "Earth (Nexus Default)"}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                <Award className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm text-neutral-400 font-medium">98% Success Ratio</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content / Capabilities */}
            <div className="lg:col-span-8 space-y-8">
                <div className="glass-panel rounded-3xl p-10 border border-white/10">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <Briefcase className="w-5 h-5 text-emerald-500" />
                        Professional Profile
                    </h2>
                    <p className="text-neutral-400 leading-relaxed font-inter opacity-80 text-lg">
                        {data.bio || "No professional summary provided. This freelancer prefers to let their work speak for itself."}
                    </p>
                </div>

                <div className="space-y-6">
                    <h2 className="text-sm font-black text-emerald-500 uppercase tracking-[0.3em] pl-2">Skill Set</h2>
                    <div className="flex flex-wrap gap-3">
                        {(data.skills || ["React", "Node.js", "TypeScript", "Three.js", "Solidity"]).map((skill, i) => (
                            <div
                                key={i}
                                className="skill-shard px-6 py-3 bg-white/5 border border-white/10 rounded-full text-sm font-bold text-white/90 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all cursor-default shadow-lg backdrop-blur-sm"
                            >
                                {skill}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
