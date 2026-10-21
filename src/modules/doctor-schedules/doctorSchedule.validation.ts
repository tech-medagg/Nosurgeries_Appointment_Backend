import { z } from "zod";

const normalizeTime = (val: string): string => {
  if (!val) return "09:00";
  const str = val.trim().toUpperCase();
  const match = str.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/);
  if (!match) return val;
  let hours = parseInt(match[1]!, 10);
  const minutes = match[2]!;
  const period = match[3];

  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${minutes}`;
};

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
    .transform(normalizeTime)
    .pipe(z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/)),

  endTime: z
    .string()
    .transform(normalizeTime)
    .pipe(z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/)),

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