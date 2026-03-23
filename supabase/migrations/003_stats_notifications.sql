-- Migration 003: User Stats (streak + weekly goal) + Notifications + Skill Parameters

-- USER STATS — central table for streak + weekly goal tracking
-- One row per student. Updated on every step completion.
CREATE TABLE user_stats (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_active_date DATE,
  weekly_target INT DEFAULT 2,
  week_start_date DATE,
  weekly_chapters_done INT DEFAULT 0,
  total_chapters_completed INT DEFAULT 0,
  total_steps_completed INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- NOTIFICATIONS
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_notif_user ON notifications(user_id, is_read, created_at DESC);

-- SKILL PARAMETERS
CREATE TABLE skill_parameters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true
);

INSERT INTO skill_parameters (name, description) VALUES
  ('Concept Clarity', 'How clearly student understands the core idea'),
  ('Critical Thinking', 'Ability to analyze, question, and reason'),
  ('Application', 'Can apply concept to real situations'),
  ('Communication', 'Clarity of written expression');
