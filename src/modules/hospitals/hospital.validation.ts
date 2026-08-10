import { z } from "zod";

/* ==========================================================
   Create Hospital
========================================================== */

export const createHospitalSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(255),

  email: z
    .string()
    .email()
    .optional(),

  phone: z
    .string()
    .max(20)
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

  pincode: z
    .string()
    .max(10)
    .optional(),

  isActive: z
    .boolean()
    .default(true),
});

/* ==========================================================
   Update Hospital
========================================================== */

export const updateHospitalSchema =
  createHospitalSchema.partial();

/* ==========================================================
   Get Hospitals
========================================================== */

export const getHospitalsSchema = z.object({
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

  isActive: z.coerce
    .boolean()
    .optional(),

  sortBy: z
    .enum([
      "name",
      "city",
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

/* ==========================================================
   Types
========================================================== */

export type CreateHospitalInput =
  z.infer<typeof createHospitalSchema>;

export type UpdateHospitalInput =
  z.infer<typeof updateHospitalSchema>;

export type GetHospitalsQuery =
  z.infer<typeof getHospitalsSchema>;