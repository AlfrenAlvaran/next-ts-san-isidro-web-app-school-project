import type { NextAuthConfig } from "next-auth";
import { UserRole } from "@/constant/types";

const ROUTE_RULES: { prefix: string; roles: UserRole[] }[] = [
  // Elevated-only
  { prefix: "/superadmin", roles: ["superadmin"] },
  { prefix: "/admin", roles: ["admin", "superadmin"] },
  { prefix: "/dashboard", roles: ["admin", "superadmin"] },

  // Resident-only
  { prefix: "/home", roles: ["resident"] },
  { prefix: "/request", roles: ["resident"] },
  { prefix: "/track", roles: ["resident"] },
];

const ROLE_HOME: Record<UserRole, string> = {
  resident: "/home",
  admin: "/dashboard",
  superadmin: "/dashboard",
};

function matchRoute(path: string) {
  return ROUTE_RULES.find(
    (rule) => path === rule.prefix || path.startsWith(rule.prefix + "/")
  );
}

export const authConfig = {
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const path = request.nextUrl.pathname;

      const matchedRule = matchRoute(path);

      // No rule matches this path
      if (!matchedRule) {
        // Optional: redirect authenticated users away from root to their role home
        if (path === "/" && isLoggedIn && auth.user.role) {
          return Response.redirect(
            new URL(ROLE_HOME[auth.user.role], request.nextUrl)
          );
        }
        return true;
      }

      // Path is protected but user isn't logged in
      if (!isLoggedIn) return false;

      const role = auth.user.role;

      // Logged in but wrong role for this route
      if (!role || !matchedRule.roles.includes(role)) {
        const deniedUrl = new URL("/unauthorized", request.nextUrl);
        deniedUrl.searchParams.set("path", path);
        return Response.redirect(deniedUrl);
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;