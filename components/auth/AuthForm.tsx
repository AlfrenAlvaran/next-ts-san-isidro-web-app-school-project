"use client";
import React, { useRef, useState } from "react";
import CustomInput from "./CustomInput";
import z from "zod";
import { authFormSchema } from "@/lib/utils";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordStrength, StrengthMeter } from "./auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import axios from "axios";

import { AUTH_ERROR_CODES, type AuthErrorCode } from "@/constant";

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

function DocumentIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16V4m0 0L7 9m5-5l5 5M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
      />
    </svg>
  );
}

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // const isSignIn = type === "sign-in";
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  // ID Upload
  const [idFile, setIdFile] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState("");

  const handleFileSelect = (file: File | null) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError("Please upload a JPG, PNG, WEBP, or PDF file");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFileError(`File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setFileError("");
    setIdFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setIdPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setIdPreview(null); // PDF — no thumbnail, just show file name
    }
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] ?? null;
    handleFileSelect(file);
  };

  const removeFile = () => {
    setIdFile(null);
    setIdPreview(null);
    setFileError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const formSchema = authFormSchema(type);
  const { control, handleSubmit, watch } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      if (type === "sign-in") {
        const { email, password } = data as { email: string; password: string };
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
          [AUTH_ERROR_CODES.UNVERIFIED]:
            "Please verify your email before signing in.",
          [AUTH_ERROR_CODES.UNAPPROVED]:
            "Your account is pending admin approval.",
          [AUTH_ERROR_CODES.CREDENTIALS]: "Invalid email or password.",
        };

        if (result?.error) {
          toast.error(
            AUTH_ERROR_MESSAGES[result.error as AuthErrorCode] ??
              "Something went wrong. Please try again.",
          );
          return;
        }

        toast.success("Sign in successfully");
        const session = await getSession();
        const role = session?.user?.role;

        const roleRedirects: Record<string, string> = {
          admin: "/dashboard",
          resident: "/home",
        };
        router.push(roleRedirects[role as string] || callbackUrl);
        router.refresh();
        return;
      }

      if (type === "sign-up") {
        if (!idFile) {
          setFileError("Please upload a valid ID before continuing.");
          toast.error("Please upload a valid ID before continuing");
          return;
        }

        const signUpData = data as {
          fullName: string;
          email: string;
          phone: string;
          password: string;
          confirmPassword: string;
          agreeTerms: boolean;
        };

        const form = new FormData();
        form.append("fullName", signUpData.fullName);
        form.append("email", signUpData.email);
        form.append("phone", signUpData.phone);
        form.append("password", signUpData.password);
        form.append("confirmPassword", signUpData.confirmPassword);
        form.append("agreeTerms", String(signUpData.agreeTerms));
        form.append("idFile", idFile);

        const res = await axios.post("/api/auth/sign-up", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(res.data.message || "Account created successfully!");
        router.push("/check-inbox-message");
      }
    } catch (error: any) {
      const message = error.response?.data?.error || "Something went wrong.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const password = watch("password");
  const strength = passwordStrength(password);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {type === "sign-up" && (
        <CustomInput
          control={control}
          name="fullName"
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
        />
      )}
      <CustomInput
        control={control}
        name="email"
        label="Email"
        type="text"
        placeholder="your@email.com"
      />

      {type === "sign-up" && (
        <CustomInput
          control={control}
          name="phone"
          label="Phone number"
          type="tel"
          placeholder="09XX XXX XXXX"
        />
      )}

      <div>
        <CustomInput
          control={control}
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
        />

        {type === "sign-in" && (
          <div className="flex justify-end mt-1.5">
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-[#B8860B] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        )}

        {type === "sign-up" && password?.length > 0 && (
          <StrengthMeter strength={strength} />
        )}
      </div>

      {type === "sign-up" && (
        <CustomInput
          control={control}
          name="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="••••••••"
        />
      )}

      {type === "sign-up" && (
        <div>
          <label htmlFor="Upload ID">
            Valid ID (photo or document) shown your Address
          </label>

          {!idFile ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 hover:border-[#B8860B] rounded-2xl py-8 px-4 cursor-pointer transition-colors text-slate-400 hover:text-[#B8860B]"
            >
              <UploadIcon />
              <p className="text-sm font-medium">
                Drag & drop, or{" "}
                <span className="text-[#B8860B] underline">browse</span>
              </p>
              <p className="text-xs text-slate-400">
                JPG, PNG, WEBP, or PDF — up to {MAX_FILE_SIZE_MB}MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 border border-slate-200 rounded-2xl p-3">
              {idPreview ? (
                <img
                  src={idPreview}
                  alt="ID preview"
                  className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                />
              ) : (
                <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                  <DocumentIcon />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">
                  {idFile.name}
                </p>
                <p className="text-xs text-slate-400">
                  {(idFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="text-slate-400 hover:text-red-500 text-xs font-semibold transition-colors"
              >
                Remove
              </button>
            </div>
          )}
          {fileError && (
            <p className="text-red-500 text-xs font-medium mt-2">{fileError}</p>
          )}
        </div>
      )}

      {type === "sign-up" && (
        <Controller
          control={control}
          name="agreeTerms"
          render={({ field, fieldState }) => (
            <div>
              <label className="flex items-start gap-2.5 text-[13px] text-slate-500 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 rounded-sm border-slate-300 text-[#B8860B] focus:ring-[#B8860B]/40"
                />
                <span>
                  I agree to the{" "}
                  <Link
                    href="#"
                    className="text-[#B8860B] font-semibold hover:underline"
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="#"
                    className="text-[#B8860B] font-semibold hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {fieldState.error && (
                <p className="text-red-500 text-xs font-medium mt-1">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 bg-[#B8860B] hover:bg-[#a3760a] active:scale-[0.99] disabled:opacity-60 text-[#0F172A] text-sm font-bold rounded-full transition-all duration-150"
      >
        {loading ? (
          <>
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth={4}
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            {type === "sign-in" ? "Signing in..." : "Creating account..."}
          </>
        ) : type === "sign-in" ? (
          "Sign in →"
        ) : (
          "Create account →"
        )}
      </button>
    </form>
  );
};

export default AuthForm;