import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes — no auth required
  const publicPaths = ["/", "/login", "/signup", "/api/auth"];
  if (publicPaths.some((r) => pathname === r || pathname.startsWith(r + "/"))) {
    return NextResponse.next();
  }

  // Static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // For MVP: Check for auth cookie/header
  // In production: verify Stack Auth JWT here
  const userId = request.cookies.get("user_id")?.value;
  const userRole = request.cookies.get("user_role")?.value;

  if (!userId || !userRole) {
    // Not logged in → redirect to login
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based guards
  if (pathname.startsWith("/student") && userRole !== "student") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.startsWith("/mentor") && userRole !== "mentor") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.startsWith("/admin") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Pass user info to API routes via headers
  const response = NextResponse.next();
  response.headers.set("x-user-id", userId);
  response.headers.set("x-user-role", userRole);

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
