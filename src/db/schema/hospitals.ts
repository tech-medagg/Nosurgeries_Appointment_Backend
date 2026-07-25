import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const hospitals = pgTable("hospitals", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),

  email: varchar("email", { length: 255 }),

  phone: varchar("phone", { length: 20 }),

  address: text("address"),

  city: varchar("city", { length: 100 }),

  state: varchar("state", { length: 100 }),

  pincode: varchar("pincode", { length: 10 }),

  isActive: boolean("is_active").default(true).notNull(),

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
});