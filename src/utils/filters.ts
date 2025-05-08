import { TeamMember,Brief } from "../types/briefTypes";

export const getFilteredMembers = (teamMembers:TeamMember[],briefs:Brief[],filterStatus:string,filterReview:string) => {
    return teamMembers.filter(member => {
      const memberBrief = briefs.find(brief => brief.user_id === member.id);
      
      // Search filter
    //   const matchesSearch = member?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase());
  
      // Submission status filter
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "submitted" && memberBrief) ||
        (filterStatus === "pending" && !memberBrief);
  
      // Review status filter
      const matchesReview =
        filterReview === "all" ||
        (filterReview === "reviewed" && memberBrief?.reviewed_by) ||
        (filterReview === "pending" && !memberBrief?.reviewed_by);
      return matchesStatus && matchesReview;
    });
  };