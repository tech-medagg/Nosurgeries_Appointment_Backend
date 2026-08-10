import {
  eq,
  and,
} from "drizzle-orm";

import bcrypt from "bcrypt";

import { db } from "../../db";

import { users } from "../../db/schema/users";
import { roles } from "../../db/schema/roles";
import { patientProfiles } from "../../db/schema/patient-profiles";
import {
  asc,
  desc,
  ilike,
  sql,
  SQL,
} from "drizzle-orm";

import { GetPatientsQuery } from "./patient.validation";

import {
  CreatePatientInput,
  UpdatePatientInput,
} from "./patient.validation";

/* ======================================================
   Find Patient Role
====================================================== */

export const findPatientRole = async () => {
  const result = await db
    .select()
    .from(roles)
    .where(eq(roles.name, "PATIENT"))
    .limit(1);

  return result[0] ?? null;
};

/* ======================================================
   Find By Email
====================================================== */

export const findByEmail = async (
  email: string
) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return result[0] ?? null;
};

/* ======================================================
   Find By Mobile
====================================================== */

export const findByMobile = async (
  mobile: string
) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.mobile, mobile))
    .limit(1);

  return result[0] ?? null;
};

/* ======================================================
   Find Patient By Id
====================================================== */

export const findById = async (
  id: string
) => {
  const result = await db
    .select()
    .from(patientProfiles)
    .where(eq(patientProfiles.id, id))
    .limit(1);

  return result[0] ?? null;
};

/* ======================================================
   Find By User Id
====================================================== */

export const findByUserId = async (
  userId: string
) => {
  const result = await db
    .select()
    .from(patientProfiles)
    .where(
      eq(patientProfiles.userId, userId)
    )
    .limit(1);

  return result[0] ?? null;
};

/* ======================================================
   Create Patient
====================================================== */

export const create = async (
  data: CreatePatientInput
) => {
  return await db.transaction(
    async (tx) => {
      const roleResult = await tx
  .select()
  .from(roles)
  .where(eq(roles.name, "PATIENT"))
  .limit(1);

const role = roleResult[0];

if (!role) {
  throw new Error("PATIENT role not found.");
}

      const hashedPassword =
        await bcrypt.hash(
          data.password,
          10
        );

const userResult = await tx
  .insert(users)
  .values({
    roleId: role.id,
    fullName: data.fullName,
    email: data.email,
    mobile: data.mobile,
    password: hashedPassword,
  })
  .returning();

const user = userResult[0];

if (!user) {
  throw new Error("Failed to create user.");
}

     const patientResult = await tx
  .insert(patientProfiles)
  .values({
    userId: user.id,

    firstName: data.firstName,
    lastName: data.lastName,
    gender: data.gender,
    dateOfBirth: data.dateOfBirth,
    bloodGroup: data.bloodGroup,
    language: data.language,
    profileImage: data.profileImage,
    address: data.address,
    city: data.city,
    state: data.state,
    country: data.country,
    pincode: data.pincode,
    emergencyContact: data.emergencyContact,
    emergencyContactName: data.emergencyContactName,
    medicalHistory: data.medicalHistory,
    allergies: data.allergies,
  })
  .returning();

const patient = patientResult[0];

if (!patient) {
  throw new Error("Failed to create patient profile.");
}
      return {
        user,
        patient,
      };
    }
  );
};

/* ======================================================
   Update Patient
====================================================== */

export const update = async (
  id: string,
  data: UpdatePatientInput
) => {
  return await db.transaction(
    async (tx) => {
      const patientResult = await tx
  .select()
  .from(patientProfiles)
  .where(eq(patientProfiles.id, id))
  .limit(1);

const patient = patientResult[0];

if (!patient) {
  return null;
}

      if (
        data.fullName ||
        data.email ||
        data.mobile
      ) {
        await tx
          .update(users)
          .set({
            ...(data.fullName && {
              fullName: data.fullName,
            }),

            ...(data.email && {
              email: data.email,
            }),

            ...(data.mobile && {
              mobile: data.mobile,
            }),

            updatedAt: new Date(),
          })
      .where(
  eq(
    users.id,
    patient.userId
  )
);
      }

      const [updatedPatient] =
        await tx
          .update(patientProfiles)
          .set({
            ...data,

            updatedAt: new Date(),
          })
          .where(
            eq(
              patientProfiles.id,
              id
            )
          )
          .returning();

      return updatedPatient;
    }
  );
};

/* ======================================================
   Delete Patient
====================================================== */

export const remove = async (
  id: string
) => {
  const patient = await findById(id);

  if (!patient) {
    return false;
  }

  await db
    .delete(users)
    .where(eq(users.id, patient.userId));

  return true;
};

/* ======================================================
   Get All Patients
====================================================== */

export const getAll = async (
  params: GetPatientsQuery
) => {
  const {
    page,
    limit,
    search,
    gender,
    sortBy,
    order,
  } = params;

  const offset =
    (page - 1) * limit;

  const conditions: SQL[] = [];

  if (search) {
    conditions.push(
      ilike(
        users.fullName,
        `%${search}%`
      )
    );
  }

  if (gender) {
    conditions.push(
      eq(
        patientProfiles.gender,
        gender
      )
    );
  }

  const whereClause =
    conditions.length
      ? and(...conditions)
      : undefined;

  const orderColumn =
    sortBy === "fullName"
      ? users.fullName
      : sortBy === "email"
      ? users.email
      : patientProfiles.createdAt;

  const patients =
    await db
      .select({
        id: patientProfiles.id,

        userId:
          patientProfiles.userId,

        fullName:
          users.fullName,

        email:
          users.email,

        mobile:
          users.mobile,

        firstName:
          patientProfiles.firstName,

        lastName:
          patientProfiles.lastName,

        gender:
          patientProfiles.gender,

        dateOfBirth:
          patientProfiles.dateOfBirth,

        bloodGroup:
          patientProfiles.bloodGroup,

        language:
          patientProfiles.language,

        profileImage:
          patientProfiles.profileImage,

        address:
          patientProfiles.address,

        city:
          patientProfiles.city,

        state:
          patientProfiles.state,

        country:
          patientProfiles.country,

        pincode:
          patientProfiles.pincode,

        emergencyContact:
          patientProfiles.emergencyContact,

        emergencyContactName:
          patientProfiles.emergencyContactName,

        medicalHistory:
          patientProfiles.medicalHistory,

        allergies:
          patientProfiles.allergies,

        createdAt:
          patientProfiles.createdAt,

        updatedAt:
          patientProfiles.updatedAt,
      })
      .from(patientProfiles)
      .innerJoin(
        users,
        eq(
          patientProfiles.userId,
          users.id
        )
      )
      .where(whereClause)
      .orderBy(
        order === "asc"
          ? asc(orderColumn)
          : desc(orderColumn)
      )
      .limit(limit)
      .offset(offset);

  const totalResult =
    await db
      .select({
        count:
          sql<number>`count(*)`,
      })
      .from(patientProfiles)
      .innerJoin(
        users,
        eq(
          patientProfiles.userId,
          users.id
        )
      )
      .where(whereClause);

  const total = Number(
    totalResult[0]?.count ?? 0
  );

  return {
    patients,
    total,
    page,
    limit,
    totalPages:
      Math.ceil(
        total / limit
      ),
  };
};