import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BriefService } from "../services/briefService";
import { useAuth } from "../context/AuthContext";
import { Brief } from "../types";

export interface FilterOptions {
  status: "all" | "submitted" | "pending";
  review: "all" | "reviewed" | "pending";
  date: "today" | "yesterday" | "week" | "custom";
  customRange: {
    start: string;
    end: string;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: string;
}

interface BriefStats {
  totalMembers: number;
  submittedCount: number;
  pendingCount: number;
}

interface UseAdminBriefsReturn {
  briefs: Brief[];
  teamMembers: TeamMember[];
  filteredTeamMembers: TeamMember[];
  isLoading: boolean;
  error: Error | null;
  stats: BriefStats;
  isLoadingStats: boolean;
  reviewBrief: (params: { briefId: string; adminNotes: string }) => void;
  isReviewing: boolean;
}

const briefService = new BriefService();

export const useAdminBriefs = (filters: FilterOptions): UseAdminBriefsReturn => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const briefsQuery = useQuery({
    queryKey: ["admin-briefs", filters],
    queryFn: async () => {
      if (currentUser) {
        return await briefService.getAllBriefs(currentUser.id, filters);
      }
      return { data: [], teamMembers: [], filteredTeamMembers: [], error: null };
    },
  });

  const statsQuery = useQuery({
    queryKey: ["brief-stats",filters],
    queryFn: async () => {
      if (currentUser) {
        return await briefService.getBriefStats(currentUser?.id,filters);
      }
      return { 
        data: { 
          totalMembers: 0, 
          submittedCount: 0, 
          pendingCount: 0 
        }, 
        error: null 
      };
    },
  });

  const reviewBriefMutation = useMutation({
    mutationFn: ({
      briefId,
      adminNotes,
    }: {
      briefId: string;
      adminNotes: string;
    }) => briefService.reviewBrief(currentUser?.id, briefId, adminNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-briefs"] });
      queryClient.invalidateQueries({ queryKey: ["brief-stats"] });
    },
  });

  return {
    briefs: briefsQuery.data?.data || [],
    teamMembers: briefsQuery.data?.teamMembers || [],
    filteredTeamMembers: briefsQuery.data?.filteredTeamMembers || [],
    isLoading: briefsQuery.isLoading,
    error: briefsQuery.error as Error | null,
    stats: statsQuery.data?.data || {
      totalMembers: 0,
      submittedCount: 0,
      pendingCount: 0,
    },
    isLoadingStats: statsQuery.isLoading,
    reviewBrief: reviewBriefMutation.mutate,
    isReviewing: reviewBriefMutation.isPending,
  };
};