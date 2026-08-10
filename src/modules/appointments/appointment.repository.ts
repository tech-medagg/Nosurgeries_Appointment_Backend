import { db } from "../../db";

import {
  eq,
  and,
  asc,
  desc,
  sql,
  SQL,
} from "drizzle-orm";

import {
  GetAppointmentsQuery,
} from "./appointment.validation";
import { doctorSchedules } from "../../db/schema/doctor_schedules";
import { appointments } from "../../db/schema/appointments";
import { users } from "../../db/schema/users";
import { hospitals } from "../../db/schema/hospitals";
import { departments } from "../../db/schema/departments";
import { doctorProfiles } from "../../db/schema/doctor_profiles";
import {
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "./appointment.validation";

/* ======================================================
   Find Appointment By Id
====================================================== */

export const findById = async (
  id: string
) => {
  const result = await db
    .select()
    .from(appointments)
    .where(eq(appointments.id, id))
    .limit(1);

  return result[0] ?? null;
};

/* ======================================================
   Check Patient
====================================================== */

export const patientExists = async (
  patientId: string
) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, patientId))
    .limit(1);

  return result[0] ?? null;
};

/* ======================================================
   Check Hospital
====================================================== */

export const hospitalExists = async (
  hospitalId: string
) => {
  const result = await db
    .select()
    .from(hospitals)
    .where(eq(hospitals.id, hospitalId))
    .limit(1);

  return result[0] ?? null;
};

/* ======================================================
   Get Doctor Schedule For Day
====================================================== */

export const getDoctorSchedule = async (
  doctorProfileId: string,
  dayOfWeek: string
) => {
  const result = await db
    .select()
    .from(doctorSchedules)
    .where(
      and(
        eq(
          doctorSchedules.doctorProfileId,
          doctorProfileId
        ),
        eq(
          doctorSchedules.dayOfWeek,
          dayOfWeek
        ),
        eq(
          doctorSchedules.isAvailable,
          true
        )
      )
    )
    .limit(1);

  return result[0] ?? null;
};

/* ======================================================
   Count Doctor Appointments
====================================================== */

export const countDoctorAppointments = async (
  doctorProfileId: string,
  appointmentDate: Date
) => {
  const result = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(appointments)
    .where(
      and(
        eq(
          appointments.doctorProfileId,
          doctorProfileId
        ),
        eq(
          appointments.appointmentDate,
          appointmentDate
        ),
        sql`${appointments.status} IN (
          'PENDING',
          'CONFIRMED',
          'CHECKED_IN'
        )`
      )
    );

  return Number(
    result[0]?.count ?? 0
  );
};

/* ======================================================
   Check Department
====================================================== */

export const departmentExists = async (
  departmentId: string
) => {
  const result = await db
    .select()
    .from(departments)
    .where(eq(departments.id, departmentId))
    .limit(1);

  return result[0] ?? null;
};

/* ======================================================
   Check Doctor
====================================================== */

export const doctorExists = async (
  doctorProfileId: string
) => {
  const result = await db
    .select()
    .from(doctorProfiles)
    .where(
      eq(
        doctorProfiles.id,
        doctorProfileId
      )
    )
    .limit(1);

  return result[0] ?? null;
};

/* ======================================================
   Create Appointment
====================================================== */

export const create = async (
  data: CreateAppointmentInput
) => {
  const [appointment] =
    await db
      .insert(appointments)
      .values({
        patientId: data.patientId,
        hospitalId: data.hospitalId,
        departmentId:
          data.departmentId,
        doctorProfileId:
          data.doctorProfileId,
        appointmentDate: new Date(
          data.appointmentDate
        ),
        appointmentTime:
          data.appointmentTime,
        consultationType:
          data.consultationType,
        symptoms: data.symptoms,
        notes: data.notes,
      })
      .returning();

  return appointment;
};

/* ======================================================
   Get Available Doctors
====================================================== */

export const getAvailableDoctors = async (
  hospitalId: string,
  departmentId: string,
  appointmentDate: Date
) => {
  const dayOfWeek = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ][appointmentDate.getDay()];

  const doctors = await db
    .select({
      doctorProfileId:
        doctorProfiles.id,

      firstName:
        doctorProfiles.firstName,

      lastName:
        doctorProfiles.lastName,

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
    })
    .from(doctorProfiles)
    .innerJoin(
      doctorSchedules,
      eq(
        doctorProfiles.id,
        doctorSchedules.doctorProfileId
      )
    )
    .where(
      and(
        eq(
          doctorProfiles.hospitalId,
          hospitalId
        ),

        eq(
          doctorProfiles.departmentId,
          departmentId
        ),

        eq(
          doctorSchedules.dayOfWeek,
          dayOfWeek ?? "SUNDAY"
        ),

        eq(
          doctorSchedules.isAvailable,
          true
        ),

        eq(
          doctorProfiles.isAvailable,
          true
        )
      )
    );

  return doctors;
};

/* ======================================================
   Update Appointment
====================================================== */

export const update = async (
  id: string,
  data: UpdateAppointmentInput
) => {
  const [appointment] = await db
    .update(appointments)
.set({
  patientId: data.patientId,

  hospitalId: data.hospitalId,

  departmentId: data.departmentId,

  doctorProfileId:
    data.doctorProfileId,

  appointmentDate:
    data.appointmentDate
      ? new Date(
          data.appointmentDate
        )
      : undefined,

  appointmentTime:
    data.appointmentTime,

  consultationType:
    data.consultationType,

  symptoms: data.symptoms,

  notes: data.notes,

  tokenNumber:
    data.tokenNumber,

  status: data.status,

  updatedAt: new Date(),
})
    .where(eq(appointments.id, id))
    .returning();

  return appointment ?? null;
};

/* ======================================================
   Delete Appointment
====================================================== */

export const remove = async (
  id: string
) => {
  const result = await db
    .delete(appointments)
    .where(eq(appointments.id, id))
    .returning();

  return result.length > 0;
};

/* ======================================================
   Get All Appointments
====================================================== */

export const getAll = async (
  query: GetAppointmentsQuery
) => {
  const {
    page,
    limit,
    patientId,
    doctorProfileId,
    hospitalId,
    departmentId,
    status,
    order,
  } = query;

  const offset = (page - 1) * limit;

  const conditions: SQL[] = [];

  if (patientId) {
    conditions.push(
      eq(appointments.patientId, patientId)
    );
  }

  if (doctorProfileId) {
    conditions.push(
      eq(
        appointments.doctorProfileId,
        doctorProfileId
      )
    );
  }

  if (hospitalId) {
    conditions.push(
      eq(
        appointments.hospitalId,
        hospitalId
      )
    );
  }

  if (departmentId) {
    conditions.push(
      eq(
        appointments.departmentId,
        departmentId
      )
    );
  }

  if (status) {
    conditions.push(
      eq(appointments.status, status)
    );
  }

  const whereClause =
    conditions.length
      ? and(...conditions)
      : undefined;

  const result = await db
    .select({
      id: appointments.id,

      patientId:
        appointments.patientId,

      hospitalId:
        appointments.hospitalId,

      departmentId:
        appointments.departmentId,

      doctorProfileId:
        appointments.doctorProfileId,

      appointmentDate:
        appointments.appointmentDate,

      appointmentTime:
        appointments.appointmentTime,

      consultationType:
        appointments.consultationType,

      symptoms:
        appointments.symptoms,

      notes:
        appointments.notes,

      tokenNumber:
        appointments.tokenNumber,

      status:
        appointments.status,

      createdAt:
        appointments.createdAt,

      updatedAt:
        appointments.updatedAt,

      patientName:
        users.fullName,

      hospitalName:
        hospitals.name,

      departmentName:
        departments.name,

      doctorName:
        doctorProfiles.firstName,
    })
    .from(appointments)
    .innerJoin(
      users,
      eq(
        appointments.patientId,
        users.id
      )
    )
    .innerJoin(
      hospitals,
      eq(
        appointments.hospitalId,
        hospitals.id
      )
    )
    .innerJoin(
      departments,
      eq(
        appointments.departmentId,
        departments.id
      )
    )
    .leftJoin(
      doctorProfiles,
      eq(
        appointments.doctorProfileId,
        doctorProfiles.id
      )
    )
    .where(whereClause)
    .orderBy(
      order === "asc"
        ? asc(
            appointments.createdAt
          )
        : desc(
            appointments.createdAt
          )
    )
    .limit(limit)
    .offset(offset);

  const totalResult = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(appointments)
    .where(whereClause);

  return {
    appointments: result,

    total: Number(
      totalResult[0]?.count ?? 0
    ),

    page,

    limit,

    totalPages: Math.ceil(
      Number(totalResult[0]?.count ?? 0) /
        limit
    ),
  };
};

/* ======================================================
   Get Doctor Booked Slots
====================================================== */

export const getDoctorBookedSlots = async (
  doctorProfileId: string,
  startOfDay: Date,
  endOfDay: Date
) => {
  const result = await db
    .select({
      appointmentTime:
        appointments.appointmentTime,
    })
    .from(appointments)
    .where(
      and(
        eq(
          appointments.doctorProfileId,
          doctorProfileId
        ),

        sql`${appointments.appointmentDate} >= ${startOfDay}`,

        sql`${appointments.appointmentDate} < ${endOfDay}`,

        sql`${appointments.status} IN (
          'PENDING',
          'CONFIRMED',
          'CHECKED_IN'
        )`
      )
    );

  return result.map(
    (appointment) =>
      appointment.appointmentTime
  );
};