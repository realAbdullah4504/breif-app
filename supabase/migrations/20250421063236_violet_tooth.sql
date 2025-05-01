/*
  # Initial schema setup

  1. Tables
    - users
      - id (uuid, primary key)
      - name (text)
      - email (text, unique)
      - role (text, enum: admin/manager/member)
      - avatar_url (text, nullable)
      - manager_id (uuid, foreign key)
      - managed_employees (uuid[])
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for:
      - Admins (full access)
      - Managers (view/update team members)
      - Users (manage own data)
*/

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins have full access" ON users;
  DROP POLICY IF EXISTS "Managers can view team members" ON users;
  DROP POLICY IF EXISTS "Managers can update team members" ON users;
  DROP POLICY IF EXISTS "Users can manage own data" ON users;
EXCEPTION
  WHEN undefined_table THEN NULL;
END $$;

-- Create users table if it doesn't exist
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

-- Create policies
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