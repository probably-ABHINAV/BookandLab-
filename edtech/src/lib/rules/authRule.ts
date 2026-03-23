import { stackServerApp } from "@/lib/stackauth/config";
import { NextRequest, NextResponse } from "next/server";

export async function requireRole(req: NextRequest, role: string) {
  const user = await stackServerApp.getUser({ tokenStore: req }).catch(() => null);
  if (!user)
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), user: null };
  if (user.clientMetadata?.role !== role)
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), user: null };
  return { error: null, user };
}

export async function authRule(request: Request) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = await stackServerApp.getUser({ tokenStore: request as any }).catch(()=>null);
  if (!user) return null;
  return {
    userId: user.id,
    role: user.clientMetadata?.role as string,
    email: user.primaryEmail
  };
}
