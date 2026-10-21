import { pgEnum } from "drizzle-orm/pg-core";

export const consultationOutcomeEnum = pgEnum("consultation_outcome", [
  "PROCEDURE_RECOMMENDED",
  "FOLLOW_UP_REQUIRED",
  "NO_PROCEDURE",
  "FURTHER_INVESTIGATION_REQUIRED",
]);
