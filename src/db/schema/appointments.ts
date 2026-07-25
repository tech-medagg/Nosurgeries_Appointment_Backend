import {
  pgTable,
  uuid,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./users";

export const appointments = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),

  patientId: uuid("patient_id")
    .references(() => users.id)
    .notNull(),

  doctorId: uuid("doctor_id")
    .references(() => users.id)
    .notNull(),

  appointmentDate: timestamp("appointment_date", {
    withTimezone: true,
  }).notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});