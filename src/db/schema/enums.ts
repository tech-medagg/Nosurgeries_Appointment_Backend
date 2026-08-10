import { pgEnum } from "drizzle-orm/pg-core";

/**
 * User Status
 */
export const userStatusEnum = pgEnum("user_status", [
  "ACTIVE",
  "INACTIVE",
]);

/**
 * Gender
 */
export const genderEnum = pgEnum("gender", [
  "MALE",
  "FEMALE",
  "OTHER",
]);

/**
 * Lead Status
 */
export const leadStatusEnum = pgEnum("lead_status", [
  "NEW",
  "CONTACTED",
  "INTERESTED",
  "FOLLOW_UP",
  "CONVERTED",
  "CLOSED",
]);

/**
 * Lead Priority
 */
export const leadPriorityEnum = pgEnum("lead_priority", [
  "LOW",
  "MEDIUM",
  "HIGH",
]);

/**
 * Appointment Status
 */
export const appointmentStatusEnum = pgEnum("appointment_status", [
      "PENDING",
      "CONFIRMED",
      "CHECKED_IN",
      "COMPLETED",
      "CANCELLED",
      "RESCHEDULED",
]);

/**
 * Notification Type
 */
export const notificationTypeEnum = pgEnum("notification_type", [
  "EMAIL",
  "SMS",
  "PUSH",
]);

/**
 * Message Sender
 */
export const messageSenderEnum = pgEnum("message_sender", [
  "PATIENT",
  "DOCTOR",
  "COORDINATOR",
]);

/**
 * Appointment Mode
 */
export const appointmentModeEnum = pgEnum("appointment_mode", [
  "ONLINE",
  "OFFLINE",
]);

/**
 * Days of Week
 */
export const weekDayEnum = pgEnum("week_day", [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
]);