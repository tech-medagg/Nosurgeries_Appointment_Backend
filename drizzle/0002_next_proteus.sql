ALTER TABLE "doctor_profiles" ADD COLUMN "status" "user_status" DEFAULT 'ACTIVE' NOT NULL;--> statement-breakpoint
CREATE INDEX "doctor_status_idx" ON "doctor_profiles" USING btree ("status");--> statement-breakpoint
CREATE INDEX "doctor_available_idx" ON "doctor_profiles" USING btree ("is_available");