/*
  # Add briefs and workspace settings tables

  1. New Tables
    - `briefs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `accomplishments` (text)
      - `blockers` (text)
      - `priorities` (text)
      - `question4_response` (text)
      - `question5_response` (text)
      - `submitted_at` (timestamptz)
      - `reviewed_at` (timestamptz)
      - `reviewed_by` (uuid, references users.id)
      - `admin_notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `workspace_settings`
      - `id` (uuid, primary key)
      - `questions` (jsonb)
      - `submission_deadline` (time)
      - `email_reminders` (boolean)
      - `reminder_template` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for admins and team members
*/

-- Create briefs table
CREATE TABLE IF NOT EXISTS briefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  accomplishments text NOT NULL,
  blockers text,
  priorities text NOT NULL,
  question4_response text,
  question5_response text,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES users(id),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create workspace_settings table
CREATE TABLE IF NOT EXISTS workspace_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  questions jsonb NOT NULL DEFAULT '{
    "accomplishments": "What did you accomplish today?",
    "blockers": "Any blockers or challenges?",
    "priorities": "What are your priorities for tomorrow?"
  }'::jsonb,
  submission_deadline time NOT NULL DEFAULT '17:00',
  email_reminders boolean NOT NULL DEFAULT true,
  reminder_template jsonb NOT NULL DEFAULT '{
    "subject": "Reminder: Submit your daily brief",
    "body": "Hi {{name}},\n\nThis is a friendly reminder to submit your daily brief for today. It only takes a minute!\n\nBest regards,\nThe Briefly Team"
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_settings ENABLE ROW LEVEL SECURITY;

-- Briefs policies
CREATE POLICY "Users can view own briefs" ON briefs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own briefs" ON briefs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own briefs" ON briefs
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins have full access to briefs" ON briefs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Managers can view team briefs" ON briefs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() 
      AND role = 'manager'
      AND (
        user_id = ANY(managed_employees)
        OR user_id IN (
          SELECT id FROM users WHERE manager_id = auth.uid()
        )
      )
    )
  );

-- Workspace settings policies
CREATE POLICY "Admins have full access to workspace settings" ON workspace_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "All users can view workspace settings" ON workspace_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_briefs_user_id ON briefs(user_id);
CREATE INDEX IF NOT EXISTS idx_briefs_submitted_at ON briefs(submitted_at);
CREATE INDEX IF NOT EXISTS idx_briefs_reviewed_at ON briefs(reviewed_at);