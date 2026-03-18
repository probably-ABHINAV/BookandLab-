import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function requireRole(request: NextRequest, role: string) {
  // Get user from custom headers (set by middleware after Stack Auth verification)
  const userId = request.headers.get("x-user-id");
  const userRole = request.headers.get("x-user-role");

  // Fallback: check cookies for session
  if (!userId) {
    // Try to get from Supabase session or Stack Auth
    const supabase = await createServerSupabaseClient();
    const authHeader = request.headers.get("authorization");

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      // For MVP: look up user by token/id
      const { data: user } = await supabase
        .from("users")
        .select("id, role")
        .eq("stack_auth_id", token)
        .single();

      if (user && user.role === role) {
        return { error: null, user: { id: user.id, role: user.role } };
      }
    }

    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      user: null,
    };
  }

  if (userRole !== role) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      user: null,
    };
  }

  return { error: null, user: { id: userId, role: userRole } };
}
