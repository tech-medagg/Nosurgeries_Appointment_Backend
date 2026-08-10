import {
  and,
  asc,
  desc,
  eq,
  ilike,
  sql,
  SQL,
} from "drizzle-orm";

import { db } from "../../db";
import { departments } from "../../db/schema/departments";

import {
  CreateDepartmentInput,
  UpdateDepartmentInput,
  GetDepartmentsQuery,
} from "./department.validation";

/* ==========================================================
   Find By Id
========================================================== */

export const findById = async (id: string) => {
  const result = await db
    .select()
    .from(departments)
    .where(eq(departments.id, id))
    .limit(1);

  return result[0] ?? null;
};

/* ==========================================================
   Find By Name
========================================================== */

export const findByName = async (name: string) => {
  const result = await db
    .select()
    .from(departments)
    .where(eq(departments.name, name))
    .limit(1);

  return result[0] ?? null;
};

/* ==========================================================
   Find By Slug
========================================================== */

export const findBySlug = async (slug: string) => {
  const result = await db
    .select()
    .from(departments)
    .where(eq(departments.slug, slug))
    .limit(1);

  return result[0] ?? null;
};

/* ==========================================================
   Create
========================================================== */

export const create = async (
  data: CreateDepartmentInput
) => {
  const [department] = await db
    .insert(departments)
    .values({
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      icon: data.icon ?? null,
      displayOrder: data.displayOrder ?? null,
      isActive: data.isActive,
      metaTitle: data.metaTitle ?? null,
      metaDescription:
        data.metaDescription ?? null,
    })
    .returning();

  return department ?? null;
};

/* ==========================================================
   Update
========================================================== */

export const update = async (
  id: string,
  data: UpdateDepartmentInput
) => {
  const [department] = await db
    .update(departments)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(departments.id, id))
    .returning();

  return department ?? null;
};

/* ==========================================================
   Delete
========================================================== */

export const remove = async (
  id: string
) => {
  await db
    .delete(departments)
    .where(eq(departments.id, id));

  return true;
};

/* ==========================================================
   Get All
========================================================== */

export const getAll = async (
  params: GetDepartmentsQuery
) => {
  const {
    page,
    limit,
    search,
    isActive,
    sortBy,
    order,
  } = params;

  const offset = (page - 1) * limit;

  const conditions: SQL[] = [];

  if (search) {
    conditions.push(
      ilike(
        departments.name,
        `%${search}%`
      )
    );
  }

  if (isActive) {
    conditions.push(
      eq(
        departments.isActive,
        isActive
      )
    );
  }

  const whereCondition =
    conditions.length > 0
      ? and(...conditions)
      : undefined;

  const orderColumn =
    sortBy === "name"
      ? departments.name
      : sortBy === "displayOrder"
      ? departments.displayOrder
      : departments.createdAt;

  const data = await db
    .select()
    .from(departments)
    .where(whereCondition)
    .orderBy(
      order === "asc"
        ? asc(orderColumn)
        : desc(orderColumn)
    )
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(departments)
    .where(whereCondition);

  const total = Number(
    countResult[0]?.count ?? 0
  );

  return {
    departments: data,
    total,
    page,
    limit,
    totalPages:
      Math.ceil(total / limit),
  };
};