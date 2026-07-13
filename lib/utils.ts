import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const authFormSchema = (type: string) =>
  z
    .object({
      fullName:
        type === "sign-up"
          ? z.string().trim().min(1, "Full name is required")
          : z.string().optional(),
      email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address")
        .toLowerCase(),
      phone:
        type === "sign-up"
          ? z
              .string()
              .trim()
              .regex(
                /^(09\d{9}|\+639\d{9})$/,
                "Please enter a valid Philippine mobile number.",
              )
          : z.string().optional(),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword:
        type === "sign-up"
          ? z.string().min(1, "Please confirm your password")
          : z.string().optional(),
      agreeTerms: type === "sign-up" ? z.boolean() : z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
      if (type === "sign-up") {
        if (data.password !== data.confirmPassword) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passwords don't match",
            path: ["confirmPassword"],
          });
        }
        if (!data.agreeTerms) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please agree to the Terms and Privacy Policy.",
            path: ["agreeTerms"],
          });
        }
      }
    });

export type AuthFormData = z.infer<ReturnType<typeof authFormSchema>>;


