import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  index,
} from "drizzle-orm/pg-core";

import { patientProfiles } from "./patient-profiles";
import { doctorProfiles } from "./doctor_profiles";
import { hospitals } from "./hospitals";
import { departments } from "./departments";

export const appointments = pgTable(
  "appointments",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    /*
     * API property:
     * patientId
     *
     * Database column:
     * patient_profile_id
     *
     * References:
     * patient_profiles.id
     */
    patientId: uuid("patient_profile_id")
      .references(() => patientProfiles.id, {
        onDelete: "cascade",
      })
      .notNull(),

    doctorProfileId: uuid("doctor_profile_id")
      .references(() => doctorProfiles.id),

    hospitalId: uuid("hospital_id")
      .references(() => hospitals.id)
      .notNull(),

    departmentId: uuid("department_id")
      .references(() => departments.id)
      .notNull(),

    appointmentDate: timestamp("appointment_date", {
      withTimezone: true,
    }).notNull(),

    appointmentTime: varchar("appointment_time", {
      length: 10,
    }),

    // consultationFee field removed as per new requirements

    status: text("status")
      .default("PENDING")
      .notNull(),

    notes: text("notes"),

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
    patientIdx: index("appointment_patient_idx").on(
      table.patientId
    ),

    doctorIdx: index("appointment_doctor_idx").on(
      table.doctorProfileId
    ),

    hospitalIdx: index("appointment_hospital_idx").on(
      table.hospitalId
    ),

    departmentIdx: index("appointment_department_idx").on(
      table.departmentId
    ),
    // New indexes for high‑traffic queries
    dateIdx: index("appointment_date_idx").on(table.appointmentDate),
    statusIdx: index("appointment_status_idx").on(table.status),
  })
);