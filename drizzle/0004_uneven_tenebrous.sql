ALTER TYPE "public"."appointment_status" ADD VALUE 'CHECKED_IN' BEFORE 'COMPLETED';--> statement-breakpoint
ALTER TABLE "appointments" RENAME COLUMN "patient_profile_id" TO "patient_id";--> statement-breakpoint
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_patient_profile_id_patient_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "doctor_profile_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "status" SET DEFAULT 'PENDING'::"public"."appointment_status";--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "status" SET DATA TYPE "public"."appointment_status" USING "status"::"public"."appointment_status";--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "appointment_time" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "consultation_type" varchar(50) DEFAULT 'IN_PERSON';--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "symptoms" text;--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "token_number" integer;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_users_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "appointment_patient_idx" ON "appointments" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "appointment_doctor_idx" ON "appointments" USING btree ("doctor_profile_id");--> statement-breakpoint
CREATE INDEX "appointment_hospital_idx" ON "appointments" USING btree ("hospital_id");--> statement-breakpoint
CREATE INDEX "appointment_department_idx" ON "appointments" USING btree ("department_id");--> statement-breakpoint
ALTER TABLE "appointments" DROP COLUMN "consultation_fee";