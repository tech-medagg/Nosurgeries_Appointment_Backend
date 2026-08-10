CREATE TABLE "doctor_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_profile_id" uuid NOT NULL,
	"day_of_week" varchar(20) NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"slot_duration" integer DEFAULT 30 NOT NULL,
	"max_patients" integer DEFAULT 20 NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "doctor_schedules" ADD CONSTRAINT "doctor_schedules_doctor_profile_id_doctor_profiles_id_fk" FOREIGN KEY ("doctor_profile_id") REFERENCES "public"."doctor_profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "doctor_schedule_doctor_idx" ON "doctor_schedules" USING btree ("doctor_profile_id");