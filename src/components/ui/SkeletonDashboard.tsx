"use client";

import React from "react";

export function SkeletonStat() {
  return (
    <div className="glass-panel p-8 border border-white/5 rounded-2xl animate-pulse">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-3">
          <div className="h-2 w-24 bg-white/10 rounded" />
          <div className="h-8 w-16 bg-white/20 rounded" />
        </div>
        <div className="w-10 h-10 bg-white/10 rounded-lg" />
      </div>
      <div className="h-2 w-12 bg-white/5 rounded" />
    </div>
  );
}

export function SkeletonTracker() {
  return (
    <div className="glass-panel p-10 border border-white/5 rounded-2xl animate-pulse space-y-8">
      <div className="flex justify-between items-center h-4">
        <div className="h-2 w-32 bg-white/10 rounded" />
        <div className="h-2 w-16 bg-white/10 rounded" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center space-x-6 p-6 bg-white/[0.02] border border-white/5 rounded-xl">
          <div className="w-12 h-12 bg-white/10 rounded-lg" />
          <div className="flex-1 space-y-3">
            <div className="h-2 w-48 bg-white/10 rounded" />
            <div className="h-2 w-24 bg-white/5 rounded" />
          </div>
          <div className="w-20 h-6 bg-white/10 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default function SkeletonDashboard() {
  return (
    <div className="container mx-auto px-6 py-24 relative z-10 min-h-screen">
      <div className="space-y-4 mb-16 animate-pulse">
        <div className="h-12 w-96 bg-white/20 rounded" />
        <div className="h-2 w-64 bg-white/10 rounded" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <SkeletonStat />
        <SkeletonStat />
        <SkeletonStat />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <SkeletonTracker />
        </div>
        <div className="glass-panel p-10 border border-white/5 rounded-2xl animate-pulse space-y-12">
            <div className="h-2 w-24 bg-white/10 rounded" />
            <div className="space-y-6">
                <div className="h-24 w-full bg-white/5 rounded-xl" />
                <div className="h-24 w-full bg-white/5 rounded-xl" />
            </div>
            <div className="h-12 w-full bg-white/20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
