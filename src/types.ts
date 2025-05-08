export type UserRole = 'admin' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
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