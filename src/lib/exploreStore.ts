import { create } from 'zustand';
import * as THREE from 'three';
import { createClient } from '@/utils/supabase/client';

export interface JobNode {
    id: string; // Changed to string for UUID
    title: string;
    category: string;
    budget: string;
    position: THREE.Vector3;
    description: string;
    organization_id: string;
}

export interface FreelancerNode {
    id: string; // Changed to string for UUID
    name: string;
    role: string;
    level: string;
    category: string;
    position: THREE.Vector3;
    bio: string;
}

interface ExploreState {
    missions: JobNode[];
    freelancers: FreelancerNode[];
    isLoading: boolean;
    missionsFetched: boolean;
    freelancersFetched: boolean;
    hoveredJob: JobNode | null;
    setHoveredJob: (job: JobNode | null) => void;
    selectedJob: JobNode | null;
    setSelectedJob: (job: JobNode | null) => void;
    hoveredFreelancer: FreelancerNode | null;
    setHoveredFreelancer: (freelancer: FreelancerNode | null) => void;
    selectedFreelancer: FreelancerNode | null;
    setSelectedFreelancer: (freelancer: FreelancerNode | null) => void;
    cameraTarget: THREE.Vector3 | null;
    setCameraTarget: (target: THREE.Vector3 | null) => void;
    fetchMissions: (force?: boolean) => Promise<void>;
    fetchFreelancers: (force?: boolean) => Promise<void>;
}

// Simple seeded random to keep positions stable for the same ID
const getStablePosition = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = ((hash << 5) - hash) + id.charCodeAt(i);
        hash |= 0;
    }
    const x = (Math.sin(hash) * 25);
    const y = (Math.cos(hash * 1.5) * 25);
    const z = (Math.sin(hash * 2) * 25) - 30;
    return new THREE.Vector3(x, y, z);
};

export const useExploreStore = create<ExploreState>((set) => ({
    missions: [],
    freelancers: [],
    isLoading: false,
    missionsFetched: false,
    freelancersFetched: false,
    hoveredJob: null,
    setHoveredJob: (job) => set({ hoveredJob: job }),
    selectedJob: null,
    setSelectedJob: (job) => set({ selectedJob: job }),
    hoveredFreelancer: null,
    setHoveredFreelancer: (freelancer) => set({ hoveredFreelancer: freelancer }),
    selectedFreelancer: null,
    setSelectedFreelancer: (freelancer) => set({ selectedFreelancer: freelancer }),
    cameraTarget: null,
    setCameraTarget: (target) => set({ cameraTarget: target }),

    fetchMissions: async (force = false) => {
        if (useExploreStore.getState().isLoading || (useExploreStore.getState().missionsFetched && !force)) return;
        
        set({ isLoading: true });
        const supabase = createClient();
        const { data, error } = await supabase
            .from('missions')
            .select('*')
            .eq('status', 'active');
        
        if (error) {
            console.error("FETCH_MISSIONS_ERR", error);
            set({ isLoading: false });
            return;
        }

        const getCategory = (title: string) => {
            const t = title.toLowerCase();
            if (t.includes('ai') || t.includes('neural')) return 'ai';
            if (t.includes('ui') || t.includes('design')) return 'design';
            if (t.includes('cyber') || t.includes('security')) return 'backend';
            return 'frontend';
        };

        const mapped: JobNode[] = (data || []).map((m) => ({
            id: m.id,
            title: m.title,
            category: getCategory(m.title),
            budget: m.budget || 'standard',
            description: m.description,
            organization_id: m.organization_id,
            position: getStablePosition(m.id)
        }));

        set({ missions: mapped, isLoading: false, missionsFetched: true });
    },

    fetchFreelancers: async (force = false) => {
        if (useExploreStore.getState().isLoading || (useExploreStore.getState().freelancersFetched && !force)) return;

        set({ isLoading: true });
        const supabase = createClient();
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'freelancer');

        if (error) {
            console.error("FETCH_FREELANCERS_ERR", error);
            set({ isLoading: false });
            return;
        }

        const getCategory = (name: string, bio: string) => {
            const b = (name + bio).toLowerCase();
            if (b.includes('ai') || b.includes('data')) return 'ai';
            if (b.includes('design') || b.includes('ui')) return 'design';
            if (b.includes('rust') || b.includes('go') || b.includes('backend')) return 'backend';
            return 'frontend';
        };

        const mapped: FreelancerNode[] = (data || []).map((p) => ({
            id: p.id,
            name: p.full_name || 'Anonymous',
            role: p.bio?.substring(0, 30) || 'Verified Freelancer',
            level: p.experience_level || 'Expert',
            category: getCategory(p.full_name || '', p.bio || ''),
            bio: p.bio || '',
            position: getStablePosition(p.id)
        }));

        set({ freelancers: mapped, isLoading: false, freelancersFetched: true });
    }
}));
