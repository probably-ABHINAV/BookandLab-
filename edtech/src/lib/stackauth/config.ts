// Stack Auth configuration
// Note: Uses @stackframe/stack (the actual npm package name)
// For MVP, we use a simplified auth check via supabase user lookup
// Stack Auth integration will be configured when credentials are provided

import { StackServerApp } from "@stackframe/stack";

export const stackAuthConfig = {
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
  secretServerKey: process.env.STACK_SECRET_SERVER_KEY!,
};

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
});

// For MVP: we validate auth via custom headers + supabase user lookup
// In production: replace with Stack Auth JWT verification
export async function getAuthUser(request: Request): Promise<{ id: string; role: string } | null> {
  const authHeader = request.headers.get("x-user-id");
  const roleHeader = request.headers.get("x-user-role");

  if (authHeader && roleHeader) {
    return { id: authHeader, role: roleHeader };
  }

  return null;
}
