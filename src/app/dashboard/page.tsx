"use client";

import { useUserStore } from "@/lib/userStore";
import FreelancerDashboard from "@/components/dashboard/FreelancerDashboard";
import OrgDashboard from "@/components/dashboard/OrgDashboard";

export default function DashboardPage() {
    const { role } = useUserStore();

    if (role === 'organization') {
        return <OrgDashboard />;
    }

    // Default to freelancer view (Operative HQ)
    return <FreelancerDashboard />;
}
