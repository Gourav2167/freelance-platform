"use client";

import { Activity, CheckCircle2, Clock, XCircle, Search, Filter, Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { createClient } from "@/utils/supabase/client";

interface Contract {
    id: string;
    client: string;
    role: string;
    status: 'pending' | 'reviewing' | 'active' | 'rejected';
    time: string;
    budget: string;
}

export default function ContractTracker() {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const listRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchBids = async () => {
            try {
                // Fetch bids and join with missions
                const { data, error } = await supabase
                    .from('bids')
                    .select(`
                        id,
                        proposal,
                        match_score,
                        created_at,
                        missions (
                            title,
                            id
                        )
                    `)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                const formatted: Contract[] = (data || []).map((bid: any) => ({
                    id: bid.id.substring(0, 8).toUpperCase(),
                    client: 'Vasudha Market', // Placeholder for org name
                    role: bid.missions?.title || 'Unknown Project',
                    status: bid.match_score > 0.8 ? 'reviewing' : 'pending',
                    time: new Date(bid.created_at).toLocaleDateString(),
                    budget: '₹₹₹'
                }));

                setContracts(formatted);
            } catch (err) {
                console.error("Error fetching bids:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBids();
    }, [supabase]);

    const getStatusIcon = (status: Contract['status']) => {
        switch (status) {
            case 'pending': return <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" />;
            case 'reviewing': return <Clock className="w-3.5 h-3.5 text-amber-400" />;
            case 'active': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
            case 'rejected': return <XCircle className="w-3.5 h-3.5 text-neutral-600" />;
        }
    };

    const getStatusText = (status: Contract['status']) => {
        return status.toUpperCase();
    };

    return (
        <div className="glass-panel w-full p-10 border border-white/5 rounded-2xl shadow-2xl backdrop-blur-3xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

            <div className="flex justify-between items-center mb-10 relative z-10">
                <div className="space-y-1">
                    <h2 className="text-white text-xs tracking-[0.4em] uppercase font-black opacity-50">Work History</h2>
                    <h3 className="text-white text-xl font-bold font-outfit uppercase tracking-tighter">Active Contracts</h3>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full transition-all text-neutral-400 hover:text-white">
                        <Search className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full transition-all text-neutral-400 hover:text-white">
                        <Filter className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-black">Loading Projects...</span>
                </div>
            ) : (
                <div ref={listRef} className="flex flex-col gap-4 relative z-10">
                    {contracts.length === 0 ? (
                        <div className="text-center py-10 text-neutral-500 uppercase tracking-widest text-[10px] font-black italic">
                            No active projects detected in this category.
                        </div>
                    ) : contracts.map((contract) => (
                        <div
                            key={contract.id}
                            className="grid grid-cols-12 gap-4 items-center p-5 bg-white/[0.01] border border-white/5 hover:border-white/10 hover:bg-white/[0.03] transition-all duration-500 rounded-xl cursor-pointer group"
                        >
                            {/* Status */}
                            <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center border-r border-white/5">
                                {getStatusIcon(contract.status)}
                                <span className={`text-[6px] font-black tracking-widest mt-2 ${contract.status === 'active' ? 'text-emerald-500' :
                                        contract.status === 'pending' ? 'text-blue-500' :
                                            contract.status === 'reviewing' ? 'text-amber-500' : 'text-neutral-600'
                                    }`}>
                                    {getStatusText(contract.status)}
                                </span>
                            </div>

                            {/* Details */}
                            <div className="col-span-10 md:col-span-5 flex flex-col justify-center">
                                <span className="text-white font-bold text-sm tracking-tight group-hover:text-emerald-400 transition-colors duration-500 font-outfit">{contract.role}</span>
                                <span className="text-neutral-500 text-[10px] uppercase tracking-widest font-black mt-1 opacity-60 group-hover:opacity-100 transition-opacity font-mono">{contract.client}</span>
                            </div>

                            {/* ID */}
                            <div className="hidden md:flex col-span-3 items-center justify-center">
                                <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-neutral-500 font-mono text-[9px] tracking-widest uppercase">
                                    {contract.id}
                                </span>
                            </div>

                            {/* Budget & Time */}
                            <div className="hidden md:flex flex-col col-span-3 items-end">
                                <span className="text-white font-black font-outfit text-sm group-hover:text-emerald-400 transition-colors uppercase tracking-tighter">{contract.budget}</span>
                                <span className="text-neutral-600 font-mono text-[9px] uppercase tracking-widest mt-1">{contract.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <button className="w-full mt-10 py-5 border-t border-white/5 text-neutral-500 hover:text-emerald-400 text-[9px] font-black uppercase tracking-[0.4em] transition-all group">
                Access Archives <span className="inline-block transition-transform group-hover:translate-x-2">&rarr;</span>
            </button>
        </div>
    );
}
