export interface Brief {
  id: string;
  user_id: string;
  accomplishments: string;
  blockers: string;
  priorities: string;
  question4_response?: string;
  question5_response?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBriefDTO {
  accomplishments: string;
  blockers: string;
  priorities: string;
  question4_response?: string;
  question5_response?: string;
}

export interface BriefWithUser extends Brief {
  users: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
    invited_by: string;
  };
}

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

export interface BriefStats {
  totalMembers: number;
  submittedCount: number;
  pendingCount: number;
}