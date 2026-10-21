import { z } from "zod";

/**
 * Register Validation
 */
export const registerSchema = z.object({
  roleId: z.string().uuid("Invalid role id").optional(),
  roleName: z.enum(["PATIENT", "DOCTOR", "ADMIN", "SUPER_ADMIN", "COORDINATOR"]).optional(),

  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .min(3, "Full name must be at least 3 characters")
    .max(150, "Full name must not exceed 150 characters"),

  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Invalid email address"),

  mobile: z
    .string()
    .trim()
    .min(1, "Mobile number is required")
    .min(10, "Mobile number must be at least 10 digits")
    .max(20, "Mobile number is too long"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Login Validation — accepts email OR mobile + password
 */
export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or mobile number is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Forgot Password — request OTP
 */
export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset Password — verify OTP + set new password
 */
export const resetPasswordSchema = z.object({
  email: z.email("Enter a valid email address"),
  otp: z.string().min(4, "Enter the 6-digit code").max(8),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * Google OAuth — supports:
 *   1. credential (id_token from @react-oauth/google GoogleLogin)
 *   2. accessToken (from useGoogleLogin hook) + email + name + googleId
 *   3. demo_oauth_ prefix for dev simulation
 */
export const googleOAuthSchema = z.object({
  // id_token path (GoogleLogin component)
  credential: z.string().optional(),
  // access_token path (useGoogleLogin hook — real popup OAuth)
  accessToken: z.string().optional(),
  email:       z.string().email().optional(),
  name:        z.string().optional(),
  googleId:    z.string().optional(),
  // role
  roleId:   z.string().uuid().optional(),
  roleName: z.enum(["PATIENT", "DOCTOR", "ADMIN", "SUPER_ADMIN", "COORDINATOR"]).optional(),
}).refine(
  (d) => !!(d.credential || d.accessToken),
  { message: "Either credential or accessToken is required" }
);

export type GoogleOAuthInput = z.infer<typeof googleOAuthSchema>;