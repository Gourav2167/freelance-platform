"use client";

import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
    Search, SlidersHorizontal, X, Sparkles, ChevronRight, ChevronLeft,
    Brain, Code, Server, PenTool, LayoutTemplate, Smartphone, Cloud,
    Zap, Target, ArrowUpRight, MessageSquare, Filter,
} from "lucide-react";
import {
    useExploreStore, computeMatchScore, ALL_SKILLS,
    parseBudgetMin,
    type Project, type ProjectDifficulty, type ProjectCategory,
} from "@/lib/exploreStore";

// Avoid SSR window mismatch for Three.js
const NexusConstellations = dynamic(() => import("@/components/canvas/NexusConstellations"), {
    ssr: false,
});

// ── Category helpers ───────────────────────────────────────────────────────

const CATEGORY_META: Record<ProjectCategory, { icon: typeof Brain; color: string; label: string }> = {
    ai: { icon: Brain, color: "text-purple-400", label: "AI & ML" },
    frontend: { icon: LayoutTemplate, color: "text-blue-400", label: "Frontend" },
    backend: { icon: Server, color: "text-emerald-400", label: "Backend" },
    design: { icon: PenTool, color: "text-amber-400", label: "Design" },
    mobile: { icon: Smartphone, color: "text-pink-400", label: "Mobile" },
    devops: { icon: Cloud, color: "text-cyan-400", label: "DevOps" },
};

const DIFFICULTY_COLORS: Record<ProjectDifficulty, string> = {
    Easy: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    Medium: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    Hard: "text-red-400 border-red-500/30 bg-red-500/10",
};

// ── Match Score Ring ───────────────────────────────────────────────────────

function MatchRing({ score }: { score: number }) {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#6b7280";

    return (
        <div className="relative w-12 h-12 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <circle
                    cx="22" cy="22" r={radius} fill="none"
                    stroke={color} strokeWidth="3"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black font-mono text-white">
                {score}%
            </span>
        </div>
    );
}

// ── Project Card ───────────────────────────────────────────────────────────

function ProjectCard({ project, matchScore }: {
    project: Project;
    matchScore: number;
}) {
    const meta = CATEGORY_META[project.category];
    const Icon = meta.icon;
    const [hovered, setHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={cardRef}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="group relative flex-shrink-0 w-[320px] rounded-2xl border border-white/[0.06] overflow-hidden transition-all duration-500 cursor-pointer card-animate"
            style={{
                background: hovered
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(255,255,255,0.015)",
                boxShadow: hovered
                    ? `0 0 40px rgba(16,185,129,0.08), 0 20px 60px rgba(0,0,0,0.6)`
                    : "0 8px 32px rgba(0,0,0,0.5)",
                transform: hovered ? "scale(1.03) translateY(-4px)" : "scale(1)",
                borderColor: hovered ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)",
            }}
        >
            {/* Top glow line */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="p-5 flex flex-col gap-4">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <div className={`p-1.5 rounded-lg border border-white/5 bg-white/[0.03] flex-shrink-0`}>
                            <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
                        </div>
                        <span className={`text-[9px] uppercase tracking-[0.15em] font-black ${meta.color} opacity-80`}>
                            {meta.label}
                        </span>
                    </div>
                    <MatchRing score={matchScore} />
                </div>

                {/* Title */}
                <h3 className="text-white font-bold text-[15px] leading-snug tracking-tight font-outfit line-clamp-2 group-hover:text-emerald-50 transition-colors">
                    {project.title}
                </h3>

                {/* AI Summary */}
                <p className="text-neutral-500 text-xs leading-relaxed line-clamp-2 group-hover:text-neutral-400 transition-colors">
                    {project.aiSummary}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5">
                    {project.skills.slice(0, 4).map(skill => (
                        <span
                            key={skill}
                            className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border border-white/[0.06] bg-white/[0.02] text-neutral-400"
                        >
                            {skill}
                        </span>
                    ))}
                    {project.skills.length > 4 && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-neutral-600">
                            +{project.skills.length - 4}
                        </span>
                    )}
                </div>

                {/* Meta row */}
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                    <span className="text-emerald-400 text-xs font-bold font-mono">{project.budget}</span>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[project.difficulty]}`}>
                        {project.difficulty}
                    </span>
                </div>

                {/* Action buttons (expanded on hover) */}
                <div
                    className="flex items-center gap-2 overflow-hidden transition-all duration-500"
                    style={{
                        maxHeight: hovered ? "48px" : "0px",
                        opacity: hovered ? 1 : 0,
                        marginTop: hovered ? "0px" : "-8px",
                    }}
                >
                    <Link
                        href={`/projects/${project.id}`}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/[0.06] hover:bg-emerald-500/20 border border-white/[0.08] hover:border-emerald-500/30 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest text-neutral-300 hover:text-emerald-300"
                    >
                        View Project <ArrowUpRight className="w-3 h-3" />
                    </Link>
                    <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white/[0.06] hover:bg-purple-500/20 border border-white/[0.08] hover:border-purple-500/30 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest text-neutral-300 hover:text-purple-300">
                        <MessageSquare className="w-3 h-3" /> Ask AI
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Horizontal Row ─────────────────────────────────────────────────────────

function ProjectRow({ title, projects, freelancerSkills, icon: RowIcon, accentColor }: {
    title: string;
    projects: Project[];
    freelancerSkills: string[];
    icon: typeof Sparkles;
    accentColor: string;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const rowRef = useRef<HTMLDivElement>(null);

    const scroll = useCallback((dir: "left" | "right") => {
        if (!scrollRef.current) return;
        const amount = 340;
        scrollRef.current.scrollBy({
            left: dir === "left" ? -amount : amount,
            behavior: "smooth",
        });
    }, []);

    if (projects.length === 0) return null;

    return (
        <div ref={rowRef} className="row-animate">
            {/* Row header */}
            <div className="flex items-center justify-between mb-5 px-2">
                <div className="flex items-center gap-3">
                    <RowIcon className={`w-4 h-4 ${accentColor}`} />
                    <h2 className="text-white text-lg font-bold tracking-tight font-outfit">{title}</h2>
                    <span className="text-neutral-600 text-xs font-mono">{projects.length}</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => scroll("left")}
                        className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] transition-all text-neutral-500 hover:text-white"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] transition-all text-neutral-500 hover:text-white"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Scrollable row */}
            <div
                ref={scrollRef}
                className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory"
            >
                {projects.map((p) => (
                    <div key={p.id} className="snap-start">
                        <ProjectCard
                            project={p}
                            matchScore={computeMatchScore(p.skills, freelancerSkills)}
                        />
                    </div>
                ))}
                {/* End spacer */}
                <div className="flex-shrink-0 w-4" />
            </div>
        </div>
    );
}

// ── Filter Panel ───────────────────────────────────────────────────────────

function FilterPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
    const {
        filters, setSearchQuery, toggleSkillFilter,
        setBudgetRange, setDifficultyFilter, toggleAiRecommended, resetFilters,
    } = useExploreStore();

    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (panelRef.current) {
            gsap.to(panelRef.current, {
                x: open ? 0 : -420,
                duration: 0.6,
                ease: "expo.out",
            });
        }
    }, [open]);

    const difficulties: (ProjectDifficulty | "All")[] = ["All", "Easy", "Medium", "Hard"];

    return (
        <div
            ref={panelRef}
            className="fixed left-0 top-0 bottom-0 w-[380px] z-40 glass-panel border-r border-white/[0.06] p-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar pointer-events-auto shadow-[20px_0_60px_rgba(0,0,0,0.6)]"
            style={{ transform: "translateX(-420px)" }}
        >
            {/* Top glow */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <Filter className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-sm tracking-wider uppercase font-outfit">Filters</h2>
                        <span className="text-[8px] text-neutral-500 font-mono tracking-widest">AI-POWERED DISCOVERY</span>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-all text-neutral-500 hover:text-white">
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/30 transition-all"
                />
            </div>

            {/* AI Recommended Toggle */}
            <button
                onClick={toggleAiRecommended}
                className={`flex items-center justify-between w-full p-4 rounded-xl border transition-all ${filters.aiRecommended
                    ? "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                    : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                    }`}
            >
                <div className="flex items-center gap-3">
                    <Sparkles className={`w-4 h-4 ${filters.aiRecommended ? "text-emerald-400" : "text-neutral-500"}`} />
                    <div className="text-left">
                        <span className={`text-xs font-bold ${filters.aiRecommended ? "text-emerald-300" : "text-neutral-300"}`}>
                            AI Recommended
                        </span>
                        <p className="text-[10px] text-neutral-500 mt-0.5">Show high match-score projects</p>
                    </div>
                </div>
                <div className={`w-10 h-5 rounded-full transition-all relative ${filters.aiRecommended ? "bg-emerald-500" : "bg-white/10"}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${filters.aiRecommended ? "left-[22px]" : "left-0.5"}`} />
                </div>
            </button>

            {/* Difficulty */}
            <div>
                <span className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.2em] mb-3 block">Difficulty</span>
                <div className="flex gap-2">
                    {difficulties.map(d => (
                        <button
                            key={d}
                            onClick={() => setDifficultyFilter(d)}
                            className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${filters.difficultyFilter === d
                                ? "bg-white/10 border-white/20 text-white"
                                : "bg-white/[0.02] border-white/[0.06] text-neutral-500 hover:bg-white/[0.05]"
                                }`}
                        >
                            {d}
                        </button>
                    ))}
                </div>
            </div>

            {/* Budget Range */}
            <div>
                <span className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.2em] mb-3 block">
                    Budget Range
                </span>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-neutral-400 font-mono">${filters.budgetRange[0]}K</span>
                    <input
                        type="range"
                        min={0}
                        max={50}
                        step={1}
                        value={filters.budgetRange[1]}
                        onChange={e => setBudgetRange([filters.budgetRange[0], parseInt(e.target.value)])}
                        className="flex-1 accent-emerald-500 h-1"
                    />
                    <span className="text-xs text-neutral-400 font-mono">${filters.budgetRange[1]}K</span>
                </div>
            </div>

            {/* Skill Filters */}
            <div>
                <span className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.2em] mb-3 block">
                    Skills
                </span>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                    {ALL_SKILLS.map(skill => {
                        const active = filters.selectedSkills.includes(skill);
                        return (
                            <button
                                key={skill}
                                onClick={() => toggleSkillFilter(skill)}
                                className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${active
                                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                                    : "bg-white/[0.02] border-white/[0.06] text-neutral-500 hover:bg-white/[0.05] hover:text-neutral-300"
                                    }`}
                            >
                                {skill}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Reset */}
            <button
                onClick={resetFilters}
                className="mt-auto py-3 rounded-xl border border-white/[0.08] bg-white/[0.02] text-neutral-500 hover:text-white hover:bg-white/[0.06] transition-all text-[10px] font-black uppercase tracking-[0.2em]"
            >
                Reset All Filters
            </button>
        </div>
    );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function ExplorePage() {
    const { projects, freelancerSkills, filters } = useExploreStore();
    const [filterOpen, setFilterOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // ── Filter logic ───────────────────────────────────────────────────
    const filteredProjects = useMemo(() => {
        return projects.filter(p => {
            // Search
            if (filters.searchQuery) {
                const q = filters.searchQuery.toLowerCase();
                const inTitle = p.title.toLowerCase().includes(q);
                const inDesc = p.description.toLowerCase().includes(q);
                const inSkills = p.skills.some(s => s.toLowerCase().includes(q));
                if (!inTitle && !inDesc && !inSkills) return false;
            }

            // Skills
            if (filters.selectedSkills.length > 0) {
                const hasSkill = filters.selectedSkills.some(sk =>
                    p.skills.some(ps => ps.toLowerCase() === sk.toLowerCase())
                );
                if (!hasSkill) return false;
            }

            // Budget
            const budgetMin = parseBudgetMin(p.budget);
            if (budgetMin > filters.budgetRange[1] || budgetMin < filters.budgetRange[0]) return false;

            // Difficulty
            if (filters.difficultyFilter !== "All" && p.difficulty !== filters.difficultyFilter) return false;

            // AI recommended = match score >= 50
            if (filters.aiRecommended) {
                const score = computeMatchScore(p.skills, freelancerSkills);
                if (score < 50) return false;
            }

            return true;
        });
    }, [projects, filters, freelancerSkills]);

    // ── Row categories ─────────────────────────────────────────────────

    const recommended = useMemo(() =>
        [...filteredProjects]
            .sort((a, b) =>
                computeMatchScore(b.skills, freelancerSkills) - computeMatchScore(a.skills, freelancerSkills)
            )
            .slice(0, 10),
        [filteredProjects, freelancerSkills]
    );

    const aiProjects = useMemo(() =>
        filteredProjects.filter(p => p.category === "ai"),
        [filteredProjects]
    );

    const webProjects = useMemo(() =>
        filteredProjects.filter(p => p.category === "frontend" || p.category === "backend"),
        [filteredProjects]
    );

    const highBudget = useMemo(() =>
        filteredProjects.filter(p => parseBudgetMin(p.budget) >= 10),
        [filteredProjects]
    );

    const recent = useMemo(() =>
        [...filteredProjects]
            .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
            .slice(0, 10),
        [filteredProjects]
    );

    // ── GSAP entrance ──────────────────────────────────────────────────

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        tl.fromTo(".hero-header",
            { y: -40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, delay: 0.3 }
        );

        tl.fromTo(".row-animate",
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.15, duration: 1.4 },
            "-=0.6"
        );

        tl.fromTo(".card-animate",
            { scale: 0.95, opacity: 0 },
            { scale: 1, opacity: 1, stagger: 0.04, duration: 0.8 },
            "-=1.2"
        );
    }, { scope: containerRef, dependencies: [filteredProjects] });

    return (
        <div ref={containerRef} className="relative w-full min-h-screen">
            {/* ── Three.js Background ─────────────────────────────────── */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Canvas
                    camera={{ position: [0, 0, -30], fov: 60 }}
                    style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
                    dpr={[1, 2]}
                >
                    <Suspense fallback={null}>
                        <ambientLight intensity={0.1} color="#ffffff" />
                        <directionalLight position={[0, 40, 20]} intensity={1.5} color="#3b82f6" />
                        <pointLight position={[20, -10, -50]} intensity={2} color="#a855f7" distance={100} />
                        <NexusConstellations />
                        <fog attach="fog" args={["#030305", 20, 100]} />
                    </Suspense>
                </Canvas>
            </div>

            {/* ── Aurora blurs ────────────────────────────────────────── */}
            <div className="aurora-blur w-[600px] h-[600px] rounded-full bg-emerald-500 top-[-200px] right-[-200px]" />
            <div className="aurora-blur w-[400px] h-[400px] rounded-full bg-purple-600 bottom-[200px] left-[-100px]" />
            <div className="aurora-blur w-[500px] h-[500px] rounded-full bg-blue-600 top-[40%] right-[10%]" />

            {/* ── Filter Panel ────────────────────────────────────────── */}
            <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} />

            {/* Click-away overlay */}
            {filterOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
                    onClick={() => setFilterOpen(false)}
                />
            )}

            {/* ── Main Content ────────────────────────────────────────── */}
            <div className="relative z-10 pt-28 pb-20 px-8 lg:px-16">
                {/* Header */}
                <div className="hero-header flex flex-col md:flex-row items-start md:items-center justify-between mb-14 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Zap className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                            <span className="text-emerald-500 font-mono text-[10px] tracking-[0.4em] uppercase font-black opacity-80">
                                Project Discovery
                            </span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white font-outfit">
                            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/30">Projects</span>
                        </h1>
                        <p className="text-neutral-500 text-sm mt-2 max-w-md">
                            Discover opportunities matched to your skills. AI-powered recommendations surface the best fits.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search bar */}
                        <div className="relative glass-panel rounded-xl overflow-hidden">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                            <input
                                type="text"
                                value={filters.searchQuery}
                                onChange={e => useExploreStore.getState().setSearchQuery(e.target.value)}
                                placeholder="Quick search..."
                                className="bg-transparent py-3 pl-11 pr-6 text-sm text-white placeholder:text-neutral-600 focus:outline-none w-56 lg:w-72"
                            />
                        </div>

                        {/* Filter toggle */}
                        <button
                            onClick={() => setFilterOpen(true)}
                            className="glass-panel p-3 rounded-xl hover:bg-white/[0.05] transition-all group relative"
                        >
                            <SlidersHorizontal className="w-5 h-5 text-neutral-400 group-hover:text-emerald-400 transition-colors" />
                            {(filters.selectedSkills.length > 0 || filters.difficultyFilter !== "All" || filters.aiRecommended) && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Active filter chips */}
                {(filters.selectedSkills.length > 0 || filters.difficultyFilter !== "All" || filters.aiRecommended) && (
                    <div className="flex items-center gap-2 mb-8 flex-wrap">
                        <span className="text-[10px] text-neutral-600 font-black uppercase tracking-widest mr-2">Active:</span>
                        {filters.aiRecommended && (
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3" /> AI Recommended
                            </span>
                        )}
                        {filters.difficultyFilter !== "All" && (
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${DIFFICULTY_COLORS[filters.difficultyFilter]}`}>
                                {filters.difficultyFilter}
                            </span>
                        )}
                        {filters.selectedSkills.map(sk => (
                            <span key={sk} className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/[0.05] border border-white/[0.1] text-neutral-300 flex items-center gap-1.5">
                                {sk}
                                <button
                                    onClick={() => useExploreStore.getState().toggleSkillFilter(sk)}
                                    className="hover:text-red-400 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                {/* Stats bar */}
                <div className="flex items-center gap-8 mb-12 glass-panel px-6 py-3 rounded-xl w-fit">
                    <div className="flex items-center gap-2">
                        <Target className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">
                            {filteredProjects.length} Projects
                        </span>
                    </div>
                    <div className="w-[1px] h-4 bg-white/5" />
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">
                            {recommended.filter(p => computeMatchScore(p.skills, freelancerSkills) >= 70).length} High Match
                        </span>
                    </div>
                    <div className="w-[1px] h-4 bg-white/5" />
                    <div className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">
                            {highBudget.length} Premium
                        </span>
                    </div>
                </div>

                {/* ── Netflix Rows ────────────────────────────────────── */}
                <div className="space-y-14">
                    <ProjectRow
                        title="Recommended For You"
                        projects={recommended}
                        freelancerSkills={freelancerSkills}
                        icon={Sparkles}
                        accentColor="text-emerald-400"
                    />
                    <ProjectRow
                        title="AI & Machine Learning"
                        projects={aiProjects}
                        freelancerSkills={freelancerSkills}
                        icon={Brain}
                        accentColor="text-purple-400"
                    />
                    <ProjectRow
                        title="Web Development"
                        projects={webProjects}
                        freelancerSkills={freelancerSkills}
                        icon={Code}
                        accentColor="text-blue-400"
                    />
                    <ProjectRow
                        title="High Budget Opportunities"
                        projects={highBudget}
                        freelancerSkills={freelancerSkills}
                        icon={Zap}
                        accentColor="text-amber-400"
                    />
                    <ProjectRow
                        title="Recently Posted"
                        projects={recent}
                        freelancerSkills={freelancerSkills}
                        icon={Target}
                        accentColor="text-cyan-400"
                    />
                </div>

                {/* Empty state */}
                {filteredProjects.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] mb-6">
                            <Search className="w-8 h-8 text-neutral-600" />
                        </div>
                        <h3 className="text-white font-bold text-lg font-outfit mb-2">No Projects Found</h3>
                        <p className="text-neutral-500 text-sm max-w-xs">
                            Try adjusting your filters or search query to discover more projects.
                        </p>
                        <button
                            onClick={() => useExploreStore.getState().resetFilters()}
                            className="mt-6 px-6 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-neutral-300 text-xs font-bold hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-300 transition-all"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}

                {/* Footer spacer */}
                <div className="h-20" />
            </div>
        </div>
    );
}
