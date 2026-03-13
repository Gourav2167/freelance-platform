"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import SceneWrapper from "@/components/canvas/SceneWrapper";
import ScrollController from "@/components/ScrollController";
import PDFUploader from "@/components/PDFUploader";
import RedactionPreview from "@/components/RedactionPreview";
import AIInterface from "@/components/AIInterface";
import BiddingEditor from "@/components/BiddingEditor";
import { ArrowUpRight, Shield, Zap, Globe } from "lucide-react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl.fromTo(".hero-animate",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 2, delay: 1 }
    );

    tl.fromTo(".shimmer-bar",
      { width: 0 },
      { width: "100%", duration: 1.5, ease: "power4.inOut" },
      "-=1.5"
    );
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="relative min-h-screen w-full bg-[#030305] overflow-hidden">
      <ScrollController />
      <SceneWrapper />

      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-40" />

      <AIInterface />
      <BiddingEditor />

      {/* Hero Content Layer */}
      <div className="relative z-20 flex flex-col justify-center min-h-screen p-12 lg:p-24 pointer-events-none">
        <div className="max-w-4xl space-y-8">
          <div className="space-y-2 hero-animate">
            <span className="text-emerald-500 font-mono text-[10px] tracking-[0.5em] uppercase font-black opacity-80 flex items-center gap-3">
              <Zap className="w-3 h-3 fill-emerald-500" /> System Synchronized
            </span>
            <div className="h-[1px] shimmer-bar bg-gradient-to-r from-emerald-500/50 via-white/20 to-transparent w-full" />
          </div>

          <div className="hero-animate">
            <h1 className="text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[0.85] font-outfit uppercase">
              Vasudha <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/30 italic">Talent Nexus</span>
            </h1>
          </div>

          <div className="hero-animate max-w-xl">
            <p className="text-neutral-400 text-lg lg:text-xl font-medium leading-relaxed font-inter opacity-70">
              The next-generation autonomous freelance ecosystem.
              Real-time project alignment, secure contract deployments, and verified operative directories.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 items-center hero-animate pointer-events-auto mt-12">
            <Link
              href="/login"
              className="group relative px-10 py-5 bg-white text-black font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)] rounded-sm font-outfit overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Join the Network <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </span>
              <div className="absolute inset-x-0 bottom-0 h-0 bg-emerald-500 transition-all group-hover:h-1" />
            </Link>

            <div className="flex items-center gap-8 px-8 py-3 glass-panel border border-white/5 rounded-full backdrop-blur-3xl shadow-2xl">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] text-neutral-400 font-black uppercase tracking-widest font-mono">Encrypted</span>
              </div>
              <div className="w-[1px] h-4 bg-white/10" />
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-blue-500" />
                <span className="text-[10px] text-neutral-400 font-black uppercase tracking-widest font-mono">Global</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive HUD Elements */}
      <div className="fixed bottom-12 right-12 z-30 pointer-events-none hero-animate">
        <RedactionPreview />
      </div>

      <div className="fixed bottom-12 left-12 z-30 pointer-events-auto hero-animate">
        <PDFUploader />
      </div>
    </main>
  );
}
