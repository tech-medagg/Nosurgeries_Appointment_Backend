import { z } from "zod";

/**
 * Register Validation
 */
export const registerSchema = z.object({
  roleId: z.uuid("Invalid role id"),

  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(150),

  email: z.email("Invalid email address"),

  mobile: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(20),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Login Validation
 */
export const loginSchema = z.object({
  mobile: z.string().min(10).max(20),

  password: z.string().min(8),
});

export type LoginInput = z.infer<typeof loginSchema>;