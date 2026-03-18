import { z } from "zod";

export const stepCompleteSchema = z.object({
  chapter_id: z.string().uuid(),
  step: z.number().int().min(1).max(6),
  response: z.string().max(5000).optional(),
});

export const projectSubmitSchema = z.object({
  chapter_id: z.string().uuid(),
  text_answer: z
    .string()
    .min(10, "Answer must be at least 10 characters")
    .max(10000),
  reflection: z.string().min(10).max(5000).optional(),
});

export const mentorReviewSchema = z.object({
  submission_id: z.string().uuid(),
  concept_clarity: z.number().int().min(1).max(5),
  critical_thinking: z.number().int().min(1).max(5),
  application: z.number().int().min(1).max(5),
  communication: z.number().int().min(1).max(5),
  comment: z
    .string()
    .min(20, "Comment must be at least 20 characters")
    .max(2000),
  is_resubmit_requested: z.boolean().default(false),
});

export const createChapterSchema = z.object({
  subject_id: z.string().uuid(),
  unit_id: z.string().uuid().optional(),
  prerequisite_chapter_id: z.string().uuid().nullable().optional(),
  title: z.string().min(3).max(200),
  description: z.string().max(500).optional(),
  order_index: z.number().int().min(0),
  estimated_minutes: z.number().int().min(10).max(300).default(45),
});

export const updateWeeklyTargetSchema = z.object({
  weekly_target: z.number().int().min(1).max(14),
});

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  role: z.enum(["student", "mentor", "admin"]),
  stack_auth_id: z.string().min(1),
});

export const assignMentorSchema = z.object({
  mentor_id: z.string().uuid(),
  student_id: z.string().uuid(),
});

export const updateSubscriptionSchema = z.object({
  end_date: z.string(),
  status: z.enum(["active", "expired", "cancelled"]).optional(),
});

// Generic body validator
export async function validateBody<T>(req: Request, schema: z.ZodSchema<T>) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    return { data, error: null };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return {
        data: null,
        error: Response.json(
          { error: "Validation failed", details: (err as any).errors },
          { status: 422 }
        ),
      };
    }
    return {
      data: null,
      error: Response.json({ error: "Invalid JSON" }, { status: 400 }),
    };
  }
}
