import { relations } from "drizzle-orm";

import { roles } from "./schema/roles";
import { users } from "./schema/users";
import { patientProfiles } from "./schema/patient-profiles";
import { doctorProfiles } from "./schema/doctor_profiles";

/* ===========================
   Roles ↔ Users (One-to-Many)
=========================== */

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

/* ===========================
   Users Relations
=========================== */

export const usersRelations = relations(users, ({ one }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),

  patientProfile: one(patientProfiles),

  doctorProfile: one(doctorProfiles),
}));

/* ===========================
   Patient Profile ↔ User
=========================== */

export const patientProfilesRelations = relations(
  patientProfiles,
  ({ one }) => ({
    user: one(users, {
      fields: [patientProfiles.userId],
      references: [users.id],
    }),
  })
);

/* ===========================
   Doctor Profile ↔ User
=========================== */

export const doctorProfilesRelations = relations(
  doctorProfiles,
  ({ one }) => ({
    user: one(users, {
      fields: [doctorProfiles.userId],
      references: [users.id],
    }),
  })
);