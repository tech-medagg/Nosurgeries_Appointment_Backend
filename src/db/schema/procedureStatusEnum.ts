import { pgEnum } from "drizzle-orm/pg-core";

export const procedureStatusEnum = pgEnum("procedure_status", [
  "PROCEDURE_RECOMMENDED",
  "PROCEDURE_PLANNED",
  "IPD_SCHEDULED",
  "ADMITTED",
  "PROCEDURE_IN_PROGRESS",
  "PROCEDURE_COMPLETED",
  "DISCHARGED",
  "CANCELLED",
]);
