import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const path = request.nextUrl.pathname;

      const isOnAdmin = path.startsWith("/admin");
      const isOnDashboard = path.startsWith("/dashboard");

      if (isOnAdmin) {
        const role = (auth?.user as any)?.role;
        return isLoggedIn && (role === "admin" || role === "superadmin");
      }

      if (isOnDashboard) {
        return isLoggedIn;
      }

      return true;
    },
  },
  providers: [], // populated in auth.ts
} satisfies NextAuthConfig;