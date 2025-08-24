/*
  # Add send_on_weekdays column to workspace_settings

  1. Changes
    - Add `send_on_weekdays` column to `workspace_settings` table
    - Set default value to weekdays (Monday to Friday)
    - Update existing rows to have the default value

  2. Security
    - No changes to RLS policies needed
*/

-- Add the send_on_weekdays column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workspace_settings' AND column_name = 'send_on_weekdays'
  ) THEN
    ALTER TABLE workspace_settings ADD COLUMN send_on_weekdays integer[] DEFAULT '{1,2,3,4,5}';
  END IF;
END $$;

-- Update existing rows to have the default value
UPDATE workspace_settings 
SET send_on_weekdays = '{1,2,3,4,5}' 
WHERE send_on_weekdays IS NULL;