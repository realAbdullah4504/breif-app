/*
  # Add send_on_weekdays column to workspace_settings

  1. Changes
    - Add `send_on_weekdays` column to `workspace_settings` table
    - Column stores array of integers representing days of the week (0=Sunday, 1=Monday, ..., 6=Saturday)
    - Default to Monday-Friday (1,2,3,4,5) for business days only
    - Add constraint to ensure valid day values (0-6)

  2. Notes
    - This allows admins to configure which days reminders should be sent
    - By default, reminders will only be sent on weekdays
    - Days are represented as integers: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
*/

-- Add send_on_weekdays column to workspace_settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workspace_settings' AND column_name = 'send_on_weekdays'
  ) THEN
    ALTER TABLE workspace_settings 
    ADD COLUMN send_on_weekdays integer[] DEFAULT ARRAY[1,2,3,4,5];
  END IF;
END $$;

-- Add constraint to ensure valid day values (0-6)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'valid_weekdays_check'
  ) THEN
    ALTER TABLE workspace_settings
    ADD CONSTRAINT valid_weekdays_check 
    CHECK (
      send_on_weekdays IS NULL OR 
      (
        array_length(send_on_weekdays, 1) > 0 AND
        NOT EXISTS (
          SELECT 1 FROM unnest(send_on_weekdays) AS day 
          WHERE day < 0 OR day > 6
        )
      )
    );
  END IF;
END $$;

-- Update existing records to have the default weekdays setting
UPDATE workspace_settings 
SET send_on_weekdays = ARRAY[1,2,3,4,5] 
WHERE send_on_weekdays IS NULL;