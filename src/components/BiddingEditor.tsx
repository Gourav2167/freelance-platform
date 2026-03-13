import { useState } from "react";
import { Send, Cpu, Sparkles } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import AlignmentMeterShader from "./canvas/AlignmentMeterShader";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

interface BiddingEditorProps {
    missionId?: string;
    onSuccess?: () => void;
}

export default function BiddingEditor({ missionId = "demo-project-id", onSuccess }: BiddingEditorProps) {
    const [proposal, setProposal] = useState("");
    const [alignment, setAlignment] = useState(0.2);
    const supabase = createClient();

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setProposal(text);

        const keywords = ['react', 'node', 'budget', 'timeline', 'scalable'];
        const lower = text.toLowerCase();

        let score = 0.2;
        keywords.forEach(kw => {
            if (lower.includes(kw)) score += 0.16;
        });

        setAlignment(Math.min(score, 1.0));
    };

    const generateDraft = () => {
        const draft = "Hi there,\n\nI understand you need a scalable application built with React and Node.js. My timeline allows me to complete this within your required budget constraints.";
        setProposal(draft);
        setAlignment(0.95);
        toast.success("Proposal Draft generated successfully.");
    };

    const handleSubmit = async () => {
        if (!proposal.trim()) {
            toast.error("Invalid Operation", {
                description: "Please draft a project proposal before submitting."
            });
            return;
        }

        const submitBid = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Authentication missing");

            const { error } = await supabase
                .from('bids')
                .insert({
                    mission_id: missionId,
                    freelancer_id: user.id,
                    proposal: proposal,
                    match_score: alignment
                });

            if (error) throw error;
            return true;
        };
        
        toast.promise(submitBid(), {
            loading: 'Submitting project proposal...',
            success: () => {
                setProposal("");
                if (onSuccess) onSuccess();
                return 'Proposal submitted. Your bid is now live.';
            },
            error: (err) => `Submission failed: ${err.message}`,
        });
    };

    return (
        <div className="w-[400px] glass-panel rounded-2xl p-5 pointer-events-auto border border-white/10 z-30 transition-transform hover:-translate-y-1 duration-500">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold flex items-center gap-2 tracking-tight">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Smart Proposal
                </h2>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-obsidian-200 uppercase tracking-widest font-bold">Match Score</span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)] relative bg-obsidian-900 overflow-hidden">
                        <div 
                            className="w-full h-full transition-all duration-700 ease-out"
                            style={{ 
                                background: `radial-gradient(circle at center, ${alignment > 0.6 ? '#10b981' : alignment > 0.3 ? '#f59e0b' : '#ef4444'} 0%, transparent 70%)`,
                                opacity: 0.4 + (alignment * 0.6),
                                transform: `scale(${0.8 + (alignment * 0.4)})`,
                                filter: `blur(${4 * (1 - alignment)}px)`
                            }}
                        />
                        <div className="absolute inset-0 border border-white/5 rounded-full pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="relative group">
                <textarea
                    className="w-full h-40 bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30 focus:bg-black/60 transition-all resize-none placeholder-white/30"
                    placeholder="Draft your proposal... 
Keywords like 'React', 'Node.js', and 'scalable' will increase your project relevance meter."
                    value={proposal}
                    onChange={handleChange}
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(255,255,255,0.2) transparent'
                    }}
                />
            </div>

            <div className="flex items-center justify-between mt-5">
                <button
                    onClick={generateDraft}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 transition-colors text-xs font-semibold border border-blue-500/20"
                >
                    <Cpu className="w-3.5 h-3.5" />
                    AI Draft
                </button>
                <button 
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-obsidian-900 transition-all text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                >
                    Submit Proposal
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
