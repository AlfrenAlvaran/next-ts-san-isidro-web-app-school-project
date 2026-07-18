import { AuthShell } from "@/components/auth/AuthShell";
import AuthForm from "@/components/auth/AuthForm";
import Link from "next/link";
import React, { Suspense } from "react";

const page = () => {
  return (
    <AuthShell
      formNumber="FORM NO. LGU-01-A"
      eyebrow="Sign In"
      title="Welcome Back"
      subtitle="Sign In to continue where left off."
      footer={
        <>
          No account yet?{" "}
          <Link
            href={"/sign-up"}
            className="text-[#B8860B] font-semibold hover:underline"
          >
            Sign Up here
          </Link>
        </>
      }
    >
      <Suspense fallback={<div>Loading...</div>}>
        <AuthForm type="sign-in" />
      </Suspense>
    </AuthShell>
  );
};

export default page;