import { z } from "zod";

export const createDoctorSchema = z.object({
  userId: z.string().uuid(),

  hospitalId: z.string().uuid(),

  departmentId: z.string().uuid(),

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
  ]).optional(),

  dateOfBirth: z
    .string()
    .optional(),

  profileImage: z
    .string()
    .optional(),

  qualification: z
    .string()
    .trim()
    .min(2)
    .max(255),

  specialization: z
    .string()
    .trim()
    .min(2)
    .max(255),

  registrationNumber: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .optional(),

  experienceYears: z
    .number()
    .int()
    .min(0),

  consultationFee: z
    .number()
    .int()
    .min(0)
    .optional(),

  languages: z
    .string()
    .optional(),

  biography: z
    .string()
    .optional(),

  isAvailable: z
    .boolean()
    .default(true),

  status: z.enum([
    "ACTIVE",
    "INACTIVE",
  ]),
});

export const updateDoctorSchema =
  createDoctorSchema.partial();

export const getDoctorsSchema =
  z.object({
    page: z.coerce
      .number()
      .default(1),

    limit: z.coerce
      .number()
      .default(10),

    search: z
      .string()
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
        "ACTIVE",
        "INACTIVE",
      ])
      .optional(),

    sortBy: z
      .enum([
        "createdAt",
        "experienceYears",
        "consultationFee",
      ])
      .default("createdAt"),

    order: z
      .enum([
        "asc",
        "desc",
      ])
      .default("desc"),
  });

export type CreateDoctorInput =
  z.infer<
    typeof createDoctorSchema
  >;

export type UpdateDoctorInput =
  z.infer<
    typeof updateDoctorSchema
  >;

export type GetDoctorsQuery =
  z.infer<
    typeof getDoctorsSchema
  >;