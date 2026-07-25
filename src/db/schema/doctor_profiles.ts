import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  text,
  index,
} from "drizzle-orm/pg-core";

import { users } from "./users";
import { genderEnum } from "./enums";

export const doctorProfiles = pgTable(
  "doctor_profiles",
  {
    // Primary Key
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    // User Reference
    userId: uuid("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),

    // Personal Details
    firstName: varchar("first_name", {
      length: 100,
    }).notNull(),

    lastName: varchar("last_name", {
      length: 100,
    }),

    gender: genderEnum("gender"),

    dateOfBirth: timestamp("date_of_birth", {
      mode: "date",
    }),

    profileImage: varchar("profile_image", {
      length: 500,
    }),

    // Professional Details
    qualification: varchar("qualification", {
      length: 255,
    }).notNull(),

    specialization: varchar("specialization", {
      length: 255,
    }).notNull(),

    registrationNumber: varchar("registration_number", {
      length: 100,
    }).unique(),

    experienceYears: integer("experience_years")
      .default(0)
      .notNull(),

    biography: text("biography"),

    consultationFee: integer("consultation_fee"),

    // Audit
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
    userIndex: index("doctor_profiles_user_idx").on(table.userId),

    registrationIndex: index("doctor_registration_idx").on(
      table.registrationNumber
    ),
  })
);