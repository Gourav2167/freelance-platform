import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-8 lg:p-24 text-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="max-w-2xl space-y-8 glass-panel p-12 relative overflow-hidden">
        {/* Decorator */}
        <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500/50" />
        
        <div className="space-y-4 relative z-10">
          <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/20 font-outfit uppercase tracking-tighter">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-widest font-outfit">
            Sector Not Found
          </h2>
          <p className="text-neutral-400 font-inter text-lg max-w-md mx-auto">
            The operative directory or contract sector you are attempting to access does not exist in the Vasudha Nexus.
          </p>
        </div>

        <div className="pt-8 relative z-10 flex justify-center">
          <Link 
            href="/"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-xs uppercase tracking-[0.2em] transition-all rounded-sm font-outfit"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Return to Command
          </Link>
        </div>
      </div>
    </div>
  );
}
