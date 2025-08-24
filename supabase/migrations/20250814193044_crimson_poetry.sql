/*
  # Add user timezone column

  1. New Column
    - `timezone` (text, nullable) - User's preferred timezone
  
  2. Changes
    - Add timezone column to users table with default null (uses browser timezone)
    - Add index for performance
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'timezone'
  ) THEN
    ALTER TABLE users ADD COLUMN timezone text;
    CREATE INDEX IF NOT EXISTS idx_users_timezone ON users(timezone);
  END IF;
END $$;