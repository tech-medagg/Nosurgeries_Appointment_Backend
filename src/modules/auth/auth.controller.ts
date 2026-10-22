import { Request, Response } from "express";

import * as authService from "./auth.service";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  googleOAuthSchema,
} from "./auth.validation";
import { AuthRequest } from "../../middleware/auth.middleware";

/* ── Roles ────────────────────────────────────────────── */

export const getRoles = async (_req: Request, res: Response) => {
  try {
    const roles = await authService.getRoles();
    return res.status(200).json({ success: true, data: roles });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ── Register ─────────────────────────────────────────── */

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await authService.register(validatedData);
    return res.status(result.success ? 201 : 400).json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error.message,
    });
  }
};

/* ── Login (email OR mobile) ──────────────────────────── */

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.login(validatedData);

    if (!result.success) {
      return res.status(401).json(result);
    }
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("LOGIN ERROR:", error);
    const isDbError =
      error?.message?.includes("Failed query") ||
      error?.code === "ECONNREFUSED" ||
      error?.message?.includes("connect ECONNREFUSED");
    const userMessage = isDbError
      ? "Database service is temporarily unavailable. Please verify the database connection or try again later."
      : (error.message || "An unexpected error occurred during login.");
    return res.status(500).json({ success: false, message: userMessage });
  }
};

/* ── Me ───────────────────────────────────────────────── */

export const me = async (req: AuthRequest, res: Response) => {
  return res.status(200).json({ success: true, data: req.user });
};

/* ── Forgot Password ──────────────────────────────────── */

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const validatedData = forgotPasswordSchema.parse(req.body);
    const result = await authService.forgotPassword(validatedData);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/* ── Reset Password ───────────────────────────────────── */

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const validatedData = resetPasswordSchema.parse(req.body);
    const result = await authService.resetPassword(validatedData);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/* ── Google OAuth ─────────────────────────────────────── */

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const validatedData = googleOAuthSchema.parse(req.body);
    const result = await authService.googleLogin(validatedData);

    if (!result.success) {
      // Special case: first time Google user — frontend should prompt role selection
      if ((result as any).message === "first_time_signup") {
        return res.status(200).json({
          success: false,
          requiresRoleSelection: true,
          data: result.data,
        });
      }
      return res.status(401).json(result);
    }
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/* ── Lookup User Roles By Email List ───────────────────── */

export const lookupRoles = async (req: Request, res: Response) => {
  try {
    const emails = Array.isArray(req.body.emails) ? req.body.emails : [];
    const result = await authService.lookupRolesByEmails(emails);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};