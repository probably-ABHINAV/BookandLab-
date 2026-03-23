-- Migration 005: Production-Grade Schema Updates & Missing Tables

-- 1. Create missing tables specified in the guide (submissions, skill_growth)
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id),
  chapter_id UUID NOT NULL REFERENCES chapters(id),
  mentor_id UUID REFERENCES users(id),
  answer_text TEXT NOT NULL,
  file_url TEXT,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewed')),
  reviewer_comment TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS skill_growth (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  submission_id UUID NOT NULL REFERENCES submissions(id),
  skill_type TEXT NOT NULL CHECK (skill_type IN ('concept', 'critical_thinking', 'application', 'communication')),
  score INT NOT NULL CHECK (score BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Alter existing tables to add columns explicitly requested by the manual mappings
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE chapter_progress ADD COLUMN IF NOT EXISTS step_6_unlocked BOOLEAN DEFAULT false;

-- user_stats explicitly needs 'streak_count' and 'chapters_this_week' as per Part 4 prompt 5.3
ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS streak_count INT DEFAULT 0;
ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS chapters_this_week INT DEFAULT 0;

-- 3. Composite indexes (add these immediately — essential for performance)
-- We use IF NOT EXISTS to prevent migration errors
CREATE UNIQUE INDEX IF NOT EXISTS idx_progress_user_chapter_unique ON chapter_progress(user_id, chapter_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_status_new ON chapter_progress(user_id, status);
CREATE INDEX IF NOT EXISTS idx_subs_mentor_status ON submissions(mentor_id, status);
CREATE INDEX IF NOT EXISTS idx_sg_user_skill_time ON skill_growth(user_id, skill_type, created_at DESC);

-- Drop old unique constraints if they conflict, then create the ones demanded 
-- (Ignoring DROPs to be safe unless they fail later, assuming user_stats(user_id) unique index is valid)
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_stats_unique ON user_stats(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_mentor_assignments_unique_student ON mentor_assignments(student_id);

-- 4. Row Level Security policies
-- Enable RLS on the new/modified tables if not already enabled
ALTER TABLE chapter_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "student own data" ON chapter_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "mentor own reviews" ON submissions
  FOR SELECT USING (
    mentor_id = auth.uid() OR student_id = auth.uid()
  );
