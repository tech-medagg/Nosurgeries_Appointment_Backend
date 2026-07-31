import { and, asc, desc, eq, sql } from "drizzle-orm";

import { db } from "../../db";
import { users } from "../../db/schema/users";
import { roles } from "../../db/schema/roles";
import { GetUsersParams } from "./user.types";

export const getAllUsers = async (params: GetUsersParams) => {
  const {
    page,
    limit,
    search,
    role,
    status,
    order,
  } = params;

  const offset = (page - 1) * limit;

  const conditions = [];

  if (search) {
    conditions.push(
      sql`(
        ${users.fullName} ILIKE ${"%" + search + "%"}
        OR ${users.email} ILIKE ${"%" + search + "%"}
        OR ${users.mobile} ILIKE ${"%" + search + "%"}
      )`
    );
  }

  if (role) {
    conditions.push(eq(roles.name, role));
  }

  if (status) {
    conditions.push(eq(users.status, status as any));
  }

  const whereCondition =
    conditions.length > 0
      ? and(...conditions)
      : undefined;

  const data = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      mobile: users.mobile,
      status: users.status,
      roleId: users.roleId,
      roleName: roles.name,
      createdAt: users.createdAt,
    })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))
    .where(whereCondition)
    .orderBy(
      order === "asc"
        ? asc(users.createdAt)
        : desc(users.createdAt)
    )
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))
    .where(whereCondition);

  const count = Number(countResult[0]?.count ?? 0);

  return {
    users: data,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
};

export const getUserById = async (id: string) => {
  const result = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      mobile: users.mobile,
      status: users.status,
      roleId: users.roleId,
      roleName: roles.name,
      createdAt: users.createdAt,
    })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))
    .where(eq(users.id, id));

  return result[0] ?? null;
};