"use client";

import { MessageSquare, X, ChevronRight, Zap, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { globalState } from "@/lib/store";
import { gsap } from "gsap";

export default function AIInterface() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "ai", content: "AI Assistant online. Project directory loaded. Ask me about the project budget, stack, or timeline." }
    ]);
    const [input, setInput] = useState("");
    const panelRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open) {
            gsap.to(panelRef.current, { x: 0, duration: 0.8, ease: "expo.out" });
        } else {
            gsap.to(panelRef.current, { x: "100%", duration: 0.8, ease: "expo.in" });
        }
    }, [open]);

    const handleSend = () => {
        if (!input.trim()) return;
        const newMsg = { role: "user", content: input };
        setMessages(prev => [...prev, newMsg]);
        setInput("");

        // Simulate AI response
        setTimeout(() => {
            let reply = "I've retrieved relevant project details from the directory.";
            const lower = newMsg.content.toLowerCase();

            const randomPoint = new THREE.Vector3(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 4,
                -5 - Math.random() * 20
            );

            if (lower.includes("budget")) {
                reply = "Budget analysis complete. Allocations prioritized for decentralized infrastructure.";
            } else if (lower.includes("tech") || lower.includes("stack")) {
                reply = "Technology stack identified: React/Next.js core with high-performance 3D visualization layers.";
            }

            setMessages(prev => [...prev, { role: "ai", content: reply }]);
            globalState.focusTarget = randomPoint;

            setTimeout(() => {
                if (globalState.focusTarget === randomPoint) {
                    globalState.focusTarget = null;
                }
            }, 5000);

        }, 800);
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setOpen(true)}
                className={`fixed right-0 top-1/2 -translate-y-1/2 z-30 bg-white/5 border border-white/10 p-4 rounded-l-2xl backdrop-blur-2xl shadow-3xl hover:bg-emerald-500/10 transition-all pointer-events-auto group ${open ? 'translate-x-[100%]' : 'translate-x-0'}`}
            >
                <div className="relative">
                    <MessageSquare className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                </div>
            </button>

            {/* Sliding Panel */}
            <div
                ref={panelRef}
                className={`fixed right-0 top-0 bottom-0 w-[400px] z-50 glass-panel border-l border-white/10 px-8 py-10 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl translate-x-full pointer-events-auto`}
            >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <Sparkles className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-white text-lg font-black tracking-widest uppercase font-outfit">Nexus AI</h2>
                            <span className="text-[8px] text-emerald-500 font-black tracking-[0.3em] uppercase opacity-60">Context Protocol v2.4</span>
                        </div>
                    </div>
                    <button onClick={() => setOpen(false)} className="p-3 hover:bg-white/5 rounded-full transition-all text-neutral-500 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div ref={listRef} className="flex-1 overflow-y-auto space-y-6 mb-8 pr-2 custom-scrollbar">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <span className="text-[8px] text-neutral-500 font-black tracking-[0.2em] mb-2 uppercase px-1">
                                {m.role === 'user' ? 'Individual' : 'Nexus Assistant'}
                            </span>
                            <div
                                className={`p-5 rounded-2xl text-sm leading-relaxed font-medium ${m.role === 'user'
                                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-50 text-right rounded-tr-none shadow-[0_0_20px_rgba(16,185,129,0.05)]'
                                    : 'bg-white/[0.02] border border-white/5 text-neutral-300 rounded-tl-none pr-8'
                                    }`}
                            >
                                {m.content}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="relative group/input">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur opacity-10 group-focus-within/input:opacity-30 transition duration-1000" />
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Interrogate project context..."
                            className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-5 pl-6 pr-14 text-xs font-black tracking-widest text-white focus:outline-none focus:border-emerald-500/30 transition-all font-mono uppercase"
                        />
                        <button
                            onClick={handleSend}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-all"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between opacity-40">
                    <div className="flex items-center gap-2">
                        <Zap className="w-3 h-3 text-emerald-500" />
                        <span className="text-[8px] text-neutral-500 font-black tracking-widest uppercase">System Stable</span>
                    </div>
                    <span className="text-[8px] text-neutral-500 font-mono">HASH: 771-NX-2024</span>
                </div>
            </div>
        </>
    );
}
