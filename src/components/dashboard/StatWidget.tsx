"use client";

import { LucideIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface StatWidgetProps {
    title: string;
    value: string;
    trend: string;
    trendUp: boolean;
    icon: LucideIcon;
    colorClass: string;
}

export default function StatWidget({ title, value, trend, trendUp, icon: Icon, colorClass }: StatWidgetProps) {
    const widgetRef = useRef<HTMLDivElement>(null);

    const handleHover = () => {
        gsap.to(widgetRef.current, {
            y: -5,
            borderColor: "rgba(255,255,255,0.2)",
            backgroundColor: "rgba(255,255,255,0.02)",
            duration: 0.4,
            ease: "power2.out"
        });
    };

    const handleHoverExit = () => {
        gsap.to(widgetRef.current, {
            y: 0,
            borderColor: "rgba(255,255,255,0.05)",
            backgroundColor: "rgba(255,255,255,0.01)",
            duration: 0.4,
            ease: "power2.out"
        });
    };

    return (
        <div
            ref={widgetRef}
            onMouseEnter={handleHover}
            onMouseLeave={handleHoverExit}
            className="glass-panel p-8 flex flex-col justify-between border border-white/5 relative overflow-hidden group rounded-2xl shadow-xl backdrop-blur-3xl"
        >
            {/* Ambient Background Gradient */}
            <div className={`absolute -inset-24 bg-gradient-to-br ${colorClass} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000 blur-3xl`} />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 group-hover:scale-110 transition-transform duration-500">
                        <Icon className="w-5 h-5 text-white opacity-60 group-hover:opacity-100 group-hover:text-emerald-400 transition-all" />
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest font-mono ${trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {trendUp ? '↑' : '↓'}
                        {trend}
                    </div>
                </div>

                <div className="space-y-1">
                    <h3 className="text-white text-4xl font-black tracking-tighter drop-shadow-sm font-outfit">{value}</h3>
                    <p className="text-neutral-500 text-[10px] tracking-[0.3em] uppercase font-black font-inter opacity-60 group-hover:opacity-100 transition-opacity">
                        {title}
                    </p>
                </div>
            </div>

            {/* Micro-sparkle Effect */}
            <div className="absolute top-0 right-0 w-24 h-[1px] bg-gradient-to-l from-emerald-500/20 to-transparent group-hover:from-emerald-500/50 transition-all duration-1000" />
        </div>
    );
}
