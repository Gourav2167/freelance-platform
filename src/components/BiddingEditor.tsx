"use client";

import { useState } from "react";
import { Send, Cpu, Sparkles } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import AlignmentMeterShader from "./canvas/AlignmentMeterShader";

export default function BiddingEditor() {
    const [proposal, setProposal] = useState("");
    const [alignment, setAlignment] = useState(0.2); // Start low

    // Calculate alignment roughly based on keywords typed
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setProposal(text);

        // Fake alignment calculation mapping to client specs:
        const keywords = ['react', 'node', 'budget', 'timeline', 'scalable'];
        const lower = text.toLowerCase();

        let score = 0.2;
        keywords.forEach(kw => {
            if (lower.includes(kw)) score += 0.16; // 5 * 0.16 = 0.8, max 1.0
        });

        setAlignment(Math.min(score, 1.0));
    };

    const generateDraft = () => {
        const draft = "Hi there,\n\nI understand you need a scalable application built with React and Node.js. My timeline allows me to complete this within your required budget constraints.";
        setProposal(draft);
        setAlignment(0.95); // High relevance score for generated draft
    };

    return (
        <div className="fixed bottom-8 left-8 w-[400px] glass-panel rounded-2xl p-5 pointer-events-auto border border-white/10 z-30 transition-transform hover:-translate-y-1 duration-500">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold flex items-center gap-2 tracking-tight">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Smart Proposal
                </h2>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-obsidian-200 uppercase tracking-widest font-bold">Match Score</span>
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)] relative">
                        <div className="absolute inset-0 pointer-events-none z-10 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]" />
                        <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 60 }} className="w-full h-full bg-obsidian-900">
                            <AlignmentMeterShader alignment={alignment} />
                        </Canvas>
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
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-obsidian-900 transition-all text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                    Submit Bid
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
