import { eq } from "drizzle-orm";

import { db } from "../../db";
import { users } from "../../db/schema/users";
import { roles } from "../../db/schema/roles";
import { RegisterInput } from "./auth.validation";

export const findUserByEmail = async (email: string) => {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  });
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
export const createUser = async (data: RegisterInput) => {
  const [user] = await db
    .insert(users)
    .values({
      roleId: data.roleId,
      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile,
      password: data.password,
    })
    .returning();

  return user;
};