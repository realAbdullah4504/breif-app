import React, { createContext, useContext, useState, ReactNode } from "react";
import { useSettings } from "../hooks/useSettings";
import { useAdminBriefs } from "../hooks/useAdminBriefs";
import { createWorkspaceDeadline, getTimeUntilDeadline, DEFAULT_WORKSPACE_TIMEZONE } from "../utils/workspaceTimeUtils";
import { Brief, FilterOptions, TeamMember } from "../types/briefTypes";
import { WorkspaceSettings } from "../types/settingTypes";
import { useWorkspaceContext } from "./WorkspaceContext";

// Define context type
type DashboardContextType = {
    settings: WorkspaceSettings | null;
    briefs: Brief[];
    teamMembers: TeamMember[];
    filteredTeamMembers: TeamMember[];
    stats: {
        totalBriefs: number;
        submittedBriefs: number;
        pendingBriefs: number;
        submissionRate: number;
        deadline: Date;
        timeUntilDeadline: string;
    };
    filters: FilterOptions;
    handleFiltersQuery: (filters: FilterOptions) => void;
};

// Create the context with proper type
const DashboardContext = createContext<DashboardContextType | null>(null);

// Provider props type
type DashboardProviderProps = {
    children: ReactNode;
};

export const DashboardProvider = ({ children }: DashboardProviderProps) => {
    const [filters, setFilters] = useState<FilterOptions>({
        status: "all",
        review: "all",
        date: "today",
        customRange: "",
    });

    const { selectedWorkspaceId } = useWorkspaceContext();
    const workspaceId = selectedWorkspaceId || "";
    const { settings } = useSettings(workspaceId);
    const {
        briefs,
        teamMembers,
        filteredTeamMembers,
        stats,
    } = useAdminBriefs(filters);

    const totalBriefs = stats?.totalMembers || 0;
    const submittedBriefs = stats?.submittedCount || 0;
    const pendingBriefs = totalBriefs - submittedBriefs;
    const submissionRate = totalBriefs > 0 ? (submittedBriefs / totalBriefs) * 100 : 0;

    const workspaceTimezone = settings?.timezone || DEFAULT_WORKSPACE_TIMEZONE;
    const deadline = settings?.submission_deadline
        ? createWorkspaceDeadline(settings.submission_deadline, workspaceTimezone)
        : new Date();
        
    const timeUntilDeadline = settings?.submission_deadline && settings?.timezone
        ? getTimeUntilDeadline(settings.submission_deadline, workspaceTimezone)
        : "No deadline set";

    const handleFiltersQuery = (filter: FilterOptions) => {
        setFilters(filter);
    };

    return (
        <DashboardContext.Provider
            value={{
                settings,
                briefs,
                teamMembers,
                filteredTeamMembers,
                filters,
                stats: {
                    totalBriefs,
                    submittedBriefs,
                    pendingBriefs,
                    submissionRate,
                    deadline,
                    timeUntilDeadline,
                },
                handleFiltersQuery,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboardContext = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error("useDashboardContext must be used within a DashboardProvider");
    }
    return context;
};
