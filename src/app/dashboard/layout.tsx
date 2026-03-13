import React from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // Dashboard needs scrolling for lists, unlike Explore which locks to screen
        <div className="min-h-screen bg-obsidian-900 text-neutral-200 selection:bg-emerald-500/30">
            {children}
        </div>
    );
}
