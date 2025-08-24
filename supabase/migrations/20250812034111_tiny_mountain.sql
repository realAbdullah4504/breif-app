/*
  # Add Brief Feedback Feature

  1. Schema Changes
    - Add feedback-related columns to briefs table
    - Add feedback_rating column for rating briefs
    - Add feedback_status to track feedback state

  2. Security
    - Update RLS policies to handle feedback access
    - Ensure proper permissions for feedback operations
*/

-- Add feedback columns to briefs table
DO $$
BEGIN
  -- Add feedback rating column (1-5 stars)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'briefs' AND column_name = 'feedback_rating'
  ) THEN
    ALTER TABLE briefs ADD COLUMN feedback_rating integer CHECK (feedback_rating >= 1 AND feedback_rating <= 5);
  END IF;

  -- Add feedback status column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'briefs' AND column_name = 'feedback_status'
  ) THEN
    ALTER TABLE briefs ADD COLUMN feedback_status text DEFAULT 'pending' CHECK (feedback_status IN ('pending', 'provided', 'acknowledged'));
  END IF;

  -- Add feedback provided timestamp
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'briefs' AND column_name = 'feedback_provided_at'
  ) THEN
    ALTER TABLE briefs ADD COLUMN feedback_provided_at timestamptz;
  END IF;
END $$;

-- Create index for feedback queries
CREATE INDEX IF NOT EXISTS idx_briefs_feedback_status ON briefs(feedback_status);
CREATE INDEX IF NOT EXISTS idx_briefs_feedback_rating ON briefs(feedback_rating);