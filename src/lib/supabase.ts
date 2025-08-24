import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is properly configured
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'your-supabase-url' && 
  supabaseAnonKey !== 'your-supabase-anon-key';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  });
  console.warn('Supabase environment variables not found. Using mock authentication mode.');
}

// Validate URL format
try {
  if (supabaseUrl) new URL(supabaseUrl);
} catch (error) {
  console.error('Invalid Supabase URL format:', supabaseUrl);
  console.warn('Invalid Supabase URL format. Using mock authentication mode.');
}

// Create the Supabase client with minimal configuration (only if properly configured)
export const supabase = isSupabaseConfigured ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  }
}) : null;

// Mock mode when Supabase is not configured or not running
export const isMockMode = !isSupabaseConfigured;

export const mockSignUp = async (email: string, password: string, name: string, role: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Store user data in localStorage for mock authentication
  const userData = {
    id: `mock-${Math.random().toString(36).substr(2, 9)}`,
    email,
    name,
    role,
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  localStorage.setItem('mockUser', JSON.stringify(userData));
  localStorage.setItem('userEmail', email);
  localStorage.setItem('isAuthenticated', 'true');
  
  return { user: userData, error: null };
};

export const mockSignIn = async (email: string, password: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Check if user exists in mock users or localStorage
  const storedUser = localStorage.getItem('mockUser');
  if (storedUser) {
    const userData = JSON.parse(storedUser);
    if (userData.email === email) {
      localStorage.setItem('isAuthenticated', 'true');
      return { user: userData, error: null };
    }
  }
  
  // Check predefined mock users
  const mockUser = mockUsers[email as keyof typeof mockUsers];
  if (mockUser) {
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    localStorage.setItem('userEmail', email);
    localStorage.setItem('isAuthenticated', 'true');
    return { user: mockUser, error: null };
  }
  
  return { user: null, error: { message: 'Invalid email or password' } };
};

export const mockSignOut = async () => {
  localStorage.removeItem('mockUser');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('isAuthenticated');
  return { error: null };
};

// Mock user data for testing
const mockUsers = {
  'admin@briefly.dev': {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Admin User',
    email: 'admin@briefly.dev',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  'member@briefly.dev': {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Team Member',
    email: 'member@briefly.dev',
    role: 'member',
    avatar_url: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
} as const;

export async function getCurrentUser() {
  // Check for mock user first
  const mockUser = localStorage.getItem('mockUser');
  if (mockUser) {
    try {
      return JSON.parse(mockUser);
    } catch (error) {
      console.error('Error parsing mock user:', error);
    }
  }
  
  const storedEmail = localStorage.getItem('userEmail');
  return storedEmail ? mockUsers[storedEmail as keyof typeof mockUsers] : null;
}

export async function checkSupabaseConnection() {
  if (!supabase) return false;
  
  try {
    await supabase.from('users').select('count').limit(1);
    return true;
  } catch {
    return false;
  }
}