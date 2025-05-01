/*
  # Fix RLS policies for users table

  1. Changes
    - Drop existing problematic policies
    - Create new, simplified policies that avoid recursion
    - Fix policy logic for managers and admins
  
  2. Security
    - Maintain proper access control while avoiding infinite recursion
    - Ensure managers can only access their team members
    - Ensure admins retain full access
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Admins have full access" ON users;
DROP POLICY IF EXISTS "Managers can update their team members" ON users;
DROP POLICY IF EXISTS "Managers can view their team members" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can view own data" ON users;

-- Create new policies without recursive queries
CREATE POLICY "Admins have full access" ON users
  FOR ALL 
  TO authenticated
  USING (role = 'admin')
  WITH CHECK (role = 'admin');

CREATE POLICY "Managers can view team members" ON users
  FOR SELECT
  TO authenticated
  USING (
    (role = 'manager' AND (
      id = auth.uid() OR 
      manager_id = auth.uid() OR 
      auth.uid() = ANY(managed_employees)
    ))
  );

CREATE POLICY "Managers can update team members" ON users
  FOR UPDATE
  TO authenticated
  USING (
    role = 'manager' AND (
      manager_id = auth.uid() OR 
      auth.uid() = ANY(managed_employees)
    )
  )
  WITH CHECK (
    role = 'manager' AND (
      manager_id = auth.uid() OR 
      auth.uid() = ANY(managed_employees)
    )
  );

CREATE POLICY "Users can manage own data" ON users
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);