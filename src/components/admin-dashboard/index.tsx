import { useState } from "react";
import { useSettings } from "../../hooks/useSettings";
import { FilterOptions } from "../../types/briefTypes";
import { useAdminBriefs } from "../../hooks/useAdminBriefs";
import { formatDeadlineTime } from "../../utils/formatDeadlineTime";
import { formatDistanceToNow } from "date-fns";
import { DashboardLayout, Header } from "../Layout";
import StatsSection from "./StatsSection";
import FilterSection from "./FilterSection";
import MemberSection from "./MembersSection/MemberSection";

const AdminDashboard: React.FC = () => {
    const { settings, isLoading: isLoadingSettings } = useSettings();

    const [viewMode, setViewMode] = useState<"card" | "list">("card");

    const [isDarkMode, setIsDarkMode] = useState(false);

    const [filters, setFilters] = useState<FilterOptions>({
        status: "all",
        review: "all",
        date: "today",
        customRange: "",
    });

    const {
        briefs,
        teamMembers,
        filteredTeamMembers,
        stats,
        isLoading: isLoadingBriefs,
    } = useAdminBriefs(filters);
    // Calculate dashboard metrics
    const totalBriefs = stats?.totalMembers;
    const submittedBriefs = stats?.submittedCount;
    const pendingBriefs = totalBriefs - submittedBriefs;
    const submissionRate = (submittedBriefs / totalBriefs) * 100;

    // The rest of the deadline calculations remain the same
    const deadline =
        formatDeadlineTime(settings?.submission_deadline) || new Date();
    const timeUntilDeadline = settings?.submission_deadline
        ? formatDistanceToNow(deadline, { addSuffix: true })
        : "No deadline set";




    const handleFiltersQuery = (filter: FilterOptions) => {

        setFilters(filter);
    }

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

                <StatsSection isDarkMode={isDarkMode} settings={settings!} briefs={briefs} teamMembers={teamMembers} totalBriefs={totalBriefs} submissionRate={submissionRate} submittedBriefs={submittedBriefs} pendingBriefs={pendingBriefs} deadline={deadline} timeUntilDeadline={timeUntilDeadline} />

                <FilterSection isDarkMode={isDarkMode} handleFiltersQuery={handleFiltersQuery} viewMode={viewMode} handleViewMode={handleViewMode} />

                <MemberSection isDarkMode={isDarkMode} viewMode={viewMode} teamMembers={teamMembers} filteredTeamMembers={filteredTeamMembers} briefs={briefs} settings={settings!} />


            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
