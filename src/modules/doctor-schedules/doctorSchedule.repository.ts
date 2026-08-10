import {
  eq,
  and,
  asc,
  desc,
  sql,
  SQL,
} from "drizzle-orm";

import { db } from "../../db";

import { doctorSchedules } from "../../db/schema/doctor_schedules";
import { doctorProfiles } from "../../db/schema/doctor_profiles";

import {
  CreateDoctorScheduleInput,
  UpdateDoctorScheduleInput,
  GetDoctorSchedulesQuery,
} from "./doctorSchedule.validation";

/* ======================================================
   Find By Id
====================================================== */

export const findById = async (id: string) => {
  const result = await db
    .select()
    .from(doctorSchedules)
    .where(eq(doctorSchedules.id, id))
    .limit(1);

  return result[0] ?? null;
};

/* ======================================================
   Find By Doctor
====================================================== */

export const findByDoctorId = async (
  doctorProfileId: string
) => {
  return db
    .select()
    .from(doctorSchedules)
    .where(
      eq(
        doctorSchedules.doctorProfileId,
        doctorProfileId
      )
    );
};

/* ======================================================
   Create
====================================================== */

export const create = async (
  data: CreateDoctorScheduleInput
) => {
  const [schedule] = await db
    .insert(doctorSchedules)
    .values({
      doctorProfileId:
        data.doctorProfileId,

      dayOfWeek: data.dayOfWeek,

      startTime: data.startTime,

      endTime: data.endTime,

      slotDuration:
        data.slotDuration,

      maxPatients:
        data.maxPatients,

      isAvailable:
        data.isAvailable,
    })
    .returning();

  return schedule ?? null;
};

/* ======================================================
   Update
====================================================== */

export const update = async (
  id: string,
  data: UpdateDoctorScheduleInput
) => {
  const payload: any = {
    updatedAt: new Date(),
  };

  if (
    data.doctorProfileId !== undefined
  )
    payload.doctorProfileId =
      data.doctorProfileId;

  if (data.dayOfWeek !== undefined)
    payload.dayOfWeek =
      data.dayOfWeek;

  if (data.startTime !== undefined)
    payload.startTime =
      data.startTime;

  if (data.endTime !== undefined)
    payload.endTime =
      data.endTime;

  if (
    data.slotDuration !== undefined
  )
    payload.slotDuration =
      data.slotDuration;

  if (
    data.maxPatients !== undefined
  )
    payload.maxPatients =
      data.maxPatients;

  if (
    data.isAvailable !== undefined
  )
    payload.isAvailable =
      data.isAvailable;

  const [schedule] = await db
    .update(doctorSchedules)
    .set(payload)
    .where(eq(doctorSchedules.id, id))
    .returning();

  return schedule ?? null;
};

/* ======================================================
   Delete
====================================================== */

export const remove = async (
  id: string
) => {
  await db
    .delete(doctorSchedules)
    .where(eq(doctorSchedules.id, id));

  return true;
};

/* ======================================================
   Get All Doctor Schedules
====================================================== */

export const getAll = async (
  params: GetDoctorSchedulesQuery
) => {
  const {
    page,
    limit,
    doctorProfileId,
    dayOfWeek,
    isAvailable,
    order,
  } = params;

  const offset = (page - 1) * limit;

  const conditions: SQL[] = [];

  if (doctorProfileId) {
    conditions.push(
      eq(
        doctorSchedules.doctorProfileId,
        doctorProfileId
      )
    );
  }

  if (dayOfWeek) {
    conditions.push(
      eq(
        doctorSchedules.dayOfWeek,
        dayOfWeek
      )
    );
  }

  if (isAvailable !== undefined) {
    conditions.push(
      eq(
        doctorSchedules.isAvailable,
        isAvailable
      )
    );
  }

  const whereClause =
    conditions.length
      ? and(...conditions)
      : undefined;

  const schedules = await db
    .select({
      id: doctorSchedules.id,

      doctorProfileId:
        doctorSchedules.doctorProfileId,

      dayOfWeek:
        doctorSchedules.dayOfWeek,

      startTime:
        doctorSchedules.startTime,

      endTime:
        doctorSchedules.endTime,

      slotDuration:
        doctorSchedules.slotDuration,

      maxPatients:
        doctorSchedules.maxPatients,

      isAvailable:
        doctorSchedules.isAvailable,

      createdAt:
        doctorSchedules.createdAt,

      updatedAt:
        doctorSchedules.updatedAt,

      doctorName:
        doctorProfiles.firstName,
    })
    .from(doctorSchedules)
    .innerJoin(
      doctorProfiles,
      eq(
        doctorSchedules.doctorProfileId,
        doctorProfiles.id
      )
    )
    .where(whereClause)
    .orderBy(
      order === "asc"
        ? asc(
            doctorSchedules.dayOfWeek
          )
        : desc(
            doctorSchedules.dayOfWeek
          )
    )
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(doctorSchedules)
    .where(whereClause);

  const total = Number(
    countResult[0]?.count ?? 0
  );

  return {
    schedules,
    total,
    page,
    limit,
    totalPages: Math.ceil(
      total / limit
    ),
  };
};