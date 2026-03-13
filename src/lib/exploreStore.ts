import { create } from 'zustand';
import * as THREE from 'three';

// ── Types ──────────────────────────────────────────────────────────────────

export type ProjectDifficulty = 'Easy' | 'Medium' | 'Hard';
export type ProjectCategory = 'frontend' | 'backend' | 'ai' | 'design' | 'mobile' | 'devops';

export interface Project {
    id: string;
    title: string;
    description: string;
    budget: string;
    skills: string[];
    difficulty: ProjectDifficulty;
    aiSummary: string;
    category: ProjectCategory;
    postedDate: string; // ISO string
}

// Legacy 3D node type (kept for NexusConstellations compatibility)
export interface JobNode {
    id: number;
    title: string;
    category: 'frontend' | 'backend' | 'ai' | 'design';
    budget: 'low' | 'medium' | 'high';
    position: THREE.Vector3;
}

// ── Filters ────────────────────────────────────────────────────────────────

interface ExploreFilters {
    searchQuery: string;
    selectedSkills: string[];
    budgetRange: [number, number]; // [min, max] in thousands
    difficultyFilter: ProjectDifficulty | 'All';
    aiRecommended: boolean;
}

// ── Store ──────────────────────────────────────────────────────────────────

interface ExploreState {
    // Legacy 3D fields
    hoveredJob: JobNode | null;
    setHoveredJob: (job: JobNode | null) => void;
    selectedJob: JobNode | null;
    setSelectedJob: (job: JobNode | null) => void;
    cameraTarget: THREE.Vector3 | null;
    setCameraTarget: (target: THREE.Vector3 | null) => void;

    // Netflix explore fields
    projects: Project[];
    freelancerSkills: string[];
    filters: ExploreFilters;
    setSearchQuery: (q: string) => void;
    toggleSkillFilter: (skill: string) => void;
    setBudgetRange: (range: [number, number]) => void;
    setDifficultyFilter: (d: ProjectDifficulty | 'All') => void;
    toggleAiRecommended: () => void;
    resetFilters: () => void;
}

// ── AI Match Score ─────────────────────────────────────────────────────────

export function computeMatchScore(projectSkills: string[], freelancerSkills: string[]): number {
    if (projectSkills.length === 0) return 0;
    const matched = projectSkills.filter(s =>
        freelancerSkills.some(fs => fs.toLowerCase() === s.toLowerCase())
    ).length;
    return Math.round((matched / projectSkills.length) * 100);
}

// ── Mock Data ──────────────────────────────────────────────────────────────

const MOCK_PROJECTS: Project[] = [
    {
        id: 'p1', title: 'Neural Style Transfer API',
        description: 'Build a production-ready API that applies artistic neural style transfer to user-uploaded images in real-time.',
        budget: '$8,000 – $15,000', skills: ['Python', 'PyTorch', 'FastAPI', 'Docker'],
        difficulty: 'Hard', aiSummary: 'Deep-learning image pipeline requiring GPU inference optimization and containerized deployment.',
        category: 'ai', postedDate: '2026-03-12T10:00:00Z',
    },
    {
        id: 'p2', title: 'E-Commerce Dashboard Redesign',
        description: 'Redesign the analytics dashboard for a major e-commerce platform focusing on real-time sales data visualization.',
        budget: '$5,000 – $9,000', skills: ['React', 'TypeScript', 'D3.js', 'Tailwind CSS'],
        difficulty: 'Medium', aiSummary: 'Frontend-heavy project with complex charting requirements and responsive design expectations.',
        category: 'frontend', postedDate: '2026-03-11T14:30:00Z',
    },
    {
        id: 'p3', title: 'Blockchain Supply-Chain Tracker',
        description: 'Develop a decentralized supply-chain tracking application with smart-contract verification on Ethereum.',
        budget: '$20,000 – $35,000', skills: ['Solidity', 'Node.js', 'React', 'Web3.js'],
        difficulty: 'Hard', aiSummary: 'Full-stack Web3 build: smart contracts, event indexing, and a polished frontend explorer.',
        category: 'backend', postedDate: '2026-03-10T08:15:00Z',
    },
    {
        id: 'p4', title: 'Brand Identity System',
        description: 'Create a comprehensive brand identity for a fintech startup including logo, typography, color palette, and guidelines.',
        budget: '$3,000 – $6,000', skills: ['Figma', 'Illustrator', 'Brand Strategy'],
        difficulty: 'Easy', aiSummary: 'Visual design project needing strong typographic sensibility and fintech domain awareness.',
        category: 'design', postedDate: '2026-03-13T06:00:00Z',
    },
    {
        id: 'p5', title: 'LLM-Powered Legal Assistant',
        description: 'Fine-tune and deploy a large language model to assist lawyers with contract review and clause extraction.',
        budget: '$25,000 – $40,000', skills: ['Python', 'LangChain', 'OpenAI', 'Next.js', 'Supabase'],
        difficulty: 'Hard', aiSummary: 'Retrieval-augmented generation system with domain-specific fine-tuning and secure data handling.',
        category: 'ai', postedDate: '2026-03-09T12:00:00Z',
    },
    {
        id: 'p6', title: 'Portfolio Website Builder',
        description: 'Build a drag-and-drop portfolio builder with template selection, custom domains, and CMS integration.',
        budget: '$4,000 – $8,000', skills: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
        difficulty: 'Medium', aiSummary: 'SaaS product requiring performant drag-and-drop, image optimization, and multi-tenant architecture.',
        category: 'frontend', postedDate: '2026-03-12T16:45:00Z',
    },
    {
        id: 'p7', title: 'Real-Time Chat Microservice',
        description: 'Design and implement a scalable real-time chat microservice supporting 100k+ concurrent WebSocket connections.',
        budget: '$12,000 – $20,000', skills: ['Go', 'WebSocket', 'Redis', 'Docker', 'Kubernetes'],
        difficulty: 'Hard', aiSummary: 'High-throughput systems engineering with message persistence, presence tracking, and horizontal scaling.',
        category: 'backend', postedDate: '2026-03-08T09:30:00Z',
    },
    {
        id: 'p8', title: 'Mobile Fitness Tracker UI',
        description: 'Design pixel-perfect UI screens for an iOS/Android fitness tracking app with gamification elements.',
        budget: '$2,500 – $5,000', skills: ['Figma', 'Prototyping', 'Mobile Design'],
        difficulty: 'Easy', aiSummary: 'Mobile-first design project with emphasis on data visualization and motivational UX patterns.',
        category: 'design', postedDate: '2026-03-13T03:20:00Z',
    },
    {
        id: 'p9', title: 'Predictive Maintenance ML Pipeline',
        description: 'Build an end-to-end ML pipeline for industrial IoT predictive maintenance using sensor time-series data.',
        budget: '$18,000 – $30,000', skills: ['Python', 'TensorFlow', 'Apache Kafka', 'AWS'],
        difficulty: 'Hard', aiSummary: 'Time-series anomaly detection with streaming data ingestion, model serving, and alerting infrastructure.',
        category: 'ai', postedDate: '2026-03-07T11:00:00Z',
    },
    {
        id: 'p10', title: 'SaaS Landing Page',
        description: 'Create a high-converting landing page for a B2B SaaS product with animations and interactive demos.',
        budget: '$2,000 – $4,000', skills: ['React', 'GSAP', 'Tailwind CSS'],
        difficulty: 'Easy', aiSummary: 'Conversion-optimized page requiring smooth scroll animations, testimonials, and CTA optimization.',
        category: 'frontend', postedDate: '2026-03-13T08:00:00Z',
    },
    {
        id: 'p11', title: 'GraphQL Federation Gateway',
        description: 'Architect and implement a federated GraphQL gateway to unify 5 existing REST microservices.',
        budget: '$10,000 – $18,000', skills: ['Node.js', 'GraphQL', 'TypeScript', 'Docker'],
        difficulty: 'Medium', aiSummary: 'API gateway project requiring schema stitching, caching strategy, and performance optimization.',
        category: 'backend', postedDate: '2026-03-11T07:45:00Z',
    },
    {
        id: 'p12', title: 'AR Product Visualizer',
        description: 'Build an augmented reality product visualizer for an e-commerce furniture store using WebXR.',
        budget: '$15,000 – $25,000', skills: ['Three.js', 'WebXR', 'React', 'TypeScript'],
        difficulty: 'Hard', aiSummary: '3D rendering with AR placement, real-world scale calibration, and mobile-first WebXR experience.',
        category: 'frontend', postedDate: '2026-03-06T15:00:00Z',
    },
    {
        id: 'p13', title: 'Automated Email Campaign Engine',
        description: 'Build an intelligent email campaign engine with A/B testing, personalization, and analytics.',
        budget: '$7,000 – $12,000', skills: ['Python', 'Node.js', 'PostgreSQL', 'Redis'],
        difficulty: 'Medium', aiSummary: 'Event-driven email system with template rendering, scheduling, and delivery optimization.',
        category: 'backend', postedDate: '2026-03-10T13:30:00Z',
    },
    {
        id: 'p14', title: 'Sentiment Analysis Dashboard',
        description: 'Create a real-time social media sentiment analysis dashboard with NLP models and live data streaming.',
        budget: '$9,000 – $16,000', skills: ['Python', 'NLP', 'React', 'TypeScript', 'D3.js'],
        difficulty: 'Medium', aiSummary: 'Full-stack NLP application combining language model inference with interactive data visualization.',
        category: 'ai', postedDate: '2026-03-12T09:15:00Z',
    },
    {
        id: 'p15', title: 'Design System Component Library',
        description: 'Create a comprehensive design system with 40+ reusable components, tokens, and documentation.',
        budget: '$8,000 – $14,000', skills: ['React', 'TypeScript', 'Storybook', 'Figma'],
        difficulty: 'Medium', aiSummary: 'Design-engineering hybrid project requiring atomic design methodology and accessibility compliance.',
        category: 'design', postedDate: '2026-03-09T10:00:00Z',
    },
    {
        id: 'p16', title: 'Cross-Platform Meditation App',
        description: 'Build a meditation and mindfulness app with guided sessions, streak tracking, and ambient soundscapes.',
        budget: '$6,000 – $11,000', skills: ['React Native', 'TypeScript', 'Firebase'],
        difficulty: 'Medium', aiSummary: 'Mobile app with audio playback, offline caching, push notifications, and subscription management.',
        category: 'mobile', postedDate: '2026-03-11T18:00:00Z',
    },
    {
        id: 'p17', title: 'CI/CD Pipeline Modernization',
        description: 'Migrate legacy Jenkins pipelines to GitHub Actions with containerized builds and automated deployments.',
        budget: '$5,000 – $9,000', skills: ['GitHub Actions', 'Docker', 'Terraform', 'AWS'],
        difficulty: 'Medium', aiSummary: 'DevOps transformation project with infrastructure-as-code, secret management, and deployment automation.',
        category: 'devops', postedDate: '2026-03-08T14:00:00Z',
    },
    {
        id: 'p18', title: 'AI Chatbot for Customer Support',
        description: 'Develop an intelligent chatbot handling Tier-1 customer support with handoff to human agents.',
        budget: '$10,000 – $18,000', skills: ['Python', 'LangChain', 'OpenAI', 'Node.js', 'WebSocket'],
        difficulty: 'Medium', aiSummary: 'Conversational AI with intent classification, context management, and seamless agent escalation.',
        category: 'ai', postedDate: '2026-03-13T02:00:00Z',
    },
    {
        id: 'p19', title: 'Interactive Data Story Platform',
        description: 'Build a platform where journalists create interactive, scrollytelling data stories with embedded visualizations.',
        budget: '$12,000 – $22,000', skills: ['Next.js', 'TypeScript', 'D3.js', 'GSAP', 'PostgreSQL'],
        difficulty: 'Hard', aiSummary: 'CMS-meets-data-viz platform with scroll-driven animations, embeddable charts, and collaborative editing.',
        category: 'frontend', postedDate: '2026-03-07T09:00:00Z',
    },
    {
        id: 'p20', title: 'Startup Pitch Deck Design',
        description: 'Design a compelling investor pitch deck for a Series A climate-tech startup.',
        budget: '$1,500 – $3,000', skills: ['Figma', 'Presentation Design', 'Brand Strategy'],
        difficulty: 'Easy', aiSummary: 'Narrative-driven visual storytelling with data-heavy slides and impact-focused layout.',
        category: 'design', postedDate: '2026-03-13T11:00:00Z',
    },
];

const DEFAULT_FREELANCER_SKILLS = [
    'React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js',
    'Python', 'GSAP', 'Three.js', 'Supabase', 'LangChain', 'OpenAI',
    'Docker', 'PostgreSQL', 'D3.js',
];

const DEFAULT_FILTERS: ExploreFilters = {
    searchQuery: '',
    selectedSkills: [],
    budgetRange: [0, 50],
    difficultyFilter: 'All',
    aiRecommended: false,
};

// ── All unique skills across projects ──────────────────────────────────────

export const ALL_SKILLS: string[] = Array.from(
    new Set(MOCK_PROJECTS.flatMap(p => p.skills))
).sort();

// ── Budget parser (extracts min value in $K from budget string) ────────────

export function parseBudgetMin(budget: string): number {
    const match = budget.match(/\$([\d,]+)/);
    if (!match) return 0;
    return parseInt(match[1].replace(',', ''), 10) / 1000;
}

export function parseBudgetMax(budget: string): number {
    const matches = [...budget.matchAll(/\$([\d,]+)/g)];
    if (matches.length < 2) return parseBudgetMin(budget);
    return parseInt(matches[1][1].replace(',', ''), 10) / 1000;
}

// ── Store ──────────────────────────────────────────────────────────────────

export const useExploreStore = create<ExploreState>((set) => ({
    // Legacy 3D
    hoveredJob: null,
    setHoveredJob: (job) => set({ hoveredJob: job }),
    selectedJob: null,
    setSelectedJob: (job) => set({ selectedJob: job }),
    cameraTarget: null,
    setCameraTarget: (target) => set({ cameraTarget: target }),

    // Netflix explore
    projects: MOCK_PROJECTS,
    freelancerSkills: DEFAULT_FREELANCER_SKILLS,
    filters: { ...DEFAULT_FILTERS },

    setSearchQuery: (q) => set((s) => ({ filters: { ...s.filters, searchQuery: q } })),
    toggleSkillFilter: (skill) => set((s) => {
        const current = s.filters.selectedSkills;
        const next = current.includes(skill)
            ? current.filter(sk => sk !== skill)
            : [...current, skill];
        return { filters: { ...s.filters, selectedSkills: next } };
    }),
    setBudgetRange: (range) => set((s) => ({ filters: { ...s.filters, budgetRange: range } })),
    setDifficultyFilter: (d) => set((s) => ({ filters: { ...s.filters, difficultyFilter: d } })),
    toggleAiRecommended: () => set((s) => ({
        filters: { ...s.filters, aiRecommended: !s.filters.aiRecommended }
    })),
    resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),
}));
