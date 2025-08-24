/*
  # Add timezone column to workspace_settings

  1. Changes
    - Add `timezone` column to `workspace_settings` table
    - Set default timezone to 'America/New_York' (Eastern Time)
    - Allow NULL values for backward compatibility

  2. Security
    - No RLS changes needed as existing policies cover the new column
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workspace_settings' AND column_name = 'timezone'
  ) THEN
    ALTER TABLE workspace_settings ADD COLUMN timezone text DEFAULT 'America/New_York';
  END IF;
END $$;