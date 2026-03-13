"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUserStore, UserRole } from "@/lib/userStore";
import { User, Building2, ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [authMode, setAuthMode] = useState<"login" | "signup">("login");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [step, setStep] = useState<"role" | "auth">("role");

    const { setRole, role, syncProfile } = useUserStore();
    const supabase = createClient();
    const router = useRouter();

    const mainRef = useRef<HTMLElement>(null);
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkExistingSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                await syncProfile();
                router.push("/dashboard");
            }
        };
        checkExistingSession();
        router.prefetch("/dashboard");
    }, [router, supabase.auth, syncProfile]);

    useEffect(() => {
        const animateItems = mainRef.current?.querySelectorAll('.animate-item');
        if (animateItems && animateItems.length > 0) {
            const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
            tl.fromTo(animateItems,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.1, duration: 1.5, delay: 0.2 }
            );
        }
    }, [step]);

    useEffect(() => {
        if (!formRef.current || step !== "auth") return;

        gsap.fromTo(formRef.current,
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }
        );
    }, [authMode, step]);

    const handleRoleSelect = (selectedRole: UserRole) => {
        setRole(selectedRole);
        setStep("auth");
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        setStatus("loading");

        if (authMode === "login") {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error("LOGIN_ERROR:", error);
                setStatus("error");
                toast.error("LOGIN FAILED", {
                    description: error.message
                });
                return;
            } 
            
            try {
                await syncProfile();
                setStatus("success");
                toast.success("Authentication confirmed. Redirecting to dashboard...");
                router.push("/dashboard");
            } catch (syncErr) {
                console.error("POST_AUTH_SYNC_FAILED:", syncErr);
                setStatus("error");
                toast.error("PROFILE SYNC FAILED", {
                    description: "Authenticated but profile could not be synchronized."
                });
            }
        } else {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        role: role
                    }
                }
            });

            if (error) {
                setStatus("error");
                toast.error("INITIALIZATION FAILED", {
                    description: error.message
                });
            } else {
                setStatus("success");
                toast.success("IDENTITY LOGGED", {
                    description: "Please check your inbox for the secure confirmation link."
                });
                setTimeout(() => setAuthMode("login"), 2000);
            }
        }
    };

    return (
        <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
            <main ref={mainRef} className="relative z-10 flex flex-col items-center w-full max-w-md px-8 py-20">
                <div className="mb-12 text-center w-full animate-item">
                    <h1 className="text-white text-4xl font-black tracking-[0.2em] uppercase mb-2 drop-shadow-2xl">
                        {authMode === "login" ? "Sign In" : "Register"}
                    </h1>
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                    <p className="text-neutral-500 text-[10px] tracking-[0.3em] uppercase mt-4 font-bold">
                        {step === "role" ? "Choose Account Type" : `${role || 'Secure'} Account Verification`}
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
                    <div className="w-full" ref={formRef}>
                        {status === "success" && authMode === "signup" ? (
                            <div className="glass-panel w-full p-10 text-center flex flex-col items-center justify-center animate-item">
                                <div className="w-16 h-16 rounded-full border-2 border-emerald-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                                </div>
                                <h2 className="text-white text-xl font-bold tracking-[0.2em] mb-3">ACCOUNT CREATED</h2>
                                <p className="text-neutral-400 text-xs leading-relaxed uppercase tracking-widest">
                                    Signup complete. Proceeding to login...
                                </p>
                            </div>
                        ) : (
                            <div className="w-full relative group">
                                <button
                                    onClick={() => setStep("role")}
                                    className="absolute -top-12 left-0 text-neutral-500 hover:text-white flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] transition-all font-black"
                                >
                                    <ArrowLeft className="w-3 h-3" /> [ Back ]
                                </button>

                                <form onSubmit={handleAuth} className="space-y-4">
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl blur opacity-30 group-focus-within:opacity-100 transition duration-1000" />
                                        <div className="relative flex items-center bg-[#0a0a0c]/80 backdrop-blur-3xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                                            <div className="pl-6 text-neutral-500 group-focus-within:text-emerald-500 transition-colors">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value.trim())}
                                                placeholder="EMAIL_IDENTIFIER"
                                                className="w-full bg-transparent text-white font-mono text-xs tracking-[0.2em] outline-none py-6 px-6 placeholder:text-neutral-700 uppercase"
                                                required
                                                disabled={status === "loading"}
                                            />
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl blur opacity-30 group-focus-within:opacity-100 transition duration-1000" />
                                        <div className="relative flex items-center bg-[#0a0a0c]/80 backdrop-blur-3xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                                            <div className="pl-6 text-neutral-500 group-focus-within:text-blue-500 transition-colors">
                                                <Lock className="w-4 h-4" />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="SECURE_PASSPHRASE"
                                                className="w-full bg-transparent text-white font-mono text-xs tracking-[0.2em] outline-none py-6 px-6 placeholder:text-neutral-700"
                                                required
                                                disabled={status === "loading"}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="pr-6 text-neutral-600 hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === "loading" || !email || !password}
                                        className="w-full py-6 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white text-[11px] font-black tracking-[0.4em] uppercase transition-all border border-emerald-500/20 hover:border-emerald-400 rounded-xl disabled:opacity-30 shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]"
                                    >
                                        {status === "loading" ? "AUTHENTICATING..." : authMode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
                                    </button>

                                    <div className="flex justify-center mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
                                            className="text-[9px] uppercase tracking-[0.3em] text-neutral-500 hover:text-emerald-400 transition-colors font-black"
                                        >
                                            {authMode === "login" ? "[ Create New Account ]" : "[ Sign In to Existing Account ]"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}

                {/* Inline error box removed. Relying on global Toast notifications. */}
            </main>
        </div>
    );
}
