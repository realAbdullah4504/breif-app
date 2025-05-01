export type UserRole = 'admin' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Brief {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  date: string;
  accomplishments: string;
  blockers: string;
  priorities: string;
  question4_response?: string;
  question5_response?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  admin_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Invitation {
  id: string;
  email: string;
  status: 'pending' | 'accepted';
  date: string;
}

export interface WorkspaceSettings {
  id: string;
  questions: {
    accomplishments: string;
    blockers: string;
    priorities: string;
    question4?: string;
    question5?: string;
  };
  submission_deadline: string;
  email_reminders: boolean;
  reminder_template: {
    subject: string;
    body: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      briefs: {
        Row: Brief;
        Insert: Omit<Brief, 'id' | 'submitted_at' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Brief, 'id' | 'submitted_at' | 'created_at' | 'updated_at'>>;
      };
      workspace_settings: {
        Row: WorkspaceSettings;
        Insert: Omit<WorkspaceSettings, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<WorkspaceSettings, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}