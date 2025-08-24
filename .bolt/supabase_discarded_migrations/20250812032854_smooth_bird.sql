/*
  # Seed Default Achievements

  1. New Data
    - Insert default achievements for milestone, streak, timing, quality, and engagement categories
    - Each achievement has specific criteria for unlocking
  
  2. Achievement Categories
    - milestone: Based on total brief submissions
    - streak: Based on consecutive submission streaks
    - timing: Based on early submissions
    - quality: Based on brief quality (no blockers)
    - engagement: Based on tenure and participation
*/

-- Insert default achievements
INSERT INTO achievements (name, description, icon, criteria, category, points) VALUES
-- Milestone achievements
('First Steps', 'Submit your first daily brief', 'Award', '{"type": "brief_count", "value": 1}', 'milestone', 10),
('Getting Started', 'Submit 5 daily briefs', 'Target', '{"type": "brief_count", "value": 5}', 'milestone', 25),
('Consistent Contributor', 'Submit 25 daily briefs', 'Star', '{"type": "brief_count", "value": 25}', 'milestone', 50),
('Dedicated Team Member', 'Submit 50 daily briefs', 'Trophy', '{"type": "brief_count", "value": 50}', 'milestone', 100),
('Brief Master', 'Submit 100 daily briefs', 'Crown', '{"type": "brief_count", "value": 100}', 'milestone', 200),

-- Streak achievements
('On Fire', 'Maintain a 3-day submission streak', 'Flame', '{"type": "streak", "value": 3}', 'streak', 20),
('Hot Streak', 'Maintain a 7-day submission streak', 'Zap', '{"type": "streak", "value": 7}', 'streak', 50),
('Unstoppable', 'Maintain a 14-day submission streak', 'Rocket', '{"type": "streak", "value": 14}', 'streak', 100),
('Legendary', 'Maintain a 30-day submission streak', 'Medal', '{"type": "streak", "value": 30}', 'streak', 250),

-- Timing achievements
('Early Bird', 'Submit 5 briefs before 9 AM', 'Sunrise', '{"type": "early_submission", "value": 5}', 'timing', 30),
('Morning Person', 'Submit 15 briefs before 9 AM', 'Coffee', '{"type": "early_submission", "value": 15}', 'timing', 75),
('Dawn Warrior', 'Submit 30 briefs before 9 AM', 'Sun', '{"type": "early_submission", "value": 30}', 'timing', 150),

-- Quality achievements
('Smooth Sailing', 'Submit 10 briefs with no blockers', 'CheckCircle', '{"type": "no_blockers", "value": 10}', 'quality', 40),
('Problem Solver', 'Submit 25 briefs with no blockers', 'Shield', '{"type": "no_blockers", "value": 25}', 'quality', 80),
('Efficiency Expert', 'Submit 50 briefs with no blockers', 'Gem', '{"type": "no_blockers", "value": 50}', 'quality', 160),

-- Engagement achievements
('Team Player', 'Be part of the team for 30 days', 'Users', '{"type": "tenure", "value": 30}', 'engagement', 50),
('Veteran', 'Be part of the team for 90 days', 'Calendar', '{"type": "tenure", "value": 90}', 'engagement', 100),
('Company Legend', 'Be part of the team for 365 days', 'Building', '{"type": "tenure", "value": 365}', 'engagement', 500)

ON CONFLICT (name) DO NOTHING;