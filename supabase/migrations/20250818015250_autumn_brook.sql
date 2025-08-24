/*
  # Allow users to join multiple workspaces

  1. Schema Changes
    - Remove unique constraint on users.email to allow same email in different workspaces
    - Add workspace_id to users table to track which workspace they belong to
    - Update foreign key relationships

  2. Security Updates
    - Update RLS policies to work with workspace-based access
    - Ensure users can only access data from their workspace

  3. Data Migration
    - Safely handle existing data during constraint removal
*/

-- First, add workspace_id column to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'workspace_id'
  ) THEN
    ALTER TABLE users ADD COLUMN workspace_id uuid;
  END IF;
END $$;

-- Create index for workspace_id
CREATE INDEX IF NOT EXISTS idx_users_workspace_id ON users(workspace_id);

-- Update existing users to have workspace_id based on their invited_by admin
UPDATE users 
SET workspace_id = (
  SELECT ws.id 
  FROM workspace_settings ws 
  WHERE ws.admin_id = users.invited_by
)
WHERE workspace_id IS NULL AND invited_by IS NOT NULL;

-- For admin users, set their workspace_id to their own workspace
UPDATE users 
SET workspace_id = (
  SELECT ws.id 
  FROM workspace_settings ws 
  WHERE ws.admin_id = users.id
)
WHERE workspace_id IS NULL AND role = 'admin';

-- Drop the unique constraint on email (if it exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'users_email_key' AND table_name = 'users'
  ) THEN
    ALTER TABLE users DROP CONSTRAINT users_email_key;
  END IF;
END $$;

-- Create a new unique constraint on email + workspace_id combination
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'users_email_workspace_unique' AND table_name = 'users'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_email_workspace_unique UNIQUE (email, workspace_id);
  END IF;
END $$;

-- Add foreign key constraint for workspace_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'users_workspace_id_fkey' AND table_name = 'users'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_workspace_id_fkey 
    FOREIGN KEY (workspace_id) REFERENCES workspace_settings(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Update RLS policies to be workspace-aware
DROP POLICY IF EXISTS "users_self_access" ON users;
DROP POLICY IF EXISTS "admins_full_access" ON users;
DROP POLICY IF EXISTS "managers_direct_reports_access" ON users;

-- Users can access their own data within their workspace
CREATE POLICY "users_self_access_workspace" ON users
  FOR ALL
  TO authenticated
  USING (uid() = id AND workspace_id IS NOT NULL)
  WITH CHECK (uid() = id AND workspace_id IS NOT NULL);

-- Admins can access all users in their workspace
CREATE POLICY "admins_workspace_access" ON users
  FOR ALL
  TO authenticated
  USING (
    workspace_id IN (
      SELECT ws.id 
      FROM workspace_settings ws 
      WHERE ws.admin_id = uid()
    )
  )
  WITH CHECK (
    workspace_id IN (
      SELECT ws.id 
      FROM workspace_settings ws 
      WHERE ws.admin_id = uid()
    )
  );

-- Update briefs policies to be workspace-aware
DROP POLICY IF EXISTS "users_self_access" ON briefs;
DROP POLICY IF EXISTS "admins_full_access" ON briefs;
DROP POLICY IF EXISTS "managers_direct_reports_access" ON briefs;

-- Users can access their own briefs
CREATE POLICY "users_own_briefs_workspace" ON briefs
  FOR ALL
  TO authenticated
  USING (user_id = uid())
  WITH CHECK (user_id = uid());

-- Admins can access briefs from users in their workspace
CREATE POLICY "admins_workspace_briefs" ON briefs
  FOR ALL
  TO authenticated
  USING (
    user_id IN (
      SELECT u.id 
      FROM users u 
      JOIN workspace_settings ws ON u.workspace_id = ws.id 
      WHERE ws.admin_id = uid()
    )
  )
  WITH CHECK (
    user_id IN (
      SELECT u.id 
      FROM users u 
      JOIN workspace_settings ws ON u.workspace_id = ws.id 
      WHERE ws.admin_id = uid()
    )
  );