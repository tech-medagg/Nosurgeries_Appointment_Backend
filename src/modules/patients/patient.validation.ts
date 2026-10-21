import { z } from "zod";

/* ======================================================
   Create Patient
====================================================== */

export const createPatientSchema = z.object({
  // User Information
  fullName: z
    .string()
    .trim()
    .min(3)
    .max(150),

  email: z
    .string()
    .trim()
    .email(),

  mobile: z
    .string()
    .trim()
    .min(10)
    .max(15),

  password: z
    .string()
    .min(6)
    .max(100),

  // Patient Profile
  firstName: z
    .string()
    .trim()
    .min(2)
    .max(100),

  lastName: z
    .string()
    .trim()
    .max(100)
    .optional(),

  gender: z.enum([
    "MALE",
    "FEMALE",
    "OTHER",
  ]),

  dateOfBirth: z
    .string()
    .optional(),

  bloodGroup: z
    .string()
    .max(10)
    .optional(),

  language: z
    .string()
    .max(50)
    .optional(),

  profileImage: z
    .string()
    .optional(),

  address: z
    .string()
    .optional(),

  city: z
    .string()
    .max(100)
    .optional(),

  state: z
    .string()
    .max(100)
    .optional(),

  country: z
    .string()
    .max(100)
    .optional(),

  pincode: z
    .string()
    .max(10)
    .optional(),

  emergencyContact: z
    .string()
    .max(20)
    .optional(),

  emergencyContactName: z
    .string()
    .max(100)
    .optional(),

  medicalHistory: z
    .string()
    .optional(),

  allergies: z
    .string()
    .optional(),
});

/* ======================================================
   Update Patient
====================================================== */

export const updatePatientSchema =
  createPatientSchema.partial();

/* ======================================================
   Get Patients
====================================================== */

export const getPatientsSchema =
  z.object({
    page: z.coerce
      .number()
      .min(1)
      .default(1),

    limit: z.coerce
      .number()
      .min(1)
      .max(100)
      .default(10),

    search: z
      .string()
      .optional(),

    gender: z
      .enum([
        "MALE",
        "FEMALE",
        "OTHER",
      ])
      .optional(),

    sortBy: z
      .enum([
        "fullName",
        "email",
        "createdAt",
      ])
      .default("createdAt"),

    order: z
      .enum([
        "asc",
        "desc",
      ])
      .default("desc"),
  });

/* ======================================================
   Types
====================================================== */

export type CreatePatientInput =
  z.infer<typeof createPatientSchema>;

export type UpdatePatientInput =
  z.infer<typeof updatePatientSchema>;

export type GetPatientsQuery =
  z.infer<typeof getPatientsSchema>;
  /* ======================================================
   Patient Self Profile
====================================================== */

export const createMyPatientProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(100),

  lastName: z
    .string()
    .trim()
    .max(100)
    .optional(),

  gender: z
    .enum([
      "MALE",
      "FEMALE",
      "OTHER",
    ])
    .optional(),

  dateOfBirth: z
    .string()
    .optional(),

  bloodGroup: z
    .string()
    .max(10)
    .optional(),

  language: z
    .string()
    .max(50)
    .optional(),

  profileImage: z
    .string()
    .max(500)
    .optional(),

  address: z
    .string()
    .optional(),

  city: z
    .string()
    .max(100)
    .optional(),

  state: z
    .string()
    .max(100)
    .optional(),

  country: z
    .string()
    .max(100)
    .optional(),

  pincode: z
    .string()
    .max(10)
    .optional(),

  emergencyContact: z
    .string()
    .max(20)
    .optional(),

  emergencyContactName: z
    .string()
    .max(100)
    .optional(),

  medicalHistory: z
    .string()
    .optional(),

  allergies: z
    .string()
    .optional(),
});

export const updateMyPatientProfileSchema =
  createMyPatientProfileSchema.partial();

export type CreateMyPatientProfileInput =
  z.infer<typeof createMyPatientProfileSchema>;

export type UpdateMyPatientProfileInput =
  z.infer<typeof updateMyPatientProfileSchema>;