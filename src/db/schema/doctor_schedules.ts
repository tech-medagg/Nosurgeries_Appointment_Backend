import {
  pgTable,
  uuid,
  varchar,
  integer,
  boolean,
  timestamp,
  time,
  index,
} from "drizzle-orm/pg-core";

import { doctorProfiles } from "./doctor_profiles";

export const doctorSchedules = pgTable(
  "doctor_schedules",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    doctorProfileId: uuid("doctor_profile_id")
      .references(() => doctorProfiles.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),

    dayOfWeek: varchar("day_of_week", {
      length: 20,
    }).notNull(),

    startTime: time("start_time").notNull(),

    endTime: time("end_time").notNull(),

    slotDuration: integer("slot_duration")
      .default(30)
      .notNull(),

    maxPatients: integer("max_patients")
      .default(20)
      .notNull(),

    isAvailable: boolean("is_available")
      .default(true)
      .notNull(),

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
  },
  (table) => ({
    doctorIndex: index(
      "doctor_schedule_doctor_idx"
    ).on(table.doctorProfileId),
  })
);