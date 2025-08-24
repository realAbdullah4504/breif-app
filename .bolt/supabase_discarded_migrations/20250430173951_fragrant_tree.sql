/*
  # Remove manager role

  1. Changes
    - Update role CHECK constraint to only allow 'admin' or 'member'
    - Convert existing manager users to admin role
    - Remove manager_id and managed_employees columns
    - Update RLS policies to remove manager-specific rules
*/

-- Convert managers to admins
UPDATE users
SET role = 'admin'
WHERE role = 'manager';

-- Remove manager-related columns
ALTER TABLE users
DROP COLUMN IF EXISTS manager_id,
DROP COLUMN IF EXISTS managed_employees;

-- Update role constraint
ALTER TABLE users
DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users
ADD CONSTRAINT users_role_check 
CHECK (role IN ('admin', 'member'));

-- Drop manager-specific policies
DROP POLICY IF EXISTS "Managers can view team members" ON users;
DROP POLICY IF EXISTS "Managers can update team members" ON users;