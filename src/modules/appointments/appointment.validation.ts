import { z } from "zod";

/* ======================================================
   Create Appointment
====================================================== */

export const createAppointmentSchema = z.object({
  patientId: z.string().uuid(),

  hospitalId: z.string().uuid(),

  departmentId: z.string().uuid(),

  doctorProfileId: z
    .string()
    .uuid()
    .optional(),

  appointmentDate: z.string(),

  appointmentTime: z.string(),

  consultationType: z
    .enum([
      "IN_PERSON",
      "ONLINE",
    ])
    .default("IN_PERSON"),

  symptoms: z
    .string()
    .optional(),

  notes: z
    .string()
    .optional(),
});

/* ======================================================
   Update Appointment
====================================================== */

export const updateAppointmentSchema =
  createAppointmentSchema
    .partial()
    .extend({
      status: z
        .enum([
          "PENDING",
          "CONFIRMED",
          "CHECKED_IN",
          "COMPLETED",
          "CANCELLED",
          "RESCHEDULED",
        ])
        .optional(),

      tokenNumber: z
        .number()
        .optional(),
    });

/* ======================================================
   Get Appointments
====================================================== */

export const getAppointmentsSchema =
  z.object({
    page: z.coerce
      .number()
      .default(1),

    limit: z.coerce
      .number()
      .default(10),

    patientId: z
      .string()
      .uuid()
      .optional(),

    doctorProfileId: z
      .string()
      .uuid()
      .optional(),

    hospitalId: z
      .string()
      .uuid()
      .optional(),

    departmentId: z
      .string()
      .uuid()
      .optional(),

    status: z
      .enum([
        "PENDING",
        "CONFIRMED",
        "CHECKED_IN",
        "COMPLETED",
        "CANCELLED",
        "RESCHEDULED",
      ])
      .optional(),

    order: z
      .enum([
        "asc",
        "desc",
      ])
      .default("desc"),
  });

export type CreateAppointmentInput =
  z.infer<
    typeof createAppointmentSchema
  >;

export type UpdateAppointmentInput =
  z.infer<
    typeof updateAppointmentSchema
  >;

export type GetAppointmentsQuery =
  z.infer<
    typeof getAppointmentsSchema
  >;

  /* ======================================================
   Get Doctor Availability Validation
====================================================== */

export const getDoctorAvailabilitySchema =
  z.object({
    hospitalId: z
      .string()
      .uuid("Invalid hospital ID."),

    departmentId: z
      .string()
      .uuid("Invalid department ID."),

    appointmentDate: z
      .string()
      .min(
        1,
        "Appointment date is required."
      )
      .refine(
        (value) => {
          const date = new Date(value);

          return !Number.isNaN(
            date.getTime()
          );
        },
        {
          message:
            "Invalid appointment date.",
        }
      ),
  });

export type GetDoctorAvailabilityQuery =
  z.infer<
    typeof getDoctorAvailabilitySchema
  >;