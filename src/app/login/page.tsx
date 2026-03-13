"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUserStore, UserRole } from "@/lib/userStore";
import { User, Building2, ArrowLeft } from "lucide-react";
import { gsap } from "gsap";
import SceneWrapper from "@/components/canvas/SceneWrapper";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [step, setStep] = useState<"role" | "auth">("role");

    const { setRole, role } = useUserStore();
    const supabase = createClient();

    const mainRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (mainRef.current) {
            const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
            tl.fromTo(mainRef.current.querySelectorAll('.animate-item'),
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.1, duration: 1.5, delay: 0.2 }
            );
        }
    }, [step]);

    const handleRoleSelect = (selectedRole: UserRole) => {
        setRole(selectedRole);
        setStep("auth");
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");
        setErrorMessage("");

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        });

        if (error) {
            setStatus("error");
            setErrorMessage(error.message);
        } else {
            setStatus("sent");
        }
    };

    return (
        <div className="relative w-screen h-screen bg-[#030305] flex flex-col items-center justify-center overflow-hidden">
            <SceneWrapper />

            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-30" />

            <div
                className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
                    backgroundSize: `4rem 4rem`
                }}
            />

            <main ref={mainRef} className="relative z-10 flex flex-col items-center w-full max-w-md px-8">
                <div className="mb-12 text-center w-full animate-item">
                    <h1 className="text-white text-4xl font-black tracking-[0.2em] uppercase mb-2 drop-shadow-2xl">
                        Sign In
                    </h1>
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                    <p className="text-neutral-500 text-[10px] tracking-[0.3em] uppercase mt-4 font-bold">
                        {step === "role" ? "Choose Access Level" : "Identity Verification"}
                    </p>
                </div>

                {step === "role" ? (
                    <div className="grid grid-cols-1 gap-4 w-full">
                        <button
                            onClick={() => handleRoleSelect("freelancer")}
                            className="glass-panel p-6 flex items-center gap-4 border border-white/5 hover:border-emerald-500/50 transition-all group text-left animate-item"
                        >
                            <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.1)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold tracking-widest uppercase text-sm">Freelancer</h3>
                                <p className="text-neutral-500 text-[10px] mt-1 uppercase tracking-tight">Access global project directory</p>
                            </div>
                        </button>

                        <button
                            onClick={() => handleRoleSelect("organization")}
                            className="glass-panel p-6 flex items-center gap-4 border border-white/5 hover:border-blue-500/50 transition-all group text-left animate-item"
                        >
                            <div className="p-4 rounded-full bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-[0_0_20px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold tracking-widest uppercase text-sm">Organization</h3>
                                <p className="text-neutral-500 text-[10px] mt-1 uppercase tracking-tight">Deploy contracts & hire talent</p>
                            </div>
                        </button>
                    </div>
                ) : (
                    <div className="w-full">
                        {status === "sent" ? (
                            <div className="glass-panel w-full p-10 text-center flex flex-col items-center justify-center animate-item">
                                <div className="w-16 h-16 rounded-full border-2 border-emerald-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                                </div>
                                <h2 className="text-white text-xl font-bold tracking-[0.2em] mb-3">LINK ENROUTE</h2>
                                <p className="text-neutral-400 text-xs leading-relaxed uppercase tracking-widest">
                                    Check your inbox for the access key.
                                </p>
                                <div className="mt-8 pt-6 border-t border-white/5 w-full">
                                    <span className="text-emerald-500 font-mono text-xs">{email}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full relative group animate-item">
                                <button
                                    onClick={() => setStep("role")}
                                    className="absolute -top-12 left-0 text-neutral-500 hover:text-white flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] transition-all font-black"
                                >
                                    <ArrowLeft className="w-3 h-3" /> [ Back ]
                                </button>

                                <form onSubmit={handleLogin} className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg blur opacity-10 group-hover:opacity-30 transition duration-1000" />

                                    <div className="relative flex items-center bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-xl overflow-hidden">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="ENTER EMAIL ADDRESS..."
                                            className="w-full bg-transparent text-white font-mono text-xs tracking-widest outline-none py-6 px-6 placeholder:text-neutral-600 transition-colors"
                                            required
                                            disabled={status === "loading"}
                                        />
                                        <button
                                            type="submit"
                                            disabled={status === "loading" || !email}
                                            className="px-8 py-6 bg-white/5 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-[0.2em] uppercase transition-all border-l border-white/5 disabled:opacity-50"
                                        >
                                            {status === "loading" ? "..." : "SEND"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}

                {status === "error" && (
                    <div className="mt-12 p-3 border border-red-500/20 bg-red-500/5 text-red-500 text-[9px] tracking-[0.2em] font-bold text-center uppercase animate-item">
                        System Error: {errorMessage}
                    </div>
                )}
            </main>
        </div>
    );
}
