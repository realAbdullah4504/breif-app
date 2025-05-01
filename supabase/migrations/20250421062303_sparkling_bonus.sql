/*
  # Add users table with manager role support

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `role` (text)
      - `avatar_url` (text)
      - `manager_id` (uuid, references auth.users)
      - `managed_employees` (uuid array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for managers to access their team members' data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'manager', 'member')),
  avatar_url text,
  manager_id uuid REFERENCES auth.users(id),
  managed_employees uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Add RLS policy for managers to view their team members
CREATE POLICY "Managers can view their team members" ON users
FOR SELECT
TO authenticated
USING (
  auth.uid() = manager_id OR 
  auth.uid() = ANY(managed_employees) OR
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'manager'
  )
);

-- Add RLS policy for managers to update their team members
CREATE POLICY "Managers can update their team members" ON users
FOR UPDATE
TO authenticated
USING (
  auth.uid() = manager_id OR
  auth.uid() = ANY(managed_employees)
)
WITH CHECK (
  auth.uid() = manager_id OR
  auth.uid() = ANY(managed_employees)
);

-- Add RLS policy for users to view and update their own data
CREATE POLICY "Users can view own data" ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Add RLS policy for admins to manage all users
CREATE POLICY "Admins have full access" ON users
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  )
);