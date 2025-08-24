import { Brief, Invitation, User, WorkspaceSettings } from '../types';
import { BriefWithUser } from '../types/briefTypes';
import { format } from 'date-fns';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@briefly.com',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: '2',
    name: 'Jamie Smith',
    email: 'jamie@briefly.com',
    role: 'member',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: '3',
    name: 'Taylor Wilson',
    email: 'taylor@briefly.com',
    role: 'member',
    avatarUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: '4',
    name: 'Morgan Lee',
    email: 'morgan@briefly.com',
    role: 'member',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: '5',
    name: 'Casey Brown',
    email: 'casey@briefly.com',
    role: 'member',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
];

// Mock Briefs
export const mockBriefs: Brief[] = [
  {
    id: '1',
    userId: '2',
    userName: 'Jamie Smith',
    userAvatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    date: format(new Date(), 'yyyy-MM-dd'),
    accomplishments: 'Completed the user authentication flow and fixed 3 critical bugs in the dashboard.',
    blockers: 'Waiting for design team to provide updated mockups for the profile page.',
    priorities: 'Start implementing the notification system and continue working on the dashboard improvements.',
    submitted: true
  },
  {
    id: '2',
    userId: '3',
    userName: 'Taylor Wilson',
    userAvatarUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    date: format(new Date(), 'yyyy-MM-dd'),
    accomplishments: 'Finished the API documentation and conducted code reviews for 5 PRs.',
    blockers: 'The staging environment is down, making it difficult to test the latest changes.',
    priorities: 'Deploy the new API endpoints and help troubleshoot the staging environment issues.',
    submitted: true
  },
  {
    id: '3',
    userId: '4',
    userName: 'Morgan Lee',
    userAvatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    date: format(new Date(Date.now() - 86400000), 'yyyy-MM-dd'),
    accomplishments: 'Created wireframes for the new feature and collaborated with the backend team on API requirements.',
    blockers: 'None at the moment.',
    priorities: 'Start implementing the UI components based on the approved wireframes.',
    submitted: true
  },
  {
    id: '4',
    userId: '5',
    userName: 'Casey Brown',
    userAvatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    date: format(new Date(), 'yyyy-MM-dd'),
    accomplishments: '',
    blockers: '',
    priorities: '',
    submitted: false
  }
];

// Mock User Briefs (for team member view)
export const mockUserBriefs: Brief[] = [
  {
    id: '5',
    userId: '2',
    userName: 'Jamie Smith',
    userAvatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    date: format(new Date(Date.now() - 86400000), 'yyyy-MM-dd'),
    accomplishments: 'Implemented the new search functionality and fixed the pagination bug.',
    blockers: 'The API is returning inconsistent data for certain search queries.',
    priorities: 'Debug the API issues and continue working on the filter components.',
    submitted: true
  },
  {
    id: '6',
    userId: '2',
    userName: 'Jamie Smith',
    userAvatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    date: format(new Date(Date.now() - 172800000), 'yyyy-MM-dd'),
    accomplishments: 'Completed the responsive design for mobile devices and fixed cross-browser compatibility issues.',
    blockers: 'Waiting for the backend team to deploy the updated API.',
    priorities: 'Start working on the search functionality once the API is ready.',
    submitted: true
  }
];

// Mock Invitations
export const mockInvitations: Invitation[] = [
  {
    id: '1',
    email: 'jordan@example.com',
    status: 'pending',
    date: format(new Date(Date.now() - 86400000), 'yyyy-MM-dd')
  },
  {
    id: '2',
    email: 'riley@example.com',
    status: 'pending',
    date: format(new Date(Date.now() - 172800000), 'yyyy-MM-dd')
  },
  {
    id: '3',
    email: 'quinn@example.com',
    status: 'accepted',
    date: format(new Date(Date.now() - 259200000), 'yyyy-MM-dd')
  }
];

// Mock Workspace Settings
export const mockSettings: WorkspaceSettings = {
  questions: {
    accomplishments: 'What did you accomplish today?',
    blockers: 'Any blockers or challenges?',
    priorities: 'What are your priorities for tomorrow?',
    question4: '',
    question5: ''
  },
  submissionDeadline: '17:00',
  emailReminders: true,
  reminderTemplate: {
    subject: 'Reminder: Submit your daily brief',
    body: 'Hi {{name}},\n\nThis is a friendly reminder to submit your daily brief for today. It only takes a minute!\n\nBest regards,\nThe Briefly Team'
  }
};

// Mock briefs for demo purposes (when no real team members exist)
export const mockDemoBriefs: BriefWithUser[] = [
  {
    id: 'demo-1',
    user_id: 'demo-user-1',
    accomplishments: 'Completed the quarterly planning presentation and finalized the project roadmap. Successfully launched the new feature that increased user engagement by 15%. Conducted three client meetings and secured two new partnerships.',
    blockers: 'Waiting for legal approval on the new contract terms. The staging environment is experiencing some performance issues that need to be addressed.',
    priorities: 'Review and approve the marketing campaign materials. Start working on the Q2 budget planning. Schedule follow-up meetings with potential clients.',
    question4_response: null,
    question5_response: null,
    submitted_at: new Date().toISOString(),
    reviewed_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    reviewed_by: 'admin-demo',
    admin_notes: 'Great work on the presentation! The client feedback was excellent.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    users: {
      id: 'demo-user-1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      invited_by: 'current-admin'
    }
  },
  {
    id: 'demo-2',
    user_id: 'demo-user-2',
    accomplishments: 'Fixed three critical bugs in the payment system and improved the checkout flow. Completed code reviews for the mobile app updates. Optimized database queries resulting in 30% faster load times.',
    blockers: 'Need design approval for the new user interface mockups. The third-party API we depend on has been experiencing intermittent outages.',
    priorities: 'Deploy the bug fixes to production. Start implementing the new authentication system. Coordinate with the design team on the UI updates.',
    question4_response: null,
    question5_response: null,
    submitted_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    reviewed_at: null,
    reviewed_by: null,
    admin_notes: null,
    created_at: new Date(Date.now() - 1800000).toISOString(),
    updated_at: new Date(Date.now() - 1800000).toISOString(),
    users: {
      id: 'demo-user-2',
      name: 'Michael Chen',
      email: 'michael@example.com',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      invited_by: 'current-admin'
    }
  },
  {
    id: 'demo-3',
    user_id: 'demo-user-3',
    accomplishments: 'Launched the new marketing campaign across all social media platforms. Analyzed user feedback from the latest product release and compiled insights. Created content calendar for the next month.',
    blockers: 'The analytics dashboard is showing inconsistent data. Need approval from management for the increased advertising budget.',
    priorities: 'Prepare the monthly marketing report. Schedule interviews with potential influencer partners. Review and optimize the current ad campaigns.',
    question4_response: null,
    question5_response: null,
    submitted_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    reviewed_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    reviewed_by: 'admin-demo',
    admin_notes: 'Excellent campaign results! Let\'s discuss the budget increase in our next meeting.',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 1800000).toISOString(),
    users: {
      id: 'demo-user-3',
      name: 'Emily Rodriguez',
      email: 'emily@example.com',
      avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      invited_by: 'current-admin'
    }
  }
];

// Sample data management
export const getSampleDataKey = (adminId: string) => `sample_data_deleted_${adminId}`;

export const isSampleDataDeleted = (adminId: string): boolean => {
  return localStorage.getItem(getSampleDataKey(adminId)) === 'true';
};

export const markSampleDataAsDeleted = (adminId: string): void => {
  localStorage.setItem(getSampleDataKey(adminId), 'true');
};

// Mock team members for demo purposes
export const mockDemoTeamMembers = [
  {
    id: 'demo-user-1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'member'
  },
  {
    id: 'demo-user-2',
    name: 'Michael Chen',
    email: 'michael@example.com',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'member'
  },
  {
    id: 'demo-user-3',
    name: 'Emily Rodriguez',
    email: 'emily@example.com',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'member'
  }
];