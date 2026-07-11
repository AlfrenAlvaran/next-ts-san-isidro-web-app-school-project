import { UserRole } from "@/constant/types";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["resident"];
  }

  interface User {
    id: string;
    role: "user" | "admin" | "superadmin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}
