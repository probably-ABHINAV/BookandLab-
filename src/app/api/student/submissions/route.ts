import { NextRequest, NextResponse } from "next/server";
import { authRule } from "@/lib/rules/authRule";
import { projectSubmitSchema, validateBody } from "@/lib/validations/schemas";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const auth = await authRule(request);
  if (!auth || auth.role !== "student") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await validateBody(request, projectSubmitSchema);
  if (error) return error;

  const supabase = await createServerSupabaseClient();

  const { data: submission, error: dbErr } = await supabase
    .from("submissions")
    .insert({
      student_id: auth.userId,
      chapter_id: data.chapter_id,
      answer_text: data.text_answer,
      file_url: data.file_url || null,
      status: "submitted",
    })
    .select()
    .single();

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });

  return NextResponse.json({ success: true, submission });
}
