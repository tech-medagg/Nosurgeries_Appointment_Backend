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
import { hospitals } from "../../db/schema/hospitals";

import {
  CreateHospitalInput,
  UpdateHospitalInput,
  GetHospitalsQuery,
} from "./hospital.validation";

/* ==========================================================
   Find By Id
========================================================== */

export const findById = async (
  id: string
) => {
  const result = await db
    .select()
    .from(hospitals)
    .where(eq(hospitals.id, id))
    .limit(1);

  return result[0] ?? null;
};

/* ==========================================================
   Find By Name
========================================================== */

export const findByName = async (
  name: string
) => {
  const result = await db
    .select()
    .from(hospitals)
    .where(eq(hospitals.name, name))
    .limit(1);

  return result[0] ?? null;
};

/* ==========================================================
   Find By Email
========================================================== */

export const findByEmail = async (
  email: string
) => {
  const result = await db
    .select()
    .from(hospitals)
    .where(eq(hospitals.email, email))
    .limit(1);

  return result[0] ?? null;
};

/* ==========================================================
   Create
========================================================== */

export const create = async (
  data: CreateHospitalInput
) => {
  const [hospital] = await db
    .insert(hospitals)
    .values({
      name: data.name,
      email: data.email ?? null,
      phone: data.phone ?? null,
      address: data.address ?? null,
      city: data.city ?? null,
      state: data.state ?? null,
      pincode: data.pincode ?? null,
      isActive: data.isActive ?? true,
    })
    .returning();

  return hospital ?? null;
};

/* ==========================================================
   Update
========================================================== */

export const update = async (
  id: string,
  data: UpdateHospitalInput
) => {
  const [hospital] = await db
    .update(hospitals)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(hospitals.id, id))
    .returning();

  return hospital ?? null;
};

/* ==========================================================
   Delete
========================================================== */

export const remove = async (
  id: string
) => {
  await db
    .delete(hospitals)
    .where(eq(hospitals.id, id));

  return true;
};

/* ==========================================================
   Get All
========================================================== */

export const getAll = async (
  params: GetHospitalsQuery
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
      ilike(hospitals.name, `%${search}%`)
    );
  }

  if (typeof isActive === "boolean") {
    conditions.push(
      eq(hospitals.isActive, isActive)
    );
  }

  const whereCondition =
    conditions.length
      ? and(...conditions)
      : undefined;

  const orderColumn =
    sortBy === "name"
      ? hospitals.name
      : sortBy === "city"
      ? hospitals.city
      : hospitals.createdAt;

  const data = await db
    .select()
    .from(hospitals)
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
    .from(hospitals)
    .where(whereCondition);

  const total = Number(
    countResult[0]?.count ?? 0
  );

  return {
    hospitals: data,
    total,
    page,
    limit,
    totalPages: Math.ceil(
      total / limit
    ),
  };
};