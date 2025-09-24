import { useState, useEffect } from "react";
import { DashboardLayout, Header } from "../Layout";
import StatsSection from "./StatsSection";
import FilterSection from "./FilterSection";
import MemberSection from "./MembersSection/MemberSection";

const AdminDashboard: React.FC = () => {
    const [viewMode, setViewMode] = useState<"card" | "list">("card");

    const handleViewMode = (option: "card" | "list") => {
        setViewMode(option)
    }


    return (
        <DashboardLayout>
            <div className="bg-gray-50 min-h-screen">

                <Header />
                <StatsSection />
                <FilterSection viewMode={viewMode} handleViewMode={handleViewMode} />
                <MemberSection viewMode={viewMode} />
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;