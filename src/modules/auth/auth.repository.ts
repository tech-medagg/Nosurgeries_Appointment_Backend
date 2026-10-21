import { and, eq, gt } from "drizzle-orm";

import { db } from "../../db";
import { users } from "../../db/schema/users";
import { roles } from "../../db/schema/roles";
import { passwordResetTokens } from "../../db/schema/password_reset_tokens";
import { RegisterInput } from "./auth.validation";

/* ── Find helpers ──────────────────────────────────────── */

export const findRoleByName = async (roleName: string) => {
  const result = await db
    .select({
      id: roles.id,
      name: roles.name,
      description: roles.description,
    })
    .from(roles)
    .where(eq(roles.name, roleName))
    .limit(1);

  return result[0] ?? null;
};

export const getAllRoles = async () => {
  return await db
    .select({
      id: roles.id,
      name: roles.name,
      description: roles.description,
    })
    .from(roles);
};

export const findUserByEmail = async (email: string) => {
  const result = await db
    .select({
      id: users.id,
      roleId: users.roleId,
      roleName: roles.name,
      fullName: users.fullName,
      email: users.email,
      mobile: users.mobile,
      password: users.password,
      status: users.status,
      isEmailVerified: users.isEmailVerified,
      isMobileVerified: users.isMobileVerified,
      lastLogin: users.lastLogin,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))
    .where(eq(users.email, email));

  return result[0] ?? null;
};

export const findUserByMobile = async (mobile: string) => {
  try {
    const result = await db
      .select({
        id: users.id,
        roleId: users.roleId,
        roleName: roles.name,
        fullName: users.fullName,
        email: users.email,
        mobile: users.mobile,
        password: users.password,
        status: users.status,
        isEmailVerified: users.isEmailVerified,
        isMobileVerified: users.isMobileVerified,
        lastLogin: users.lastLogin,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .innerJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.mobile, mobile));

    return result[0] ?? null;
  } catch (error) {
    console.error("==================================");
    console.error("DATABASE ERROR:");
    console.error(error);
    console.error("==================================");
    throw error;
  }
};

export const findUserById = async (id: string) => {
  const result = await db
    .select({
      id: users.id,
      roleId: users.roleId,
      roleName: roles.name,
      fullName: users.fullName,
      email: users.email,
      mobile: users.mobile,
      status: users.status,
      isEmailVerified: users.isEmailVerified,
      isMobileVerified: users.isMobileVerified,
      lastLogin: users.lastLogin,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))
    .where(eq(users.id, id));

  return result[0] ?? null;
};

export const createUser = async (
  data: Omit<RegisterInput, "roleId"> & {
    roleId: string;
    password: string;
    googleId?: string;
    isEmailVerified?: boolean;
  }
) => {
  const [user] = await db
    .insert(users)
    .values({
      roleId: data.roleId,
      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile ?? "",
      password: data.password,
      isEmailVerified: data.isEmailVerified ?? false,
    })
    .returning();

  return user;
};

export const updateUserPassword = async (userId: string, hashedPassword: string) => {
  await db
    .update(users)
    .set({ password: hashedPassword, updatedAt: new Date() })
    .where(eq(users.id, userId));
};

/* ── OTP helpers ────────────────────────────────────────── */

export const createPasswordResetOtp = async (userId: string, otp: string) => {
  // Invalidate any existing tokens for this user
  await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.userId, userId));

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await db.insert(passwordResetTokens).values({
    userId,
    otp,
    expiresAt,
  });
};

export const verifyPasswordResetOtp = async (userId: string, otp: string) => {
  const now = new Date();

  const result = await db
    .select()
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.userId, userId),
        eq(passwordResetTokens.otp, otp),
        eq(passwordResetTokens.used, false),
        gt(passwordResetTokens.expiresAt, now)
      )
    );

  return result[0] ?? null;
};

export const markOtpUsed = async (tokenId: string) => {
  await db
    .update(passwordResetTokens)
    .set({ used: true })
    .where(eq(passwordResetTokens.id, tokenId));
};