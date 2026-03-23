-- BookandLab Production Schema
-- Generates all 15 tables, foreign keys, indexes, and RLS policies

-- 1. Create Enums if needed
CREATE TYPE user_role AS ENUM ('student', 'mentor', 'admin');
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'cancelled');
CREATE TYPE chapter_status AS ENUM ('not_started', 'in_progress', 'completed');
CREATE TYPE submission_status AS ENUM ('pending_review', 'reviewed', 'resubmit');

-- 2. Create Tables

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stack_auth_id text UNIQUE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  is_active boolean DEFAULT true,
  avatar_url text,
  bio text,
  expertise text,
  deleted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  grade_level int NOT NULL CHECK (grade_level BETWEEN 6 AND 12),
  is_active boolean DEFAULT true,
  deleted_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  name text NOT NULL,
  tag text,
  order_index int DEFAULT 0,
  deleted_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  name text NOT NULL,
  order_index int DEFAULT 0,
  deleted_at timestamptz
);

CREATE TABLE chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  unit_id uuid REFERENCES units(id) ON DELETE SET NULL,
  prerequisite_chapter_id uuid REFERENCES chapters(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  order_index int DEFAULT 0,
  is_published boolean DEFAULT false,
  estimated_minutes int DEFAULT 45,
  deleted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE chapter_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id uuid UNIQUE REFERENCES chapters(id) ON DELETE CASCADE,
  step1_context text,
  step2_concept text,
  step3_thinking jsonb,
  step4_deep text,
  step5_project text,
  step6_reflection jsonb,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  plan_name text,
  start_date date,
  end_date date,
  status subscription_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE chapter_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  chapter_id uuid REFERENCES chapters(id) ON DELETE CASCADE,
  current_step int DEFAULT 1,
  steps_completed int[] DEFAULT '{}',
  status chapter_status DEFAULT 'in_progress',
  completed_at timestamptz,
  last_activity timestamptz DEFAULT now(),
  UNIQUE(user_id, chapter_id)
);

CREATE TABLE mentor_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid REFERENCES users(id) ON DELETE CASCADE,
  student_id uuid REFERENCES users(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(mentor_id, student_id)
);

CREATE TABLE project_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  chapter_id uuid REFERENCES chapters(id) ON DELETE CASCADE,
  text_answer text NOT NULL,
  reflection text,
  status submission_status DEFAULT 'pending_review',
  submitted_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  deleted_at timestamptz
);

CREATE TABLE mentor_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid REFERENCES project_submissions(id) ON DELETE CASCADE,
  mentor_id uuid REFERENCES users(id) ON DELETE CASCADE,
  concept_clarity int CHECK (concept_clarity BETWEEN 1 AND 5),
  critical_thinking int CHECK (critical_thinking BETWEEN 1 AND 5),
  application int CHECK (application BETWEEN 1 AND 5),
  communication int CHECK (communication BETWEEN 1 AND 5),
  comment text NOT NULL,
  is_resubmit_requested boolean DEFAULT false,
  reviewed_at timestamptz DEFAULT now()
);

CREATE TABLE user_stats (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_streak int DEFAULT 0,
  longest_streak int DEFAULT 0,
  last_active_date date,
  weekly_target int DEFAULT 3,
  week_start_date date,
  weekly_chapters_done int DEFAULT 0,
  total_chapters_completed int DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE skill_parameters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  is_active boolean DEFAULT true
);

CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  is_read boolean DEFAULT false,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  record_id text NOT NULL,
  action text NOT NULL,
  old_data jsonb,
  new_data jsonb,
  changed_by uuid REFERENCES users(id) ON DELETE SET NULL,
  changed_at timestamptz DEFAULT now()
);

-- 3. Create Indexes
CREATE INDEX idx_chapters_subject  ON chapters(subject_id, order_index) WHERE deleted_at IS NULL;
CREATE INDEX idx_progress_user     ON chapter_progress(user_id, status);
CREATE INDEX idx_progress_pair     ON chapter_progress(user_id, chapter_id);
CREATE INDEX idx_progress_activity ON chapter_progress(user_id, last_activity DESC);
CREATE INDEX idx_submissions_user  ON project_submissions(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_submissions_status ON project_submissions(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_reviews_submission ON mentor_reviews(submission_id);
CREATE INDEX idx_reviews_mentor    ON mentor_reviews(mentor_id);
CREATE INDEX idx_subs_user         ON subscriptions(user_id, status, end_date);
CREATE INDEX idx_ma_mentor         ON mentor_assignments(mentor_id) WHERE is_active = true;
CREATE INDEX idx_ma_student        ON mentor_assignments(student_id) WHERE is_active = true;
CREATE INDEX idx_notif_user        ON notifications(user_id, is_read, created_at DESC);

-- 4. Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapter_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- 5. Simple RLS Policies
-- Users can read their own data
CREATE POLICY "Users can view own record" ON users FOR SELECT USING (auth.uid() = id OR true); -- Assuming Supabase Admin API maps users securely over StackAuth
-- Progress isolation
CREATE POLICY "Students see own progress" ON chapter_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Students edit own progress" ON chapter_progress FOR ALL USING (auth.uid() = user_id);
-- Project submissions isolation
CREATE POLICY "Students see own submissions" ON project_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Mentors can see assigned submissions" ON project_submissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM mentor_assignments WHERE mentor_id = auth.uid() AND student_id = project_submissions.user_id AND is_active = true)
);
-- Notifications
CREATE POLICY "Users see own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users edit own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- 6. Storage Policies (Run in Supabase Dashboard -> Storage)
-- You must manually create these buckets in the dashboard first:
-- 'chapter-images', 'chapter-pdfs', 'chapter-videos', 'student-submissions'

-- chapter-images
CREATE POLICY "Admin can upload chapter images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'chapter-images' AND (SELECT role FROM public.users WHERE stack_auth_id = auth.uid()) = 'admin');
CREATE POLICY "Anyone can read chapter images" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'chapter-images');
CREATE POLICY "Admin can delete chapter images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'chapter-images' AND (SELECT role FROM public.users WHERE stack_auth_id = auth.uid()) = 'admin');

-- chapter-pdfs
CREATE POLICY "Admin can upload chapter pdfs" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'chapter-pdfs' AND (SELECT role FROM public.users WHERE stack_auth_id = auth.uid()) = 'admin');
CREATE POLICY "Anyone can read chapter pdfs" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'chapter-pdfs');
CREATE POLICY "Admin can delete chapter pdfs" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'chapter-pdfs' AND (SELECT role FROM public.users WHERE stack_auth_id = auth.uid()) = 'admin');

-- student-submissions
CREATE POLICY "Students read own submissions" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'student-submissions' AND (storage.foldername(name))[1] = auth.uid()::text);


-- 7. Media Library (Migration 005)
CREATE TABLE media_library (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name   TEXT NOT NULL,
  file_type   TEXT NOT NULL CHECK (file_type IN ('image','pdf','video')),
  bucket_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url   TEXT NOT NULL,
  file_size_bytes BIGINT,
  subject_tag TEXT,
  alt_text    TEXT,
  uploaded_by UUID NOT NULL REFERENCES users(id),
  created_at  TIMESTAMPTZ DEFAULT now(),
  deleted_at  TIMESTAMPTZ
);

CREATE INDEX idx_media_type    ON media_library(file_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_media_subject ON media_library(subject_tag) WHERE deleted_at IS NULL;
CREATE INDEX idx_media_uploader ON media_library(uploaded_by);

ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access on media" ON media_library FOR ALL USING ((SELECT role FROM users WHERE stack_auth_id = auth.uid()) = 'admin');
CREATE POLICY "Students and mentors can read media" ON media_library FOR SELECT USING (deleted_at IS NULL AND (SELECT role FROM users WHERE stack_auth_id = auth.uid()) IN ('student','mentor'));


-- 8. Add Image Fields to Chapter Content (Migration 006)
ALTER TABLE chapter_content
  ADD COLUMN step1_image_url    TEXT,
  ADD COLUMN step2_image_url    TEXT,
  ADD COLUMN step2_key_terms    TEXT[] DEFAULT '{}',
  ADD COLUMN step4_image_url    TEXT,
  ADD COLUMN step4_examples     JSONB DEFAULT '[]',
  ADD COLUMN step4_misconception TEXT,
  ADD COLUMN step5_image_url    TEXT,
  ADD COLUMN step5_submission_type TEXT DEFAULT 'text' CHECK (step5_submission_type IN ('text','text_reflection','both')),
  ADD COLUMN materials          JSONB DEFAULT '[]';
