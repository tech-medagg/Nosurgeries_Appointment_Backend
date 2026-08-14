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
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "./appointment.validation";

import { doctorSchedules } from "../../db/schema/doctor_schedules";
import { appointments } from "../../db/schema/appointments";
import { patientProfiles } from "../../db/schema/patient-profiles";
import { hospitals } from "../../db/schema/hospitals";
import { departments } from "../../db/schema/departments";
import { doctorProfiles } from "../../db/schema/doctor_profiles";

/* ======================================================
   Find Appointment By Id
====================================================== */

export const findById = async (
  id: string
) => {
  const result = await db
    .select()
    .from(appointments)
    .where(
      eq(
        appointments.id,
        id
      )
    )
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
    .from(patientProfiles)
    .where(
      eq(
        patientProfiles.id,
        patientId
      )
    )
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
    .where(
      eq(
        hospitals.id,
        hospitalId
      )
    )
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
  const startOfDay =
    new Date(appointmentDate);

  startOfDay.setHours(
    0,
    0,
    0,
    0
  );

  const endOfDay =
    new Date(appointmentDate);

  endOfDay.setHours(
    23,
    59,
    59,
    999
  );

  const result = await db
    .select({
      count:
        sql<number>`count(*)`,
    })
    .from(appointments)
    .where(
      and(
        eq(
          appointments.doctorProfileId,
          doctorProfileId
        ),

        sql`
          ${appointments.appointmentDate}
          >= ${startOfDay}
        `,

        sql`
          ${appointments.appointmentDate}
          <= ${endOfDay}
        `,

        sql`
          ${appointments.status} IN (
            'PENDING',
            'CONFIRMED',
            'CHECKED_IN'
          )
        `
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
    .where(
      eq(
        departments.id,
        departmentId
      )
    )
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

/* ======================================================
   Create Appointment
====================================================== */

export const create = async (
  data: CreateAppointmentInput
) => {
  const appointmentDate = new Date(data.appointmentDate);

  // Start and end of the appointment date
  const startOfDay = new Date(appointmentDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(appointmentDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Check whether this doctor already has this time booked
  const existingAppointment = await db
    .select({
      id: appointments.id,
      appointmentTime: appointments.appointmentTime,
      status: appointments.status,
    })
    .from(appointments)
    .where(
      and(
        eq(
          appointments.doctorProfileId,
          data.doctorProfileId
        ),

        sql`
          ${appointments.appointmentDate}
          >= ${startOfDay}
        `,

        sql`
          ${appointments.appointmentDate}
          <= ${endOfDay}
        `,

        eq(
          appointments.appointmentTime,
          data.appointmentTime
        ),

        sql`
          ${appointments.status} IN (
            'PENDING',
            'CONFIRMED',
            'CHECKED_IN',
            'RESCHEDULED'
          )
        `
      )
    )
    .limit(1);

  // Prevent duplicate booking
  if (existingAppointment.length > 0) {
    throw new Error(
      "This appointment slot is already booked."
    );
  }

  // Create appointment
  const [appointment] = await db
    .insert(appointments)
    .values({
      patientId: data.patientId,

      hospitalId: data.hospitalId,

      departmentId: data.departmentId,

      doctorProfileId: data.doctorProfileId,

      appointmentDate,

      appointmentTime: data.appointmentTime,

      consultationFee: data.consultationFee,

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
  const [appointment] =
    await db
      .update(appointments)

      .set({
        patientId:
          data.patientId,

        hospitalId:
          data.hospitalId,

        departmentId:
          data.departmentId,

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

        consultationFee:
          data.consultationFee,

        notes:
          data.notes,

        status:
          data.status,

        updatedAt:
          new Date(),
      })

      .where(
        eq(
          appointments.id,
          id
        )
      )

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
    .where(
      eq(
        appointments.id,
        id
      )
    )
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

  const offset =
    (page - 1) * limit;

  const conditions: SQL[] = [];

  /* Patient */
  if (patientId) {
    conditions.push(
      eq(
        appointments.patientId,
        patientId
      )
    );
  }

  /* Doctor */
  if (doctorProfileId) {
    conditions.push(
      eq(
        appointments.doctorProfileId,
        doctorProfileId
      )
    );
  }

  /* Hospital */
  if (hospitalId) {
    conditions.push(
      eq(
        appointments.hospitalId,
        hospitalId
      )
    );
  }

  /* Department */
  if (departmentId) {
    conditions.push(
      eq(
        appointments.departmentId,
        departmentId
      )
    );
  }

  /* Status */
  if (status) {
    conditions.push(
      eq(
        appointments.status,
        status
      )
    );
  }

  const whereClause =
    conditions.length > 0
      ? and(...conditions)
      : undefined;

  const result = await db
    .select({
      id:
        appointments.id,

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

      consultationFee:
        appointments.consultationFee,

      notes:
        appointments.notes,

      status:
        appointments.status,

      createdAt:
        appointments.createdAt,

      updatedAt:
        appointments.updatedAt,

      patientFirstName:
        patientProfiles.firstName,

      patientLastName:
        patientProfiles.lastName,

      hospitalName:
        hospitals.name,

      departmentName:
        departments.name,

      doctorFirstName:
        doctorProfiles.firstName,

      doctorLastName:
        doctorProfiles.lastName,
    })

    .from(appointments)

    .innerJoin(
      patientProfiles,
      eq(
        appointments.patientId,
        patientProfiles.id
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

  /* ======================================================
     Total Count
  ====================================================== */

  const totalResult =
    await db
      .select({
        count:
          sql<number>`count(*)`,
      })
      .from(appointments)
      .where(whereClause);

  const total = Number(
    totalResult[0]?.count ?? 0
  );

  return {
    appointments: result,

    total,

    page,

    limit,

    totalPages:
      Math.ceil(
        total / limit
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
  try {
    const result = await db
      .select({
        id: appointments.id,
        appointmentTime: appointments.appointmentTime,
        status: appointments.status,      })
      .from(appointments)
      .where(
        and(
          eq(
            appointments.doctorProfileId,
            doctorProfileId
          ),

          sql`
            ${appointments.appointmentDate} >= ${startOfDay}
          `,

          sql`
            ${appointments.appointmentDate} < ${endOfDay}
          `,

          sql`
            ${appointments.status} IN (
              'PENDING',
              'CONFIRMED',
              'CHECKED_IN',
              'RESCHEDULED'
            )
          `
        )
      );

    return result.map(
      (appointment) =>
        appointment.appointmentTime
    );  } catch (error) {
    console.error(
      "❌ getDoctorBookedSlots ERROR:",
      error
    );

    throw error;
  }
};