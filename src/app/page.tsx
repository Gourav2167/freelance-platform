"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollController from "@/components/ScrollController";
import PDFUploader from "@/components/PDFUploader";
import RedactionPreview from "@/components/RedactionPreview";
import AIInterface from "@/components/AIInterface";
import BiddingEditor from "@/components/BiddingEditor";
import TalentSearch from "@/components/TalentSearch";
import MissionDeployment from "@/components/MissionDeployment";
import { ArrowUpRight, Shield, Zap, Globe } from "lucide-react";
import { useUserStore } from "@/lib/userStore";
import { createClient } from "@/utils/supabase/client";

interface Mission {
  id: string;
  title: string;
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { role, isAuthenticated } = useUserStore();
  const [mounted, setMounted] = useState(false);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    
    // Fetch latest active mission for bidding display
    const fetchMission = async () => {
      const { data } = await supabase
        .from('missions')
        .select('id, title')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (data) setActiveMission(data);
    };

    fetchMission();
  }, []);

  useGSAP(() => {
    // Only run if the container is available
    if (!containerRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    // Use a more robust selector within scope
    const heroElements = containerRef.current.querySelectorAll(".hero-animate");
    if (heroElements.length > 0) {
      tl.fromTo(heroElements,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 2, delay: 0.5 }
      );
    }

    const shimmerBars = containerRef.current.querySelectorAll(".shimmer-bar");
    if (shimmerBars.length > 0) {
      tl.fromTo(shimmerBars,
        { width: 0 },
        { width: "100%", duration: 1.5, ease: "power4.inOut" },
        "-=1.5"
      );
    }
  }, { scope: containerRef });

  if (!mounted) return null;

  const isOrg = role === 'organization';
  const accentColor = isOrg ? "blue-500" : "emerald-500";
  const accentText = isOrg ? "text-blue-500" : "text-emerald-500";
  const accentBorder = isOrg ? "border-blue-500/50" : "border-emerald-500/50";
  const accentBg = isOrg ? "bg-blue-500" : "bg-emerald-500";

  return (
    <main ref={containerRef} className="relative min-h-screen w-full overflow-hidden">
      <ScrollController />

      <AIInterface />

      {/* Persistent HUD Layers - Conditional based on role */}
      <div className="fixed bottom-8 left-8 z-30 pointer-events-auto hero-animate">
        {isOrg ? (
          <TalentSearch />
        ) : (
          <BiddingEditor missionId={activeMission?.id} />
        )}
      </div>

      <div className="fixed bottom-8 right-8 z-30 flex flex-col items-end gap-6 pointer-events-auto hero-animate">
        {isOrg ? (
          <MissionDeployment />
        ) : (
          <>
            <PDFUploader />
            <RedactionPreview />
          </>
        )}
      </div>

      {/* Hero Content Layer */}
      <div className="relative z-20 flex flex-col justify-start items-center text-center min-h-screen p-8 lg:p-12 pt-20 lg:pt-28 pointer-events-none pb-48">
        <div className="max-w-4xl space-y-6 flex flex-col items-center">
          <div className="space-y-2 hero-animate w-full flex flex-col items-center">
            <span className={`${accentText} font-mono text-[10px] tracking-[0.5em] uppercase font-black opacity-80 flex items-center justify-center gap-3 w-full`}>
              <Zap className={`w-3 h-3 fill-current`} /> {isOrg ? "MANAGEMENT ACTIVE" : "SYSTEM ACTIVE"}
            </span>
            <div className={`h-[1px] mx-auto shimmer-bar bg-gradient-to-r from-transparent via-${isOrg ? 'blue' : 'emerald'}-500/50 to-transparent w-full max-w-sm`} />
          </div>

          <div className="hero-animate">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[0.85] font-outfit uppercase">
              Vasudha
            </h1>
          </div>

          <div className="hero-animate max-w-lg mx-auto">
            <p className="text-neutral-400 text-sm md:text-base lg:text-lg font-medium leading-relaxed font-inter opacity-70">
              {isOrg
                ? "The premier platform for business growth. Post projects, browse global talent, and hire experts."
                : "The next-generation freelance ecosystem. Real-time project search, secure contracts, and verified talent directories."
              }
            </p>
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-center hero-animate pointer-events-auto mt-6">
            {!isAuthenticated && (
              <Link
                href="/login"
                className="group relative px-8 py-4 bg-white text-black font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)] rounded-sm font-outfit overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Sign Up Now <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
                <div className={`absolute inset-x-0 bottom-0 h-0 ${accentBg} transition-all group-hover:h-1`} />
              </Link>
            )}

            <div className="flex items-center gap-8 px-8 py-3 glass-panel border border-white/5 rounded-full backdrop-blur-3xl shadow-2xl">
              <div className="flex items-center gap-3">
                <Shield className={`w-4 h-4 ${isOrg ? 'text-blue-500' : 'text-emerald-500'}`} />
                <span className="text-[10px] text-neutral-400 font-black uppercase tracking-widest font-mono">Secure</span>
              </div>
              <div className="w-[1px] h-4 bg-white/10" />
              <div className="flex items-center gap-3">
                <Globe className={`w-4 h-4 ${isOrg ? 'text-blue-400' : 'text-blue-500'}`} />
                <span className="text-[10px] text-neutral-400 font-black uppercase tracking-widest font-mono">Global</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
