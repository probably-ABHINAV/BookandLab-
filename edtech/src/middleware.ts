import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/lib/stackauth/config";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes — skip auth check
  const publicPaths = ["/login", "/signup", "/unauthorized", "/", "/api/auth"];
  if (publicPaths.some(p => pathname.startsWith(p))) return NextResponse.next();

  // Get current user from Stack Auth
  const user = await stackServerApp.getUser({ tokenStore: request }).catch(() => null);
  if (!user) return NextResponse.redirect(new URL("/login", request.url));

  const role = user.clientMetadata?.role;

  // Role guards
  if (pathname.startsWith("/student") && role !== "student")
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  if (pathname.startsWith("/mentor") && role !== "mentor")
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  if (pathname.startsWith("/admin") && role !== "admin")
    return NextResponse.redirect(new URL("/unauthorized", request.url));

  // API route role guards
  if (pathname.startsWith("/api/student") && role !== "student")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (pathname.startsWith("/api/mentor") && role !== "mentor")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (pathname.startsWith("/api/admin") && role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
