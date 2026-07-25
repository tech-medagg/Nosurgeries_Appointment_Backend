import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core";

import { roles } from "./roles";
import { userStatusEnum } from "./enums";

export const users = pgTable(
  "users",
  {
    // Primary Key
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    // Foreign Key -> Roles
    roleId: uuid("role_id")
      .references(() => roles.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      })
      .notNull(),

    // Basic Information
    fullName: varchar("full_name", { length: 150 }).notNull(),

    email: varchar("email", { length: 255 })
      .notNull()
      .unique(),

    mobile: varchar("mobile", { length: 20 })
      .notNull()
      .unique(),

    // Password (Hashed using bcrypt)
    password: varchar("password", { length: 255 }).notNull(),

    // Account Status
    status: userStatusEnum("status")
      .default("ACTIVE")
      .notNull(),

    // Email Verification
    isEmailVerified: boolean("is_email_verified")
      .default(false)
      .notNull(),

    // Mobile Verification
    isMobileVerified: boolean("is_mobile_verified")
      .default(false)
      .notNull(),

    // Last Login
    lastLogin: timestamp("last_login", {
      withTimezone: true,
    }),

    // Created At
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    // Updated At
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    emailIndex: index("users_email_idx").on(table.email),
    mobileIndex: index("users_mobile_idx").on(table.mobile),
    roleIndex: index("users_role_idx").on(table.roleId),
  })
);