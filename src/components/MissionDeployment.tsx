"use client";

import { useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/userStore";
import { Zap, Activity, ShieldCheck, Globe } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

interface MissionDeploymentProps {
    onDeployed?: () => void;
}

export default function MissionDeployment({ onDeployed }: MissionDeploymentProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");
    const [isDeploying, setIsDeploying] = useState(false);
    const { user } = useUserStore();
    const router = useRouter();

    useGSAP(() => {
        if (!containerRef.current) return;

        const panels = containerRef.current.querySelectorAll(".mission-panel");
        if (panels.length > 0) {
            gsap.fromTo(panels,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.2)" }
            );
        }
    }, { scope: containerRef });

    const handleDeploy = async () => {
        if (!title || !description || !budget) {
            toast.error("All mission parameters must be initialized.");
            return;
        }

        if (!user?.id) {
            toast.error("Authentication required for deployment.");
            return;
        }

        setIsDeploying(true);
        const supabase = createClient();

        try {
            const { error } = await supabase
                .from('missions')
                .insert({
                    organization_id: user.id,
                    title,
                    description,
                    budget,
                    status: 'active'
                });

            if (error) throw error;

            toast.success("MISSION DEPLOYED TO NEXUS");
            setTitle("");
            setDescription("");
            setBudget("");
            if (onDeployed) onDeployed();
            router.refresh(); // Update dashboard
        } catch (error: any) {
            console.error("DEPLOY_ERR", error);
            toast.error(error.message || "Deployment failed.");
        } finally {
            setIsDeploying(false);
        }
    };

    return (
        <div ref={containerRef} className="space-y-4 w-full">
            <div className="mission-panel glass-panel p-5 border-blue-500/20 bg-blue-500/[0.02]">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
                        <span className="text-[10px] text-white font-black uppercase tracking-[0.2em]">Project HUD</span>
                    </div>
                    <div className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30">
                        <span className="text-[8px] text-blue-300 font-bold uppercase tracking-tight">Active</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[8px] text-neutral-500 uppercase font-black tracking-widest ml-1">Mission Title</label>
                        <input 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. AURORA PROTOCOL"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2 text-xs text-white placeholder:text-neutral-700 outline-none focus:border-blue-500/50 transition-colors font-mono uppercase"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[8px] text-neutral-500 uppercase font-black tracking-widest ml-1">Briefing (Description)</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="PROJECT SCOPE AND PARAMETERS..."
                            rows={3}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2 text-xs text-white placeholder:text-neutral-700 outline-none focus:border-blue-500/50 transition-colors font-mono uppercase resize-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[8px] text-neutral-500 uppercase font-black tracking-widest ml-1">Resource Allocation (Budget)</label>
                        <input 
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            placeholder="$2.5K - $5K USD"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2 text-xs text-blue-400 placeholder:text-neutral-700 outline-none focus:border-blue-500/50 transition-colors font-mono uppercase"
                        />
                    </div>
                </div>
            </div>

            <button 
                onClick={handleDeploy}
                disabled={isDeploying}
                className="mission-panel w-full py-4 glass-panel border border-blue-500/30 hover:bg-blue-500/10 transition-all text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-wait"
            >
                <Globe className={`w-3 h-3 text-blue-400 ${isDeploying ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-700`} />
                {isDeploying ? "DEPLOYING..." : "DEPLOY MISSION"}
            </button>
        </div>
    );
}
