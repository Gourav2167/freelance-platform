"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/lib/userStore";
import FreelancerDashboard from "@/components/dashboard/FreelancerDashboard";
import OrgDashboard from "@/components/dashboard/OrgDashboard";
import SkeletonDashboard from "@/components/ui/SkeletonDashboard";

export default function DashboardPage() {
    const { role } = useUserStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <SkeletonDashboard />;
    }

    if (role === 'organization') {
        return <OrgDashboard />;
    }

    // Default to freelancer view (Operative HQ)
    return <FreelancerDashboard />;
}
