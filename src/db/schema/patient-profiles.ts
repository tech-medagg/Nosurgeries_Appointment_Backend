import {
  pgTable,
  uuid,
  varchar,
  date,
  timestamp,
  text,
  index,
} from "drizzle-orm/pg-core";

import { users } from "./users";
import { genderEnum } from "./enums";

export const patientProfiles = pgTable(
  "patient_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),

    firstName: varchar("first_name", {
      length: 100,
    }).notNull(),

    lastName: varchar("last_name", {
      length: 100,
    }),

    gender: genderEnum("gender"),

    dateOfBirth: date("date_of_birth"),

    bloodGroup: varchar("blood_group", {
      length: 10,
    }),

    language: varchar("language", {
      length: 50,
    }),

    profileImage: varchar(
      "profile_image",
      {
        length: 500,
      }
    ),

    address: text("address"),

    city: varchar("city", {
      length: 100,
    }),

    state: varchar("state", {
      length: 100,
    }),

    country: varchar("country", {
      length: 100,
    }),

    pincode: varchar("pincode", {
      length: 10,
    }),

    emergencyContact: varchar(
      "emergency_contact",
      {
        length: 20,
      }
    ),

    emergencyContactName: varchar(
      "emergency_contact_name",
      {
        length: 100,
      }
    ),

    medicalHistory: text(
      "medical_history"
    ),

    allergies: text("allergies"),

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
      "patient_profiles_user_idx"
    ).on(table.userId),
  })
);