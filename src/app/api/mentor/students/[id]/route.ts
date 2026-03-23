import { NextRequest, NextResponse } from "next/server";
import { authRule } from "@/lib/rules/authRule";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authRule(request);
  if (!auth || auth.role !== "mentor") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id: studentId } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: assignment } = await supabase
    .from("mentor_assignments")
    .select("id")
    .eq("mentor_id", auth.userId)
    .eq("student_id", studentId)
    .single();

  if (!assignment) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data: student } = await supabase
    .from("users")
    .select("id, name, email")
    .eq("id", studentId)
    .single();

  return NextResponse.json({ success: true, student });
}
