import * as doctorScheduleRepository from "./doctorSchedule.repository";
import * as doctorRepository from "../doctors/doctor.repository";

import {
  CreateDoctorScheduleInput,
  UpdateDoctorScheduleInput,
  GetDoctorSchedulesQuery,
} from "./doctorSchedule.validation";

import { db } from "../../db";
import { appointments } from "../../db/schema/appointments";
import { eq, and, sql } from "drizzle-orm";

/* ======================================================
   Create Schedule
====================================================== */

export const createDoctorSchedule = async (
  data: CreateDoctorScheduleInput
) => {
  // Check Doctor Exists
  const doctor = await doctorRepository.findById(
    data.doctorProfileId
  );

  if (!doctor) {
    return {
      success: false,
      message: "Doctor not found.",
    };
  }

  // Check Existing Schedule for this Day
  const existing =
    await doctorScheduleRepository.findByDoctorId(
      data.doctorProfileId
    );

  const existingForDay = existing.find(
    (schedule) => schedule.dayOfWeek === data.dayOfWeek
  );

  if (existingForDay) {
    const updated = await doctorScheduleRepository.update(
      existingForDay.id,
      data
    );

    return {
      success: true,
      message: "Doctor schedule updated successfully.",
      data: updated,
    };
  }

  const schedule =
    await doctorScheduleRepository.create(data);

  return {
    success: true,
    message:
      "Doctor schedule created successfully.",
    data: schedule,
  };
};

/* ======================================================
   Get All
====================================================== */

export const getDoctorSchedules = async (
  query: GetDoctorSchedulesQuery
) => {
  const result =
    await doctorScheduleRepository.getAll(query);

  return {
    success: true,
    data: result.schedules,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    },
  };
};

/* ======================================================
   Get By Id
====================================================== */

export const getDoctorScheduleById = async (
  id: string
) => {
  const schedule =
    await doctorScheduleRepository.findById(id);

  if (!schedule) {
    return {
      success: false,
      message: "Schedule not found.",
    };
  }

  return {
    success: true,
    data: schedule,
  };
};

/* ======================================================
   Update
====================================================== */

export const updateDoctorSchedule = async (
  id: string,
  data: UpdateDoctorScheduleInput
) => {
  const schedule =
    await doctorScheduleRepository.findById(id);

  if (!schedule) {
    return {
      success: false,
      message: "Schedule not found.",
    };
  }

  const updated =
    await doctorScheduleRepository.update(
      id,
      data
    );

  return {
    success: true,
    message:
      "Doctor schedule updated successfully.",
    data: updated,
  };
};

/* ======================================================
   Delete
====================================================== */

export const deleteDoctorSchedule = async (
  id: string
) => {
  const schedule =
    await doctorScheduleRepository.findById(id);

  if (!schedule) {
    return {
      success: false,
      message: "Schedule not found.",
    };
  }

  /* -----------------------------------------------
     Hard-delete all future active appointments for
     this doctor on the deleted schedule's day.

     We use SQL EXTRACT(DOW ...) to match the day
     of week. Hard-deleting means the appointments
     disappear entirely from the patient dashboard
     rather than showing as CANCELLED entries.
  ----------------------------------------------- */
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dowMap: Record<string, number> = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
  };
  const targetDow = dowMap[schedule.dayOfWeek];

  if (targetDow !== undefined) {
    await db
      .delete(appointments)
      .where(
        and(
          eq(appointments.doctorProfileId, schedule.doctorProfileId),
          sql`${appointments.appointmentDate} >= ${today}`,
          sql`EXTRACT(DOW FROM ${appointments.appointmentDate}) = ${targetDow}`,
          sql`${appointments.status} IN ('PENDING', 'CONFIRMED', 'RESCHEDULED', 'CHECKED_IN')`
        )
      );
  }

  await doctorScheduleRepository.remove(id);

  return {
    success: true,
    message: "Doctor schedule deleted successfully. All related appointments have been removed.",
  };
};