import { AuthShell } from "@/components/auth/AuthShell";
import AuthForm from "@/components/auth/AuthForm";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <AuthShell
      formNumber="FORM NO. LGU-01-A"
      eyebrow="Sign In"
      title="Sign Up as a resident"
      subtitle="Sign up to gets you access to every barangay San Isidro Services"
      footer={
        <>
          Already Sign Up?{" "}
          <Link
            href={"/sign-in"}
            className="text-[#B8860B] font-semibold hover:underline"
          >
            Sign In here
          </Link>
        </>
      }
    >
      <AuthForm type="sign-up" />
    </AuthShell>
  );
};

export default page;
