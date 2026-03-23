-- Migration 004: Row Level Security Policies

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapter_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Students see only their own data
CREATE POLICY "own_progress" ON chapter_progress FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "own_submissions" ON project_submissions FOR ALL
  USING (user_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY "own_subscription" ON subscriptions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "own_stats" ON user_stats FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "own_notifications" ON notifications FOR ALL
  USING (user_id = auth.uid());

-- Mentors see only assigned students' data
CREATE POLICY "mentor_assigned_submissions" ON project_submissions FOR SELECT
  USING (
    user_id IN (
      SELECT student_id FROM mentor_assignments
      WHERE mentor_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "mentor_own_reviews" ON mentor_reviews FOR ALL
  USING (mentor_id = auth.uid());

-- Published chapters are visible to all authenticated users
CREATE POLICY "published_chapters_public" ON chapters FOR SELECT
  USING (is_published = true AND deleted_at IS NULL);

-- Admin routes always use SUPABASE_SERVICE_ROLE_KEY which bypasses RLS
