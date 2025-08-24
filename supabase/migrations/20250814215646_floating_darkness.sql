/*
  # Update workspace timezone default

  1. Changes
    - Set default timezone for workspace_settings to 'America/New_York'
    - Update existing workspaces without timezone to use default
  
  2. Notes
    - All times will be displayed in workspace timezone
    - UTC used internally for calculations
    - Daylight Saving Time handled automatically
*/

-- Update the default value for timezone column
ALTER TABLE workspace_settings 
ALTER COLUMN timezone SET DEFAULT 'America/New_York';

-- Update existing workspaces that don't have a timezone set
UPDATE workspace_settings 
SET timezone = 'America/New_York' 
WHERE timezone IS NULL;

-- Make timezone column NOT NULL since it's required
ALTER TABLE workspace_settings 
ALTER COLUMN timezone SET NOT NULL;