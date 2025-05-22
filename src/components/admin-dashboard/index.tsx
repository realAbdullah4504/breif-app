import { useState } from "react";
import { DashboardLayout, Header } from "../Layout";
import StatsSection from "./StatsSection";
import FilterSection from "./FilterSection";
import MemberSection from "./MembersSection/MemberSection";

const AdminDashboard: React.FC = () => {


    const [viewMode, setViewMode] = useState<"card" | "list">("card");

    const [isDarkMode, setIsDarkMode] = useState(false);

    const handleViewMode = (option: "card" | "list") => {
        setViewMode(option)
    }
    return (
        <DashboardLayout>
            <div
                className={`transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
                    }`}
            >
                <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
                <StatsSection isDarkMode={isDarkMode} />
                <FilterSection isDarkMode={isDarkMode} viewMode={viewMode} handleViewMode={handleViewMode} />
                <MemberSection isDarkMode={isDarkMode} viewMode={viewMode} />

            </div>
        </DashboardLayout >
    );
};

export default AdminDashboard;
