"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2, ShieldAlert, LogOut } from "lucide-react";
import Navigation from "@/components/ui/Navigation";
import SceneWrapper from "@/components/canvas/SceneWrapper";
import FreelancerProfile from "@/components/profile/FreelancerProfile";
import OrganizationProfile from "@/components/profile/OrganizationProfile";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        async function fetchProfile() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push("/login");
                    return;
                }

                const { data, error: profileError } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                if (profileError) throw profileError;
                setProfile(data);
            } catch (err: any) {
                console.error("Profile fetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [supabase, router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030305] flex flex-col items-center justify-center p-6 text-center">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-6" />
                <h1 className="text-xl font-bold text-white uppercase tracking-[0.5em] font-outfit">Loading Profile</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#030305] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center mb-8 border border-rose-500/20">
                    <ShieldAlert className="w-10 h-10 text-rose-500" />
                </div>
                <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 font-outfit">Connection Error</h1>
                <p className="text-neutral-400 max-w-md mb-10 leading-relaxed">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-emerald-500 transition-colors"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <main className="relative min-h-screen bg-[#030305] overflow-x-hidden pt-32 pb-20">
            <Navigation />
            <SceneWrapper />

            {/* Background Atmosphere */}
            <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_60%_40%,_rgba(16,185,129,0.05),_transparent_50%)] pointer-events-none" />
            <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_40%_60%,_rgba(59,130,246,0.05),_transparent_50%)] pointer-events-none" />

            <div className="relative z-10 container mx-auto px-6">
                <div className="flex justify-end mb-12">
                    <button
                        onClick={handleSignOut}
                        className="group flex items-center gap-3 px-6 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-300 text-xs font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                    >
                        Sign Out <LogOut className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {profile?.role === "freelancer" ? (
                    <FreelancerProfile data={profile} />
                ) : profile?.role === "organization" ? (
                    <OrganizationProfile data={profile} />
                ) : (
                    <div className="text-center py-20 text-neutral-500 uppercase tracking-widest text-xs font-black">
                        Loading account data...
                    </div>
                )}
            </div>
        </main>
    );
}
