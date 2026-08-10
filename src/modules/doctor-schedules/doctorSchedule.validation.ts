import { z } from "zod";

export const createDoctorScheduleSchema = z.object({
  doctorProfileId: z.string().uuid(),

  dayOfWeek: z.enum([
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ]),

  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/),

  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/),

  slotDuration: z
    .number()
    .int()
    .min(5)
    .max(120),

  maxPatients: z
    .number()
    .int()
    .min(1)
    .max(200),

  isAvailable: z.boolean().default(true),
});

export const updateDoctorScheduleSchema =
  createDoctorScheduleSchema.partial();

export const getDoctorSchedulesSchema =
  z.object({
    page: z.coerce.number().default(1),

    limit: z.coerce.number().default(10),

    doctorProfileId: z
      .string()
      .uuid()
      .optional(),

    dayOfWeek: z
      .enum([
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ])
      .optional(),

    isAvailable: z
      .coerce
      .boolean()
      .optional(),

    order: z
      .enum(["asc", "desc"])
      .default("asc"),
  });

export type CreateDoctorScheduleInput =
  z.infer<typeof createDoctorScheduleSchema>;

export type UpdateDoctorScheduleInput =
  z.infer<typeof updateDoctorScheduleSchema>;

export type GetDoctorSchedulesQuery =
  z.infer<typeof getDoctorSchedulesSchema>;