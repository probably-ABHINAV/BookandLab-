import { NextRequest } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error: authErr } = await requireRole(request, "admin");
  if (authErr) return authErr;

  const { id } = await params;

  const supabase = await createServerSupabaseClient();

  // Get file record first
  const { data: file } = await supabase
    .from("media_library")
    .select("*")
    .eq("id", id)
    .single();

  if (!file) return Response.json({ error: "Not found" }, { status: 404 });

  // Delete from Supabase Storage
  const storageClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await storageClient.storage
    .from(file.bucket_name)
    .remove([file.storage_path]);

  // Soft delete from DB
  await supabase.from("media_library")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  return Response.json({ success: true });
}
