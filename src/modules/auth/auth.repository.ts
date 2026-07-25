import { eq } from "drizzle-orm";

import { db } from "../../db";
import { users } from "../../db/schema/users";
import { RegisterInput } from "./auth.validation";

/**
 * Find user by email
 */
export const findUserByEmail = async (email: string) => {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  });
};

/**
 * Find user by mobile
 */
export const findUserByMobile = async (mobile: string) => {
  return await db.query.users.findFirst({
    where: eq(users.mobile, mobile),
  });
};

/**
 * Create new user
 */
export const createUser = async (data: RegisterInput) => {
  const [user] = await db
    .insert(users)
    .values({
      roleId: data.roleId,
      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile,
      password: data.password, // Will be hashed in the service layer
    })
    .returning();

  return user;
};