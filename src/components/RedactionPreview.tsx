"use client";

import { Shield, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { globalState } from "@/lib/store";

export default function RedactionPreview() {
    const [redacted, setRedacted] = useState(true);

    const toggle = () => {
        const next = !redacted;
        setRedacted(next);
        globalState.isRedacted = next;
    };

    return (
        <button
            onClick={toggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border transition-all pointer-events-auto shadow-lg hover:scale-105 active:scale-95 ${redacted
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
                }`}
        >
            {redacted ? <ShieldAlert className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
            <span className="text-sm font-medium tracking-wide">
                {redacted ? "Client Data: Redacted" : "Client Data: Visible"}
            </span>
        </button>
    );
}
