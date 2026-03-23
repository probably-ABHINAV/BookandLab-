import { NextRequest } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { error: authErr } = await requireRole(request, "admin");
  if (authErr) return authErr;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "all";
  const subject = searchParams.get("subject") || "all";
  const search = searchParams.get("search") || "";

  const supabase = await createServerSupabaseClient();
  let q = supabase.from("media_library")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (type !== "all") q = q.eq("file_type", type);
  if (subject !== "all") q = q.eq("subject_tag", subject);
  if (search) q = q.ilike("file_name", `%${search}%`);

  const { data, error } = await q;
  if (error) return Response.json({ error: "Fetch failed", details: error }, { status: 500 });

  return Response.json({ files: data });
}
