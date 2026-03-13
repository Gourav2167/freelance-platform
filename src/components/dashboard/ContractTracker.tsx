"use client";

import { Activity, CheckCircle2, Clock, XCircle, Search, Filter } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface Contract {
    id: string;
    client: string;
    role: string;
    status: 'pending' | 'reviewing' | 'active' | 'declined';
    time: string;
    budget: string;
}

const mockContracts: Contract[] = [
    { id: 'CTX-892', client: 'Nebula Corp', role: 'Frontend Architect', status: 'reviewing', time: '2h ago', budget: '$$$' },
    { id: 'CTX-889', client: 'Quantum UX', role: 'WebGL Engineer', status: 'pending', time: '5h ago', budget: '$$' },
    { id: 'CTX-850', client: 'Cyberdyne', role: 'AI Integrator', status: 'active', time: '1d ago', budget: '$$$' },
    { id: 'CTX-841', client: 'Weyland Yutani', role: 'Fullstack Dev', status: 'declined', time: '3d ago', budget: '$' },
];

export default function ContractTracker() {
    const listRef = useRef<HTMLDivElement>(null);

    const getStatusIcon = (status: Contract['status']) => {
        switch (status) {
            case 'pending': return <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" />;
            case 'reviewing': return <Clock className="w-3.5 h-3.5 text-amber-400" />;
            case 'active': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
            case 'declined': return <XCircle className="w-3.5 h-3.5 text-neutral-600" />;
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
                    <h2 className="text-white text-xs tracking-[0.4em] uppercase font-black opacity-50">Project Directory</h2>
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

            <div ref={listRef} className="flex flex-col gap-4 relative z-10">
                {mockContracts.map((contract) => (
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

            <button className="w-full mt-10 py-5 border-t border-white/5 text-neutral-500 hover:text-emerald-400 text-[9px] font-black uppercase tracking-[0.4em] transition-all group">
                Access Archives <span className="inline-block transition-transform group-hover:translate-x-2">&rarr;</span>
            </button>
        </div>
    );
}
