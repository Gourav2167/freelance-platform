"use client";

import Link from "next/link";
import { LogOut, Home, Compass, LayoutDashboard } from "lucide-react";
import { useUserStore } from "@/lib/userStore";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Navigation() {
    const { isAuthenticated, role, logout, syncProfile } = useUserStore();
    const supabase = createClient();
    const navRef = useRef<HTMLElement>(null);
    const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                await syncProfile(supabase);
            }
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (session) {
                    await syncProfile(supabase);
                }
            }
        );

        // Entrance Animation
        if (navRef.current) {
            gsap.fromTo(navRef.current,
                { y: -100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, ease: "expo.out", delay: 0.5 }
            );
        }

        return () => subscription.unsubscribe();
    }, [syncProfile, supabase.auth]);

    const handleHover = (index: number) => {
        const el = linkRefs.current[index];
        if (el) {
            gsap.to(el, { scale: 1.05, duration: 0.3, ease: "power2.out" });
        }
    };

    const handleHoverExit = (index: number) => {
        const el = linkRefs.current[index];
        if (el) {
            gsap.to(el, { scale: 1, duration: 0.3, ease: "power2.out" });
        }
    };

    return (
        <nav
            ref={navRef}
            className="fixed top-0 left-0 right-0 z-50 px-8 py-6 pointer-events-none flex justify-between items-center opacity-0"
        >
            <div className="flex items-center gap-8 pointer-events-auto">
                <Link
                    href="/"
                    ref={el => { if (el) linkRefs.current[0] = el; }}
                    onMouseEnter={() => handleHover(0)}
                    onMouseLeave={() => handleHoverExit(0)}
                    className="text-white font-black tracking-[0.3em] text-xl group relative font-outfit"
                >
                    VASUDHA
                    <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-emerald-500 transition-all group-hover:w-full" />
                </Link>

                <div className="flex items-center gap-6 glass-panel px-6 py-2 rounded-full border border-white/5 shadow-2xl backdrop-blur-3xl">
                    {[
                        { href: '/', icon: Home, label: 'Home' },
                        { href: '/explore', icon: Compass, label: 'Explore' },
                        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' }
                    ].map((item, i) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            ref={el => { if (el) linkRefs.current[i + 1] = el; }}
                            onMouseEnter={() => handleHover(i + 1)}
                            onMouseLeave={() => handleHoverExit(i + 1)}
                            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] font-black group font-inter"
                        >
                            <item.icon className="w-3.5 h-3.5 group-hover:text-emerald-400 transition-colors" />
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4 pointer-events-auto">
                {isAuthenticated ? (
                    <div className="flex items-center gap-4 glass-panel pl-6 pr-2 py-2 rounded-full border border-white/5 shadow-2xl backdrop-blur-3xl">
                        <div className="flex flex-col items-end">
                            <span className="text-[7px] text-emerald-500 uppercase tracking-widest font-black leading-none mb-1">AUTH ACTIVE</span>
                            <span className="text-[10px] text-white uppercase tracking-tighter font-black font-outfit">
                                {role === 'freelancer' ? 'Freelancer' : 'Organization'}
                            </span>
                        </div>
                        <button
                            onClick={logout}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all text-neutral-400 hover:text-red-400 group"
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <Link
                        href="/login"
                        ref={el => { if (el) linkRefs.current[4] = el; }}
                        onMouseEnter={() => handleHover(4)}
                        onMouseLeave={() => handleHoverExit(4)}
                        className="glass-panel px-8 py-3 rounded-full border border-white/10 text-white text-[10px] uppercase tracking-[0.2em] font-black hover:bg-white/10 transition-all shadow-xl font-outfit"
                    >
                        Inbound Access
                    </Link>
                )}
            </div>
        </nav>
    );
}
