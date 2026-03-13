"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/lib/userStore";
import { createClient } from "@/utils/supabase/client";
import FreelancerDashboard from "@/components/dashboard/FreelancerDashboard";
import OrgDashboard from "@/components/dashboard/OrgDashboard";
import SkeletonDashboard from "@/components/ui/SkeletonDashboard";

export default function DashboardPage() {
    const { role, syncProfile } = useUserStore();
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const initDashboard = async () => {
            try {
                // If role is missing, try to sync from Supabase
                if (!role) {
                    await syncProfile();
                }
            } catch (err) {
                console.error("DASHBOARD_INIT_SYNC_FAILED:", err);
            } finally {
                setIsLoading(false);
            }
        };
        initDashboard();
    }, [role, syncProfile, supabase]);

    if (isLoading) {
        return <SkeletonDashboard />;
    }

    if (role === 'organization') {
        return <OrgDashboard />;
    }

    // Default to freelancer view (Operative HQ)
    return <FreelancerDashboard />;
}
