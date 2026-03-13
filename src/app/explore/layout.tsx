import React from "react";

export default function ExploreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // Netflix-style layout: scrollable vertically, clipped horizontally
        <section className="bg-obsidian-900 w-screen min-h-screen overflow-y-auto overflow-x-hidden text-neutral-200">
            {children}
        </section>
    );
}
