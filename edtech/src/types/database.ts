// =============================================
// EdTech Platform — Database Types
// =============================================

export type UserRole = "student" | "mentor" | "admin";
export type SubscriptionStatus = "active" | "expired" | "cancelled";
export type ChapterProgressStatus = "in_progress" | "completed";
export type SubmissionStatus = "pending_review" | "reviewed" | "resubmit";
export type NotificationType = "review_complete" | "chapter_unlocked" | "announcement";

export interface User {
  id: string;
  stack_auth_id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url: string | null;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Class {
  id: string;
  name: string;
  grade_level: number;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  class_id: string;
  name: string;
  tag: string | null;
  order_index: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Unit {
  id: string;
  subject_id: string;
  name: string;
  order_index: number;
  deleted_at: string | null;
}

export interface Chapter {
  id: string;
  subject_id: string;
  unit_id: string | null;
  prerequisite_chapter_id: string | null;
  title: string;
  description: string | null;
  order_index: number;
  is_published: boolean;
  estimated_minutes: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChapterContent {
  id: string;
  chapter_id: string;
  step1_context: string | null;
  step2_concept: string | null;
  step3_thinking: ThinkingPrompt[];
  step4_deep: string | null;
  step5_project: string | null;
  step6_reflection: ReflectionPrompt[];
  updated_at: string;
}

export interface ThinkingPrompt {
  id: string;
  text: string;
  type: "open" | "guided";
}

export interface ReflectionPrompt {
  id: string;
  text: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_name: string;
  start_date: string;
  end_date: string;
  status: SubscriptionStatus;
  created_at: string;
  updated_at: string;
}

export interface ChapterProgress {
  id: string;
  user_id: string;
  chapter_id: string;
  current_step: number;
  steps_completed: number[];
  status: ChapterProgressStatus;
  completed_at: string | null;
  last_activity: string;
}

export interface ProjectSubmission {
  id: string;
  user_id: string;
  chapter_id: string;
  text_answer: string;
  reflection: string | null;
  status: SubmissionStatus;
  submitted_at: string;
  reviewed_at: string | null;
  deleted_at: string | null;
}

export interface MentorAssignment {
  id: string;
  mentor_id: string;
  student_id: string;
  is_active: boolean;
  assigned_at: string;
}

export interface MentorReview {
  id: string;
  submission_id: string;
  mentor_id: string;
  concept_clarity: number;
  critical_thinking: number;
  application: number;
  communication: number;
  comment: string;
  is_resubmit_requested: boolean;
  reviewed_at: string;
}

export interface UserStats {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  weekly_target: number;
  week_start_date: string | null;
  weekly_chapters_done: number;
  total_chapters_completed: number;
  total_steps_completed: number;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  is_read: boolean;
  created_at: string;
}

export interface SkillParameter {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
}

// API response types
export interface DashboardResponse {
  subscription_end: string;
  continue_learning: {
    chapter_id: string;
    current_step: number;
    last_activity: string;
    chapters: { title: string; subjects: { name: string } };
  } | null;
  progress_summary: { total: number; completed: number; percentage: number };
  subject_cards: { id: string; name: string; total: number; completed: number; percentage: number }[];
  skill_snapshot: SkillAverages | null;
  pending_tasks: { id: string; chapter_id: string; status: string; chapters: { title: string } }[];
  notifications: Notification[];
  weekly_goal: { target: number; done: number; percentage: number };
  streak: { current: number; longest: number; last_active: string | null };
  total_completed: number;
}

export interface SkillAverages {
  concept_clarity: { avg: number; trend: "up" | "down" | "stable" };
  critical_thinking: { avg: number; trend: "up" | "down" | "stable" };
  application: { avg: number; trend: "up" | "down" | "stable" };
  communication: { avg: number; trend: "up" | "down" | "stable" };
}
