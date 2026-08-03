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
const SELFIE_ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

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

function CameraIcon() {
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
        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 17a4 4 0 100-8 4 4 0 000 8z"
      />
    </svg>
  );
}

function CameraCapture({
  onCapture,
  onClose,
}: {
  onCapture: (file: File) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState("");

  React.useEffect(() => {
    let mounted = true;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then((stream) => {
        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() =>
        setError(
          "Couldn't access your camera. Please allow camera permission or choose a file instead.",
        ),
      );

    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handleShoot = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // mirror the image so the saved photo matches what the user sees in the preview
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `selfie-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        onCapture(file);
      },
      "image/jpeg",
      0.92,
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg overflow-hidden w-full max-w-sm">
        <div className="relative bg-black aspect-square">
          {error ? (
            <div className="w-full h-full flex items-center justify-center p-6 text-center text-white text-sm">
              {error}
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover [transform:scaleX(-1)]"
            />
          )}
        </div>
        <div className="flex items-center justify-between gap-3 p-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-medium rounded-lg border border-slate-300 text-slate-500 hover:border-slate-400 transition-colors"
          >
            Cancel
          </button>
          {!error && (
            <button
              type="button"
              onClick={handleShoot}
              className="flex-1 py-2.5 text-xs font-semibold rounded-lg bg-[#0F172A] text-white hover:bg-[#1E293B] transition-colors"
            >
              Capture
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selfieLibraryInputRef = useRef<HTMLInputElement>(null);

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  // ID Upload
  const [idFile, setIdFile] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState("");

  // Selfie Upload
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [selfieError, setSelfieError] = useState("");
  const [showCamera, setShowCamera] = useState(false);

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

  const handleSelfieSelect = (file: File | null) => {
    if (!file) return;
    if (!SELFIE_ACCEPTED_TYPES.includes(file.type)) {
      setSelfieError("Please upload a JPG, PNG, or WEBP image");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setSelfieError(`File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setSelfieError("");
    setSelfieFile(file);

    const reader = new FileReader();
    reader.onload = () => setSelfiePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeSelfie = () => {
    setSelfieFile(null);
    setSelfiePreview(null);
    setSelfieError("");
    if (selfieLibraryInputRef.current) selfieLibraryInputRef.current.value = "";
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

        if (!selfieFile) {
          setSelfieError("Please take or upload a selfie before continuing.");
          toast.error("Please take or upload a selfie before continuing");
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
        form.append("selfieFile", selfieFile);

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
          <label htmlFor="Upload ID" className="text-sm font-medium text-slate-700">
            Valid ID (photo or document) showing your address
          </label>

          {!idFile ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 flex flex-col items-center justify-center gap-2 border border-dashed border-slate-300 hover:border-[#B8860B] rounded-lg py-7 px-4 cursor-pointer transition-colors text-slate-400 hover:text-[#B8860B]"
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
            <div className="mt-2 flex items-center gap-3 border border-slate-200 rounded-lg p-3">
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
        <div>
          <label htmlFor="Upload Selfie" className="text-sm font-medium text-slate-700">
            Take a selfie
          </label>

          {!selfieFile ? (
            <div className="mt-2 flex flex-col items-center justify-center gap-3 border border-dashed border-slate-300 rounded-lg py-7 px-4 text-slate-400">
              <CameraIcon />
              <p className="text-xs text-slate-400 text-center">
                JPG, PNG, or WEBP — up to {MAX_FILE_SIZE_MB}MB
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowCamera(true)}
                  className="px-4 py-2 text-xs font-medium rounded-lg border border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B]/5 transition-colors"
                >
                  Take Photo
                </button>
                <button
                  type="button"
                  onClick={() => selfieLibraryInputRef.current?.click()}
                  className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-300 text-slate-500 hover:border-[#B8860B] hover:text-[#B8860B] transition-colors"
                >
                  Choose File
                </button>
              </div>
              {/* Plain file picker: lets the user choose an existing photo */}
              <input
                ref={selfieLibraryInputRef}
                type="file"
                accept={SELFIE_ACCEPTED_TYPES.join(",")}
                className="hidden"
                onChange={(e) =>
                  handleSelfieSelect(e.target.files?.[0] ?? null)
                }
              />
            </div>
          ) : (
            <div className="mt-2 flex items-center gap-3 border border-slate-200 rounded-lg p-3">
              <img
                src={selfiePreview ?? undefined}
                alt="Selfie preview"
                className="w-14 h-14 object-cover rounded-full border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">
                  {selfieFile.name}
                </p>
                <p className="text-xs text-slate-400">
                  {(selfieFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={removeSelfie}
                className="text-slate-400 hover:text-red-500 text-xs font-semibold transition-colors"
              >
                Remove
              </button>
            </div>
          )}
          {selfieError && (
            <p className="text-red-500 text-xs font-medium mt-2">
              {selfieError}
            </p>
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
        className="w-full flex items-center justify-center gap-2 py-3 bg-[#0F172A] hover:bg-[#1E293B] active:scale-[0.99] disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-all duration-150"
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

      {showCamera && (
        <CameraCapture
          onCapture={(file) => {
            handleSelfieSelect(file);
            setShowCamera(false);
          }}
          onClose={() => setShowCamera(false)}
        />
      )}
    </form>
  );
};

export default AuthForm;