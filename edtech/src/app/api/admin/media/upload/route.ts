import { NextRequest, NextResponse } from "next/server";
import { authRule } from "@/lib/rules/authRule";
import { createClient } from "@supabase/supabase-js";

function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export async function POST(request: NextRequest) {
  const auth = await authRule(request);
  if (!auth || auth.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const stepContext = formData.get("stepContext") as string || "";

  if (!file || !file.size) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const ALLOWED_TYPES = ["image/jpeg","image/png","image/webp","application/pdf"];
  if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: "Invalid file type" }, { status: 400 });

  if (file.size > 50 * 1024 * 1024) return NextResponse.json({ error: "File too large" }, { status: 413 });

  const bucket = file.type === "application/pdf" ? "chapter-pdfs" : "chapter-images";
  const path = `${Date.now()}-${file.name.replace(/[^a-z0-9.-]/gi, "_")}`;

  const adminClient = createAdminClient();

  const arrayBuffer = await file.arrayBuffer();
  const { data: storageData, error: storageErr } = await adminClient.storage
    .from(bucket)
    .upload(path, arrayBuffer, { contentType: file.type, upsert: false });

  if (storageErr) return NextResponse.json({ error: storageErr.message }, { status: 500 });

  // 1 year signed URL
  const { data: signed } = await adminClient.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60 * 24 * 365);

  if (!signed) return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 });

  const { data: mediaRecord, error: dbErr } = await adminClient
    .from("media_library")
    .insert({
      file_name: file.name,
      file_type: file.type,
      bucket_name: bucket,
      storage_path: path,
      signed_url: signed.signedUrl,
      created_by: auth.userId
    })
    .select()
    .single();

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });

  return NextResponse.json({ mediaId: mediaRecord.id, signedUrl: signed.signedUrl });
}
