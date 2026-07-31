import { z } from "zod";

export const getUsersSchema = z.object({
  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(10),

  search: z.string().optional(),

  role: z.string().optional(),

  status: z.string().optional(),

  sortBy: z
    .enum([
      "createdAt",
      "fullName",
      "email",
      "mobile",
    ])
    .default("createdAt"),

  order: z
    .enum(["asc", "desc"])
    .default("desc"),
});

export type GetUsersQuery = z.infer<
  typeof getUsersSchema
>;