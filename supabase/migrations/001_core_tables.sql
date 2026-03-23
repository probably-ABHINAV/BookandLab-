-- Migration 001: Core Tables
-- Users, Classes, Subjects, Units, Chapters, Chapter Content

-- USERS (mirrors Stack Auth, stores role)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stack_auth_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student','mentor','admin')),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_stack_auth ON users(stack_auth_id);

-- CLASSES
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  grade_level INT NOT NULL CHECK (grade_level BETWEEN 6 AND 12),
  is_active BOOLEAN DEFAULT true,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- SUBJECTS
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id),
  name TEXT NOT NULL,
  tag TEXT,
  order_index INT DEFAULT 0,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_subjects_class ON subjects(class_id) WHERE deleted_at IS NULL;

-- UNITS
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES subjects(id),
  name TEXT NOT NULL,
  order_index INT DEFAULT 0,
  deleted_at TIMESTAMPTZ
);

-- CHAPTERS
CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES subjects(id),
  unit_id UUID REFERENCES units(id),
  prerequisite_chapter_id UUID REFERENCES chapters(id),
  title TEXT NOT NULL,
  description TEXT,
  order_index INT DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  estimated_minutes INT DEFAULT 45,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_chapters_subject ON chapters(subject_id, order_index)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_chapters_published ON chapters(is_published)
  WHERE deleted_at IS NULL;

-- CHAPTER CONTENT
CREATE TABLE chapter_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID UNIQUE NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  step1_context TEXT,
  step2_concept TEXT,
  step3_thinking JSONB DEFAULT '[]',
  step4_deep TEXT,
  step5_project TEXT,
  step6_reflection JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT now()
);
