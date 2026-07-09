import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "resident" | "admin" | "superadmin";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "user" | "admin" | "superadmin";
  }
}


declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "resident" | "admin" | "superadmin";
  }
}