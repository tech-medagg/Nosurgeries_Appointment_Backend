import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";

import {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  GoogleOAuthInput,
} from "./auth.validation";
import * as authRepository from "./auth.repository";
import { generateAccessToken } from "../../utils/jwt";
import { sendPasswordResetEmail } from "../../utils/email";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ── Helpers ─────────────────────────────────────────── */

const generateOtp = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit

export const getRoles = async () => {
  return await authRepository.getAllRoles();
};

/* ── Register ─────────────────────────────────────────── */

export const register = async (data: RegisterInput) => {
  let roleId = data.roleId;

  if (!roleId) {
    const roleRecord = await authRepository.findRoleByName(data.roleName || "PATIENT");
    if (!roleRecord) {
      return { success: false, message: "Specified role was not found" };
    }
    roleId = roleRecord.id;
  }

  const existingEmail = await authRepository.findUserByEmail(data.email);
  if (existingEmail) {
    return { success: false, message: "Email already exists" };
  }

  const existingMobile = await authRepository.findUserByMobile(data.mobile);
  if (existingMobile) {
    return { success: false, message: "Mobile number already exists" };
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await authRepository.createUser({
    ...data,
    roleId,
    password: hashedPassword,
  });

  if (!user) throw new Error("Failed to create user");

  const { password, ...safeUser } = user;

  return {
    success: true,
    message: "User registered successfully",
    data: safeUser,
  };
};

/* ── Login (email OR mobile + password) ───────────────── */

export const login = async (data: LoginInput) => {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.identifier);

  const user = isEmail
    ? await authRepository.findUserByEmail(data.identifier)
    : await authRepository.findUserByMobile(data.identifier);

  if (!user) {
    return { success: false, message: "Invalid credentials" };
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    return { success: false, message: "Invalid credentials" };
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    roleId: user.roleId,
    roleName: user.roleName,
    email: user.email,
  });

  const { password, ...safeUser } = user;

  return {
    success: true,
    message: "Login successful",
    data: { accessToken, user: safeUser },
  };
};

/* ── Forgot Password — send OTP to email ──────────────── */

export const forgotPassword = async (data: ForgotPasswordInput) => {
  const user = await authRepository.findUserByEmail(data.email);

  if (!user) {
    // Don't reveal whether email exists
    return {
      success: true,
      message:
        "If that email is registered, a reset code has been sent.",
    };
  }

  const otp = generateOtp();
  await authRepository.createPasswordResetOtp(user.id, otp);

  try {
    await sendPasswordResetEmail(user.email, otp, user.fullName);
  } catch (err) {
    console.error("Email send failed:", err);
    return { success: false, message: "Failed to send reset email. Please try again." };
  }

  return {
    success: true,
    message: "A 6-digit verification code has been sent to your email.",
  };
};

/* ── Reset Password — verify OTP + update password ───── */

export const resetPassword = async (data: ResetPasswordInput) => {
  const user = await authRepository.findUserByEmail(data.email);

  if (!user) {
    return { success: false, message: "Invalid request." };
  }

  const token = await authRepository.verifyPasswordResetOtp(user.id, data.otp);

  if (!token) {
    return {
      success: false,
      message: "Invalid or expired verification code. Please request a new one.",
    };
  }

  const hashedPassword = await bcrypt.hash(data.newPassword, 10);
  await authRepository.updateUserPassword(user.id, hashedPassword);
  await authRepository.markOtpUsed(token.id);

  return {
    success: true,
    message: "Password has been reset successfully. You can now log in.",
  };
};

/* ── Google OAuth — verify credential + login/register ── */

export const googleLogin = async (data: GoogleOAuthInput) => {
  let email = "";
  let name: string | undefined = "";
  let googleId = "";

  /* ── Path 1: Real Google OAuth (useGoogleLogin hook → access_token) ── */
  if (data.accessToken) {
    try {
      // Verify access_token by calling Google's userinfo endpoint
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${data.accessToken}` },
      });
      if (!res.ok) {
        return { success: false, message: "Google access token verification failed." };
      }
      const userInfo = await res.json() as { email?: string; name?: string; sub?: string };
      if (!userInfo.email) {
        return { success: false, message: "Could not retrieve email from Google." };
      }
      email    = userInfo.email;
      name     = data.name || userInfo.name || email.split("@")[0];
      googleId = userInfo.sub || data.googleId || "google_" + Date.now();
    } catch {
      return { success: false, message: "Failed to verify Google account. Please try again." };
    }

  /* ── Path 2: Demo / dev simulation (demo_oauth_ prefix) ── */
  } else if (data.credential!.startsWith("demo_oauth_")) {
    try {
      const cleanToken = data.credential!.replace("demo_oauth_", "");
      const raw = Buffer.from(cleanToken, "base64").toString("utf-8");
      let jsonStr = raw;
      try { jsonStr = decodeURIComponent(raw); } catch { /* already plain JSON */ }
      const parsed = JSON.parse(jsonStr);
      email    = parsed.email;
      name     = parsed.name || "Google User";
      googleId = parsed.googleId || "google_demo_" + Date.now();
    } catch {
      return { success: false, message: "Invalid Google credential format." };
    }

  /* ── Path 3: Real id_token from GoogleLogin component ── */
  } else if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID.includes("YOUR_GOOGLE")) {
    try {
      const parts = data.credential!.split(".");
      const payloadB64 = (parts.length >= 2 && parts[1]) ? parts[1] : (data.credential || "");
      const parsed = JSON.parse(Buffer.from(payloadB64, "base64").toString("utf-8"));
      email    = parsed.email;
      name     = parsed.name || "Google User";
      googleId = parsed.sub || "google_id_" + Date.now();
    } catch {
      return { success: false, message: "Google Client ID is not configured on the server." };
    }
  } else {
    const ticket = (await googleClient.verifyIdToken({
      idToken: data.credential!,
      audience: process.env.GOOGLE_CLIENT_ID || "",
    })) as any;
    const payload = ticket.getPayload();
    if (!payload?.email) {
      return { success: false, message: "Invalid Google credential." };
    }
    email    = payload.email;
    name     = payload.name;
    googleId = payload.sub;
  }

  // Check if user already exists
  let user = await authRepository.findUserByEmail(email);

  if (!user) {
    // If roleId not supplied, try roleName or default to PATIENT role
    let roleId = data.roleId;
    if (!roleId && data.roleName) {
      const selectedRole = await authRepository.findRoleByName(data.roleName);
      roleId = selectedRole?.id;
    }
    if (!roleId) {
      const defaultRole = await authRepository.findRoleByName("PATIENT");
      roleId = defaultRole?.id;
    }

    if (!roleId) {
      return { success: false, message: "Failed to resolve default patient role." };
    }

    // Create user with a random password
    const randomPassword = await bcrypt.hash(
      googleId + (process.env.JWT_SECRET ?? "dev-only-fallback-secret-do-not-use-in-prod"),
      10
    );

    // Generate unique mobile number to avoid unique constraint violations
    const uniqueMobile = "G_" + Math.floor(1000000000 + Math.random() * 9000000000).toString();

    await authRepository.createUser({
      roleId,
      fullName: name || email.split("@")[0] || "Google User",
      email,
      mobile: uniqueMobile,
      password: randomPassword,
      isEmailVerified: true,
    });

    user = await authRepository.findUserByEmail(email);
  }

  if (!user) {
    return { success: false, message: "Failed to process Google login." };
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    roleId: user.roleId,
    roleName: user.roleName,
    email: user.email,
  });

  const { password: _pw, ...safeUser } = user as any;

  return {
    success: true,
    message: "Logged in with Google successfully",
    data: { accessToken, user: safeUser },
  };
};

/* ── Lookup User Roles By Emails (for Profile Credentials / Account Chooser) ── */

export const lookupRolesByEmails = async (emails: string[]) => {
  const result: Record<string, { exists: boolean; roleName?: string; fullName?: string }> = {};

  for (const email of emails) {
    if (!email || typeof email !== "string") continue;
    const cleanEmail = email.trim().toLowerCase();
    const user = await authRepository.findUserByEmail(cleanEmail);
    if (user) {
      result[cleanEmail] = {
        exists: true,
        roleName: user.roleName,
        fullName: user.fullName,
      };
    } else {
      result[cleanEmail] = { exists: false };
    }
  }

  return { success: true, data: result };
};