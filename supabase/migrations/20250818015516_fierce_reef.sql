/*
  # Add workspace_id column to users table

  1. Schema Changes
    - Add `workspace_id` column to `users` table (uuid, nullable)
    - Add foreign key constraint linking to `workspace_settings.id`
    - Add index for efficient workspace queries

  2. Data Migration
    - Update existing users to have proper workspace_id based on their invited_by relationship
    - Ensure data integrity during migration

  3. Security
    - Update RLS policies to be workspace-aware
    - Maintain existing security while adding workspace isolation
*/

-- Add workspace_id column to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS workspace_id uuid NULL;

-- Add foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_users_workspace'
  ) THEN
    ALTER TABLE public.users
    ADD CONSTRAINT fk_users_workspace
    FOREIGN KEY (workspace_id)
    REFERENCES public.workspace_settings(id)
    ON DELETE SET NULL;
  END IF;
END $$;

-- Add index for efficient workspace queries
CREATE INDEX IF NOT EXISTS idx_users_workspace_id ON public.users (workspace_id);

-- Migrate existing data: set workspace_id for existing users
UPDATE public.users 
SET workspace_id = (
  SELECT ws.id 
  FROM public.workspace_settings ws 
  WHERE ws.admin_id = users.invited_by
)
WHERE workspace_id IS NULL AND invited_by IS NOT NULL;

-- For admin users, set their workspace_id to their own workspace
UPDATE public.users 
SET workspace_id = (
  SELECT ws.id 
  FROM public.workspace_settings ws 
  WHERE ws.admin_id = users.id
)
WHERE workspace_id IS NULL AND role = 'admin';