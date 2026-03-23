import { z } from "zod";
import { NextResponse } from "next/server";

// ── STUDENT ───────────────────────────────
export const stepCompleteSchema = z.object({
  stepNumber: z.number().min(1).max(6),
});

export const projectSubmitSchema = z.object({
  chapter_id: z.string().uuid(),
  text_answer: z.string().min(10, "Min 10 chars").max(10000),
  file_url: z.string().url().optional(),
});

export const weeklyTargetSchema = z.object({
  weekly_target: z.number().int().min(1).max(14),
});

// ── MENTOR ────────────────────────────────
export const mentorReviewSchema = z.object({
  scores: z.object({
    concept: z.number().min(1).max(5),
    critical_thinking: z.number().min(1).max(5),
    application: z.number().min(1).max(5),
    communication: z.number().min(1).max(5),
  }),
  comment: z.string().min(20).max(1000)
});

// ── ADMIN ─────────────────────────────────
export const createChapterSchema = z.object({
  title: z.string().min(3),
  subject_id: z.string().uuid(),
  description: z.string().optional()
});

export const updateChapterSchema = z.object({
  title: z.string().min(3),
  description: z.string(),
  status: z.enum(["draft", "published"]),
  deleted_at: z.string().nullable()
}).partial();

export const assignMentorSchema = z.object({
  mentor_id: z.string().uuid(),
  student_id: z.string().uuid(),
});

export const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(["student", "mentor", "admin"]),
  plan_name: z.enum(["starter", "standard", "premium"]).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export const extendSubscriptionSchema = z.object({
  days: z.number().min(1).max(365),
});

// ── GENERIC HELPER ────────────────────────
export async function validateBody<T>(req: Request, schema: z.ZodSchema<T>) {
  try {
    const body = await req.json().catch(() => ({}));
    const data = schema.parse(body);
    return { data: data as T, error: null };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { data: null as unknown as T, error: NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 422 }) };
    }
    return { data: null as unknown as T, error: NextResponse.json({ error: "Invalid JSON or missing fields" }, { status: 400 }) };
  }
}
