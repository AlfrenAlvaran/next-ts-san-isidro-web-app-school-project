import NextAuth, { CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { authFormSchema } from "./lib/utils";
import { connection } from "./lib/database";
import UserModel from "./models/UserModel";

class UnverifiedError extends CredentialsSignin {
  code = "unverified";
}

class UnapprovedError extends CredentialsSignin {
  code = "unapproved";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = authFormSchema("sign-in").safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        await connection();

        const user = await UserModel.findOne({ email }).select("+password");
        if (!user) return null;

        const isValid = await user.comparePassword(password);
        if (!isValid) return null;

        if (!user.isVerified) {
          throw new UnverifiedError();
        }

        if (!user.isApproved) {
          throw new UnapprovedError();
        }

        return {
          id: user._id.toString(),
          name: user.fullName,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
});