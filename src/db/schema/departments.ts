import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const departments = pgTable("departments", {
  // Primary Key
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  // Department Name
  name: varchar("name", {
    length: 150,
  })
    .notNull()
    .unique(),

  // Slug (Used in URLs)
  slug: varchar("slug", {
    length: 150,
  })
    .notNull()
    .unique(),

  // Description
  description: text("description"),

  // Icon/Image
  icon: varchar("icon", {
    length: 500,
  }),

  // Display Order
  displayOrder: varchar("display_order", {
    length: 10,
  }),

  // Active Status
  isActive: varchar("is_active", {
    length: 5,
  })
    .default("true")
    .notNull(),

  // SEO Meta Title
  metaTitle: varchar("meta_title", {
    length: 255,
  }),

  // SEO Meta Description
  metaDescription: text("meta_description"),

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