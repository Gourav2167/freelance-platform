import { create } from 'zustand';
import { persist } from "zustand/middleware";
import { createClient } from "@/utils/supabase/client";

export type UserRole = 'freelancer' | 'organization' | null;

interface UserState {
    user: any | null;
    role: UserRole;
    isAuthenticated: boolean;
    setRole: (role: UserRole) => void;
    setAuthenticated: (status: boolean) => void;
    syncProfile: () => Promise<void>; 
    logout: () => void;
}

let activeSyncPromise: Promise<void> | null = null;

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            role: null,
            isAuthenticated: false,
            setRole: (role) => set({ role }),
            setAuthenticated: (status) => set({ isAuthenticated: status }),
            syncProfile: async () => {
                if (activeSyncPromise) return activeSyncPromise;

                activeSyncPromise = (async () => {
                    let retries = 2;
                    while (retries > 0) {
                        try {
                            const supabase = createClient();
                            const { data: { user }, error: userError } = await supabase.auth.getUser();
                            
                            if (userError) throw userError;
                            if (!user) {
                                set({ user: null, role: null, isAuthenticated: false });
                                return;
                            }

                            set({ user });

                            const { data, error } = await supabase
                                .from('profiles')
                                .select('role')
                                .eq('id', user.id)
                                .maybeSingle();

                            if (error) throw error;
                            
                            if (data) {
                                set({ role: data.role as UserRole, isAuthenticated: true });
                            } else {
                                set({ isAuthenticated: true });
                            }
                            return; 
                        } catch (err: any) {
                            if (err.name === 'AbortError' || err.message?.includes('Lock broken')) {
                                console.warn("AUTH_LOCK_CONTENTION: Retrying sync...");
                                await new Promise(r => setTimeout(r, 200));
                                retries--;
                                continue;
                            }
                            console.error("SYNC_PROFILE_ERROR:", err);
                            break;
                        }
                    }
                })();

                try {
                    await activeSyncPromise;
                } finally {
                    activeSyncPromise = null;
                }
            },
            logout: () => {
                const supabase = createClient();
                supabase.auth.signOut();
                set({ user: null, role: null, isAuthenticated: false });
            },
        }),
        {
            name: 'user-storage',
        }
    )
);
