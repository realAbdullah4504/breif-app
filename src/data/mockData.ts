import { Brief, Invitation, User, WorkspaceSettings } from '../types';
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