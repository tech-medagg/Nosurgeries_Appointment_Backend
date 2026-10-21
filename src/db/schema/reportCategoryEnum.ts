import { pgEnum } from "drizzle-orm/pg-core";

export const reportCategoryEnum = pgEnum("report_category", [
  "LAB_REPORT",
  "SCAN",
  "PRESCRIPTION",
  "MEDICAL_HISTORY",
  "DISCHARGE_SUMMARY",
  "OTHER",
]);
