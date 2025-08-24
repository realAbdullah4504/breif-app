/*
  # Seed Default Achievements

  1. Achievements
    - Create default achievement categories and criteria
    - Milestone achievements (brief counts)
    - Streak achievements (consecutive days)
    - Timing achievements (early submissions)
    - Quality achievements (no blockers)
    - Engagement achievements (tenure)

  2. Security
    - Public read access for achievements
    - Admin can manage achievements
*/

-- Insert default achievements
INSERT INTO achievements (name, description, icon, criteria, category, points) VALUES
-- Milestone Achievements
('First Steps', 'Submit your first brief', 'Award', '{"type": "brief_count", "value": 1}', 'milestone', 10),
('Getting Started', 'Submit 5 briefs', 'Target', '{"type": "brief_count", "value": 5}', 'milestone', 25),
('Consistent Contributor', 'Submit 10 briefs', 'Trophy', '{"type": "brief_count", "value": 10}', 'milestone', 50),
('Dedicated Team Member', 'Submit 25 briefs', 'Medal', '{"type": "brief_count", "value": 25}', 'milestone', 100),
('Brief Master', 'Submit 50 briefs', 'Crown', '{"type": "brief_count", "value": 50}', 'milestone', 200),
('Century Club', 'Submit 100 briefs', 'Star', '{"type": "brief_count", "value": 100}', 'milestone', 500),

-- Streak Achievements
('On Fire', 'Maintain a 3-day streak', 'Flame', '{"type": "streak", "value": 3}', 'streak', 30),
('Week Warrior', 'Maintain a 7-day streak', 'Zap', '{"type": "streak", "value": 7}', 'streak', 75),
('Unstoppable', 'Maintain a 14-day streak', 'Rocket', '{"type": "streak", "value": 14}', 'streak', 150),
('Streak Legend', 'Maintain a 30-day streak', 'Lightning', '{"type": "streak", "value": 30}', 'streak', 300),

-- Timing Achievements
('Early Bird', 'Submit 5 briefs before 9 AM', 'Sunrise', '{"type": "early_submission", "value": 5}', 'timing', 40),
('Morning Person', 'Submit 15 briefs before 9 AM', 'Coffee', '{"type": "early_submission", "value": 15}', 'timing', 100),
('Dawn Warrior', 'Submit 30 briefs before 9 AM', 'Sun', '{"type": "early_submission", "value": 30}', 'timing', 200),

-- Quality Achievements
('Smooth Sailing', 'Submit 5 briefs with no blockers', 'CheckCircle', '{"type": "no_blockers", "value": 5}', 'quality', 35),
('Problem Solver', 'Submit 15 briefs with no blockers', 'Shield', '{"type": "no_blockers", "value": 15}', 'quality', 85),
('Efficiency Expert', 'Submit 30 briefs with no blockers', 'Gem', '{"type": "no_blockers", "value": 30}', 'quality', 175),

-- Engagement Achievements
('Team Player', 'Be part of the team for 7 days', 'Users', '{"type": "tenure", "value": 7}', 'engagement', 20),
('Committed Member', 'Be part of the team for 30 days', 'Heart', '{"type": "tenure", "value": 30}', 'engagement', 60),
('Veteran', 'Be part of the team for 90 days', 'Anchor', '{"type": "tenure", "value": 90}', 'engagement', 150),
('Legend', 'Be part of the team for 365 days', 'Mountain', '{"type": "tenure", "value": 365}', 'engagement', 500)

ON CONFLICT (name) DO NOTHING;