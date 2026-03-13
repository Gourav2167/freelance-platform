import React from "react";

export default function ExploreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // We lock the explore page to full height and hide standard scrollbars
        // The entire experience is driven by the 3D Canvas
        <section className="bg-obsidian w-screen h-screen overflow-hidden text-neutral-200">
            {children}
        </section>
    );
}
