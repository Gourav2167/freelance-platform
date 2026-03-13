import { create } from 'zustand';
import * as THREE from 'three';

export interface JobNode {
    id: number;
    title: string;
    category: 'frontend' | 'backend' | 'ai' | 'design';
    budget: 'low' | 'medium' | 'high';
    position: THREE.Vector3;
}

export interface FreelancerNode {
    id: number;
    name: string;
    role: string;
    level: string;
    category: 'frontend' | 'backend' | 'ai' | 'design';
    position: THREE.Vector3;
}

interface ExploreState {
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
}

export const useExploreStore = create<ExploreState>((set) => ({
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
}));
