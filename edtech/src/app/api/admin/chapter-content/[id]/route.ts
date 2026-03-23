import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { createServerSupabaseAdmin } from "@/lib/supabase/server";
import { z } from "zod";

const contentSchema = z.object({
  step1_context:         z.string().max(3000).optional(),
  step1_image_url:       z.string().url().nullable().optional(),
  step2_concept:         z.string().max(4000).optional(),
  step2_image_url:       z.string().url().nullable().optional(),
  step2_key_terms:       z.array(z.string().max(50)).max(20).optional(),
  step3_thinking:        z.array(z.object({
                           prompt: z.string().max(500),
                           type: z.enum(["open","guided"]),
                         })).max(5).optional(),
  step4_deep:            z.string().max(8000).optional(),
  step4_image_url:       z.string().url().nullable().optional(),
  step4_examples:        z.array(z.object({
                           problem: z.string().max(1000),
                           solution: z.string().max(2000),
                           image_url: z.string().url().nullable().optional(),
                         })).max(5).optional(),
  step4_misconception:   z.string().max(1000).optional(),
  step5_project:         z.string().max(2000).optional(),
  step5_image_url:       z.string().url().nullable().optional(),
  step5_submission_type: z.enum(["text","text_reflection","both"]).optional(),
  materials:             z.array(z.object({
                           type: z.enum(["pdf","link"]),
                           title: z.string().max(200),
                           url: z.string().url(),
                           description: z.string().max(500).optional(),
                         })).max(10).optional(),
  step6_reflection:      z.array(z.object({
                           prompt: z.string().max(500),
                         })).max(5).optional(),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error: authErr } = await requireRole(request, "admin");
  if (authErr) return authErr;

  const { id } = await params;
  const supabase = await createServerSupabaseAdmin();
  const { data, error } = await supabase
    .from("chapter_content")
    .select("*")
    .eq("chapter_id", id)
    .single();

  return Response.json({ content: data || null });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error: authErr } = await requireRole(request, "admin");
  if (authErr) return authErr;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const parsed = contentSchema.safeParse(body);
  if (!parsed.success)
    return Response.json({ error: "Validation failed", details: parsed.error.issues }, { status: 422 });

  const supabase = await createServerSupabaseAdmin();
  const { data, error } = await supabase
    .from("chapter_content")
    .upsert({
      chapter_id: id,
      ...parsed.data,
      updated_at: new Date().toISOString(),
    }, { onConflict: "chapter_id" })
    .select()
    .single();

  if (error) return Response.json({ error: "Save failed", details: error }, { status: 500 });
  return Response.json({ success: true, content: data, saved_at: new Date().toISOString() });
}
