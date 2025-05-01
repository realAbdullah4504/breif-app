import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create the Supabase client with minimal configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Mock user data for testing
const mockUsers = {
  'admin@briefly.dev': {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Admin User',
    email: 'admin@briefly.dev',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  'member@briefly.dev': {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Team Member',
    email: 'member@briefly.dev',
    role: 'member',
    avatarUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
} as const;

export async function getCurrentUser() {
  const storedEmail = localStorage.getItem('userEmail');
  return storedEmail ? mockUsers[storedEmail as keyof typeof mockUsers] : null;
}