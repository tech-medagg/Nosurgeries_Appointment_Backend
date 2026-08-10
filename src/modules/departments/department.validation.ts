import { z } from "zod";

/* ============================
   Create Department
============================ */

export const createDepartmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Department name must be at least 2 characters")
    .max(150, "Department name must not exceed 150 characters"),

  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(150, "Slug must not exceed 150 characters"),

  description: z
    .string()
    .nullable()
    .optional(),

  icon: z
    .string()
    .nullable()
    .optional(),

  displayOrder: z
    .string()
    .nullable()
    .optional(),

  isActive: z
    .enum(["true", "false"])
    .default("true"),

  metaTitle: z
    .string()
    .max(255)
    .nullable()
    .optional(),

  metaDescription: z
    .string()
    .nullable()
    .optional(),
});

/* ============================
   Update Department
============================ */

export const updateDepartmentSchema =
  createDepartmentSchema.partial();

/* ============================
   Get Departments
============================ */

export const getDepartmentsSchema = z.object({
  page: z.coerce
    .number()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .min(1)
    .max(100)
    .default(10),

  search: z.string().optional(),

  isActive: z
    .enum(["true", "false"])
    .optional(),

  sortBy: z
    .enum([
      "name",
      "displayOrder",
      "createdAt",
    ])
    .default("createdAt"),

  order: z
    .enum(["asc", "desc"])
    .default("desc"),
});

/* ============================
   Types
============================ */

export type CreateDepartmentInput =
  z.infer<typeof createDepartmentSchema>;

export type UpdateDepartmentInput =
  z.infer<typeof updateDepartmentSchema>;

export type GetDepartmentsQuery =
  z.infer<typeof getDepartmentsSchema>;