"use client";

import { useEffect } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Nexus Error:", error);
  }, [error]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-8 lg:p-24 text-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="max-w-2xl space-y-8 glass-panel p-12 relative overflow-hidden border-rose-500/20">
        <div className="absolute top-0 left-0 w-2 h-full bg-rose-500/50" />
        
        <div className="flex justify-center text-rose-500 mb-6 relative z-10">
          <AlertOctagon className="w-16 h-16 animate-pulse" />
        </div>

        <div className="space-y-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-widest font-outfit">
            System Failure
          </h2>
          <p className="text-neutral-400 font-inter text-lg max-w-md mx-auto">
            A critical anomaly disrupted the current operation. The error has been logged to the central command center.
          </p>
          <div className="bg-black/50 p-4 rounded text-left border border-white/5 overflow-x-auto text-xs font-mono text-rose-200/70">
            {error.message || "Unknown anomaly detected."}
          </div>
        </div>

        <div className="pt-8 relative z-10 flex justify-center">
          <button 
            onClick={() => reset()}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all rounded-sm font-outfit"
          >
            <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-180" /> Execute Diagnostic Reset
          </button>
        </div>
      </div>
    </div>
  );
}
