import { create } from 'zustand';
import { persist } from "zustand/middleware";

export type UserRole = 'freelancer' | 'organization' | null;

interface UserState {
    role: UserRole;
    isAuthenticated: boolean;
    setRole: (role: UserRole) => void;
    setAuthenticated: (status: boolean) => void;
    syncProfile: (supabase: any) => Promise<void>;
    logout: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            role: null,
            isAuthenticated: false,
            setRole: (role) => set({ role }),
            setAuthenticated: (status) => set({ isAuthenticated: status }),
            syncProfile: async (supabase) => {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    set({ role: profile.role as UserRole, isAuthenticated: true });
                } else {
                    // Create profile if role was selected during login
                    const currentRole = useUserStore.getState().role;
                    if (currentRole) {
                        await supabase
                            .from('profiles')
                            .insert({ id: user.id, role: currentRole, full_name: user.email?.split('@')[0] });
                        set({ isAuthenticated: true });
                    }
                }
            },
            logout: () => set({ role: null, isAuthenticated: false }),
        }),
        {
            name: 'nexus-user-storage',
        }
    )
);
