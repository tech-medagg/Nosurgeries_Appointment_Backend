import {
  eq,
  and,
} from "drizzle-orm";

import { db } from "../../db";

import { doctorProfiles } from "../../db/schema/doctor_profiles";
import { users } from "../../db/schema/users";
import { hospitals } from "../../db/schema/hospitals";
import { departments } from "../../db/schema/departments";

import {
  CreateDoctorInput,
  UpdateDoctorInput,
} from "./doctor.validation";

import {
  SQL,
  asc,
  desc,
  ilike,
  sql,
} from "drizzle-orm";

import { GetDoctorsQuery } from "./doctor.validation";

/* ======================================================
   Find Doctor By Id
====================================================== */

export const findById = async (id: string) => {
  const result = await db
    .select()
    .from(doctorProfiles)
    .where(eq(doctorProfiles.id, id))
    .limit(1);

  return result[0] ?? null;
};

/* ======================================================
   Find Doctor By User Id
====================================================== */

export const findByUserId = async (userId: string) => {
  try {
    const result = await db
      .select()
      .from(doctorProfiles)
      .where(eq(doctorProfiles.userId, userId))
      .limit(1);

    return result[0] ?? null;
  } catch (error) {
    console.error("findByUserId error:", error);
    throw error;
  }
};

/* ======================================================
   Find Registration Number
====================================================== */

export const findByRegistrationNumber =
  async (
    registrationNumber: string
  ) => {
    const result = await db
      .select()
      .from(doctorProfiles)
      .where(
        eq(
          doctorProfiles.registrationNumber,
          registrationNumber
        )
      )
      .limit(1);

    return result[0] ?? null;
  };

/* ======================================================
   Create Doctor
====================================================== */

export const create = async (
  data: CreateDoctorInput
) => {
  const [doctor] = await db
    .insert(doctorProfiles)
    .values({
      userId: data.userId,

      hospitalId: data.hospitalId,

      departmentId: data.departmentId,

      firstName: data.firstName,

      lastName: data.lastName,

      gender: data.gender,

      dateOfBirth: data.dateOfBirth
        ? new Date(data.dateOfBirth)
        : null,

      profileImage:
        data.profileImage ?? null,

      qualification:
        data.qualification,

      specialization:
        data.specialization,

      registrationNumber:
        data.registrationNumber,

      experienceYears:
        data.experienceYears,

      consultationFee:
        data.consultationFee ?? null,

      biography:
        data.biography ?? null,

      languages:
        data.languages ?? null,

      isAvailable:
        data.isAvailable,
    })
    .returning();

  return doctor ?? null;
};

/* ======================================================
   Update Doctor
====================================================== */

export const update = async (
  id: string,
  data: UpdateDoctorInput
) => {
  const payload: any = {
    updatedAt: new Date(),
  };

  if (data.hospitalId !== undefined)
    payload.hospitalId = data.hospitalId;

  if (data.departmentId !== undefined)
    payload.departmentId =
      data.departmentId;

  if (data.firstName !== undefined)
    payload.firstName =
      data.firstName;

  if (data.lastName !== undefined)
    payload.lastName =
      data.lastName;

  if (data.gender !== undefined)
    payload.gender = data.gender;

  if (data.dateOfBirth !== undefined)
    payload.dateOfBirth =
      data.dateOfBirth
        ? new Date(data.dateOfBirth)
        : null;

  if (data.profileImage !== undefined)
    payload.profileImage =
      data.profileImage;

  if (
    data.qualification !== undefined
  )
    payload.qualification =
      data.qualification;

  if (
    data.specialization !== undefined
  )
    payload.specialization =
      data.specialization;

  if (
    data.registrationNumber !==
    undefined
  )
    payload.registrationNumber =
      data.registrationNumber;

  if (
    data.experienceYears !== undefined
  )
    payload.experienceYears =
      data.experienceYears;

  if (
    data.consultationFee !== undefined
  )
    payload.consultationFee =
      data.consultationFee;

  if (data.languages !== undefined)
    payload.languages =
      data.languages;

  if (data.biography !== undefined)
    payload.biography =
      data.biography;

  if (
    data.isAvailable !== undefined
  )
    payload.isAvailable =
      data.isAvailable;

  const [doctor] = await db
    .update(doctorProfiles)
    .set(payload)
    .where(eq(doctorProfiles.id, id))
    .returning();

  return doctor ?? null;
};

/* ======================================================
   Delete Doctor
====================================================== */

export const remove = async (
  id: string
) => {
  await db
    .delete(doctorProfiles)
    .where(eq(doctorProfiles.id, id));

  return true;
};

/* ======================================================
   Get All Doctors
====================================================== */

export const getAll = async (
  params: GetDoctorsQuery
) => {
  const {
    page,
    limit,
    search,
    hospitalId,
    departmentId,
    status,
    sortBy,
    order,
  } = params;

  const offset = (page - 1) * limit;

  const conditions: SQL[] = [];

  /* ==========================
      Search
  ========================== */

  if (search) {
    conditions.push(
      ilike(
        doctorProfiles.firstName,
        `%${search}%`
      )
    );
  }

  /* ==========================
      Hospital
  ========================== */

  if (hospitalId) {
    conditions.push(
      eq(
        doctorProfiles.hospitalId,
        hospitalId
      )
    );
  }

  /* ==========================
      Department
  ========================== */

  if (departmentId) {
    conditions.push(
      eq(
        doctorProfiles.departmentId,
        departmentId
      )
    );
  }

  /* ==========================
      Status
  ========================== */

  if (status) {
    conditions.push(
      eq(users.status, status)
    );
  }

  const whereClause =
    conditions.length > 0
      ? and(...conditions)
      : undefined;

  /* ==========================
      Sorting
  ========================== */

  const orderColumn =
    sortBy === "experienceYears"
      ? doctorProfiles.experienceYears
      : sortBy === "consultationFee"
      ? doctorProfiles.consultationFee
      : doctorProfiles.createdAt;

  /* ==========================
      Data
  ========================== */

  const doctors = await db
    .select({
      id: doctorProfiles.id,

      userId: doctorProfiles.userId,

      hospitalId:
        doctorProfiles.hospitalId,

      departmentId:
        doctorProfiles.departmentId,

      firstName:
        doctorProfiles.firstName,

      lastName:
        doctorProfiles.lastName,

      qualification:
        doctorProfiles.qualification,

      specialization:
        doctorProfiles.specialization,

      registrationNumber:
        doctorProfiles.registrationNumber,

      experienceYears:
        doctorProfiles.experienceYears,

      consultationFee:
        doctorProfiles.consultationFee,

      biography:
        doctorProfiles.biography,

      languages:
        doctorProfiles.languages,

      profileImage:
        doctorProfiles.profileImage,

      isAvailable:
        doctorProfiles.isAvailable,

      createdAt:
        doctorProfiles.createdAt,

      updatedAt:
        doctorProfiles.updatedAt,

      fullName: users.fullName,

      email: users.email,

      mobile: users.mobile,

      hospitalName:
        hospitals.name,

      departmentName:
        departments.name,
    })
    .from(doctorProfiles)
    .innerJoin(
      users,
      eq(
        doctorProfiles.userId,
        users.id
      )
    )
    .innerJoin(
      hospitals,
      eq(
        doctorProfiles.hospitalId,
        hospitals.id
      )
    )
    .innerJoin(
      departments,
      eq(
        doctorProfiles.departmentId,
        departments.id
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

  /* ==========================
      Count
  ========================== */

  const countResult = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(doctorProfiles)
    .innerJoin(
      users,
      eq(
        doctorProfiles.userId,
        users.id
      )
    )
    .where(whereClause);

  const total = Number(
    countResult[0]?.count ?? 0
  );

  return {
    doctors,
    total,
    page,
    limit,
    totalPages:
      Math.ceil(total / limit),
  };
};