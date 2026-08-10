import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  index,
} from "drizzle-orm/pg-core";

import { users } from "./users";
import { doctorProfiles } from "./doctor_profiles";
import { hospitals } from "./hospitals";
import { departments } from "./departments";
import {
  appointmentStatusEnum,
} from "./enums";


export const appointments = pgTable(
  "appointments",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    patientId: uuid("patient_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),

    hospitalId: uuid("hospital_id")
      .references(() => hospitals.id)
      .notNull(),

    departmentId: uuid("department_id")
      .references(() => departments.id)
      .notNull(),

    doctorProfileId: uuid("doctor_profile_id")
      .references(() => doctorProfiles.id),

    appointmentDate: timestamp(
      "appointment_date",
      {
        withTimezone: true,
      }
    ).notNull(),

    appointmentTime: varchar(
      "appointment_time",
      {
        length: 10,
      }
    ).notNull(),

    consultationType: varchar(
      "consultation_type",
      {
        length: 50,
      }
    ).default("IN_PERSON"),

    symptoms: text("symptoms"),

    notes: text("notes"),

    tokenNumber: integer(
      "token_number"
    ),

    status:
      appointmentStatusEnum("status")
        .default("PENDING")
        .notNull(),

    createdAt: timestamp(
      "created_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),

    updatedAt: timestamp(
      "updated_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    patientIdx: index(
      "appointment_patient_idx"
    ).on(table.patientId),

    doctorIdx: index(
      "appointment_doctor_idx"
    ).on(table.doctorProfileId),

    hospitalIdx: index(
      "appointment_hospital_idx"
    ).on(table.hospitalId),

    departmentIdx: index(
      "appointment_department_idx"
    ).on(table.departmentId),
  })
);