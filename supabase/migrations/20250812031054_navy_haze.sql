/*
  # Recognition and Gamification System

  1. New Tables
    - `user_streaks`
      - `user_id` (uuid, foreign key to users)
      - `current_streak` (integer, default 0)
      - `longest_streak` (integer, default 0)
      - `last_submission_date` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `achievements`
      - `id` (uuid, primary key)
      - `name` (text, achievement name)
      - `description` (text, achievement description)
      - `icon` (text, icon name from lucide-react)
      - `criteria` (jsonb, conditions for earning)
      - `category` (text, achievement category)
      - `points` (integer, points awarded)
      - `created_at` (timestamp)
    
    - `user_achievements`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `achievement_id` (uuid, foreign key to achievements)
      - `awarded_at` (timestamp)

  2. Security
    - Enable RLS on all new tables
    - Add policies for users to view their own data
    - Add policies for admins to view all data

  3. Default Achievements
    - Insert predefined achievements for common milestones
*/

-- Create user_streaks table
CREATE TABLE IF NOT EXISTS user_streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_submission_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'award',
  criteria jsonb NOT NULL,
  category text NOT NULL DEFAULT 'general',
  points integer DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  awarded_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_streaks
CREATE POLICY "Users can view own streaks"
  ON user_streaks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all streaks"
  ON user_streaks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "System can manage streaks"
  ON user_streaks
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for achievements
CREATE POLICY "Everyone can view achievements"
  ON achievements
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage achievements"
  ON achievements
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- RLS Policies for user_achievements
CREATE POLICY "Users can view own achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "System can manage user achievements"
  ON user_achievements
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_streaks_user_id ON user_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_streaks_last_submission ON user_streaks(last_submission_date);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);

-- Create trigger for updating updated_at on user_streaks
CREATE OR REPLACE FUNCTION update_user_streaks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_streaks_updated_at
  BEFORE UPDATE ON user_streaks
  FOR EACH ROW
  EXECUTE FUNCTION update_user_streaks_updated_at();

-- Insert default achievements
INSERT INTO achievements (name, description, icon, criteria, category, points) VALUES
  ('First Brief', 'Submit your very first daily brief', 'zap', '{"type": "brief_count", "value": 1}', 'milestone', 10),
  ('Getting Started', 'Submit 5 daily briefs', 'target', '{"type": "brief_count", "value": 5}', 'milestone', 25),
  ('Consistent Contributor', 'Submit 25 daily briefs', 'trending-up', '{"type": "brief_count", "value": 25}', 'milestone', 50),
  ('Brief Master', 'Submit 100 daily briefs', 'crown', '{"type": "brief_count", "value": 100}', 'milestone', 100),
  ('On Fire', 'Maintain a 7-day submission streak', 'flame', '{"type": "streak", "value": 7}', 'streak', 30),
  ('Unstoppable', 'Maintain a 30-day submission streak', 'rocket', '{"type": "streak", "value": 30}', 'streak', 75),
  ('Legend', 'Maintain a 100-day submission streak', 'star', '{"type": "streak", "value": 100}', 'streak', 200),
  ('Early Bird', 'Submit 10 briefs before 9 AM', 'sunrise', '{"type": "early_submission", "value": 10, "before_hour": 9}', 'timing', 40),
  ('Problem Solver', 'Submit 20 briefs with no blockers', 'check-circle', '{"type": "no_blockers", "value": 20}', 'quality', 60),
  ('Team Player', 'Be part of the team for 30 days', 'users', '{"type": "tenure", "value": 30}', 'engagement', 35)
ON CONFLICT DO NOTHING;