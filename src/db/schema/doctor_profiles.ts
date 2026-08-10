import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  text,
  boolean,
  index,
} from "drizzle-orm/pg-core";

import { users } from "./users";
import { hospitals } from "./hospitals";
import { departments } from "./departments";
import {
  genderEnum,
  userStatusEnum,
} from "./enums";

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

    // Hospital Reference
    hospitalId: uuid("hospital_id")
      .references(() => hospitals.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      })
      .notNull(),

    // Department Reference
    departmentId: uuid("department_id")
      .references(() => departments.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      })
      .notNull(),

    // Personal Information
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

    // Professional Information
    qualification: varchar("qualification", {
      length: 255,
    }).notNull(),

    specialization: varchar("specialization", {
      length: 255,
    }).notNull(),

    registrationNumber: varchar(
      "registration_number",
      {
        length: 100,
      }
    ).unique(),

    experienceYears: integer("experience_years")
      .default(0)
      .notNull(),

    consultationFee: integer(
      "consultation_fee"
    ),

    languages: varchar("languages", {
      length: 255,
    }),

    biography: text("biography"),

    // Doctor Availability
    isAvailable: boolean("is_available")
      .default(true)
      .notNull(),

    // Account Status
    status: userStatusEnum("status")
      .default("ACTIVE")
      .notNull(),

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
    userIndex: index(
      "doctor_profiles_user_idx"
    ).on(table.userId),

    hospitalIndex: index(
      "doctor_profiles_hospital_idx"
    ).on(table.hospitalId),

    departmentIndex: index(
      "doctor_profiles_department_idx"
    ).on(table.departmentId),

    registrationIndex: index(
      "doctor_registration_idx"
    ).on(table.registrationNumber),

    statusIndex: index(
      "doctor_status_idx"
    ).on(table.status),

    availabilityIndex: index(
      "doctor_available_idx"
    ).on(table.isAvailable),
  })
);