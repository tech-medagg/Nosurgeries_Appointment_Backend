import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const roles = pgTable("roles", {
  // Primary Key
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  // Role Name
  name: varchar("name", {
    length: 100,
  })
    .notNull()
    .unique(),

  // Description
  description: text("description"),

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
});