/*
  # Add test users for different roles

  1. Changes
    - Add test users for admin, manager, and member roles
    - Set up manager relationships
*/

-- Create test users with different roles
INSERT INTO auth.users (id, email)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@briefly.dev'),
  ('00000000-0000-0000-0000-000000000002', 'manager@briefly.dev'),
  ('00000000-0000-0000-0000-000000000003', 'member@briefly.dev')
ON CONFLICT (id) DO NOTHING;

-- Add user profiles
INSERT INTO public.users (id, name, email, role, avatar_url)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'Admin User',
    'admin@briefly.dev',
    'admin',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Manager User',
    'manager@briefly.dev',
    'manager',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'Team Member',
    'member@briefly.dev',
    'member',
    'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  )
ON CONFLICT (id) DO UPDATE
SET 
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  avatar_url = EXCLUDED.avatar_url;

-- Set up manager relationship
UPDATE public.users
SET manager_id = '00000000-0000-0000-0000-000000000002'
WHERE id = '00000000-0000-0000-0000-000000000003';

UPDATE public.users
SET managed_employees = ARRAY[('00000000-0000-0000-0000-000000000003')::uuid]
WHERE id = '00000000-0000-0000-0000-000000000002';