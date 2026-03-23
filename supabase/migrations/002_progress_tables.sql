-- Migration 002: Progress + Review Tables
-- Subscriptions, Chapter Progress, Project Submissions, Mentor Assignments, Mentor Reviews

-- SUBSCRIPTIONS
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  plan_name TEXT DEFAULT 'standard',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','expired','cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_subs_user ON subscriptions(user_id, status, end_date);

-- CHAPTER PROGRESS
CREATE TABLE chapter_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  chapter_id UUID NOT NULL REFERENCES chapters(id),
  current_step INT DEFAULT 1 CHECK (current_step BETWEEN 1 AND 6),
  steps_completed INT[] DEFAULT '{}',
  status TEXT DEFAULT 'in_progress'
    CHECK (status IN ('in_progress','completed')),
  completed_at TIMESTAMPTZ,
  last_activity TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, chapter_id)
);
CREATE INDEX idx_progress_user ON chapter_progress(user_id, status);
CREATE INDEX idx_progress_user_chapter ON chapter_progress(user_id, chapter_id);
CREATE INDEX idx_progress_last_activity ON chapter_progress(user_id, last_activity DESC);

-- PROJECT SUBMISSIONS (text only — no file uploads in MVP)
CREATE TABLE project_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  chapter_id UUID NOT NULL REFERENCES chapters(id),
  text_answer TEXT NOT NULL CHECK (char_length(text_answer) >= 10),
  reflection TEXT,
  status TEXT DEFAULT 'pending_review'
    CHECK (status IN ('pending_review','reviewed','resubmit')),
  submitted_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_proj_subs_user ON project_submissions(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_proj_subs_status ON project_submissions(status) WHERE deleted_at IS NULL;

-- MENTOR ASSIGNMENTS
CREATE TABLE mentor_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES users(id),
  student_id UUID NOT NULL REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(mentor_id, student_id)
);
CREATE INDEX idx_ma_mentor ON mentor_assignments(mentor_id) WHERE is_active = true;
CREATE INDEX idx_ma_student ON mentor_assignments(student_id) WHERE is_active = true;

-- MENTOR REVIEWS
CREATE TABLE mentor_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES project_submissions(id),
  mentor_id UUID NOT NULL REFERENCES users(id),
  concept_clarity INT NOT NULL CHECK (concept_clarity BETWEEN 1 AND 5),
  critical_thinking INT NOT NULL CHECK (critical_thinking BETWEEN 1 AND 5),
  application INT NOT NULL CHECK (application BETWEEN 1 AND 5),
  communication INT NOT NULL CHECK (communication BETWEEN 1 AND 5),
  comment TEXT NOT NULL CHECK (char_length(comment) >= 20),
  is_resubmit_requested BOOLEAN DEFAULT false,
  reviewed_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_reviews_submission ON mentor_reviews(submission_id);
CREATE INDEX idx_reviews_mentor ON mentor_reviews(mentor_id);
