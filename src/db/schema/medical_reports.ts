import { pgTable, uuid, varchar, timestamp, integer, text, index } from "drizzle-orm/pg-core";
import { patientProfiles } from "./patient-profiles";
import { appointments } from "./appointments";
import { users } from "./users";
import { reportCategoryEnum } from "./reportCategoryEnum";

export const medicalReports = pgTable(
  "medical_reports",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    patientId: uuid("patient_id")
      .references(() => patientProfiles.id, { onDelete: "cascade", onUpdate: "cascade" })
      .notNull(),
    appointmentId: uuid("appointment_id")
      .references(() => appointments.id, { onDelete: "set null", onUpdate: "cascade" }),
    fileName: varchar("file_name", { length: 255 }).notNull(),
    originalFileName: varchar("original_file_name", { length: 255 }).notNull(),
    fileType: varchar("file_type", { length: 100 }).notNull(),
    fileSize: integer("file_size").notNull(),
    fileUrl: varchar("file_url", { length: 500 }).notNull(),
    category: reportCategoryEnum("category").notNull(),
    uploadedBy: uuid("uploaded_by")
      .references(() => users.id, { onDelete: "set null", onUpdate: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    patientIdx: index("medical_report_patient_idx").on(table.patientId),
    appointmentIdx: index("medical_report_appointment_idx").on(table.appointmentId),
    uploaderIdx: index("medical_report_uploader_idx").on(table.uploadedBy),
  })
);
