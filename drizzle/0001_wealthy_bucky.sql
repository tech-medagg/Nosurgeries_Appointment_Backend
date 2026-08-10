CREATE TABLE "appointments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_profile_id" uuid NOT NULL,
	"doctor_profile_id" uuid NOT NULL,
	"hospital_id" uuid NOT NULL,
	"department_id" uuid NOT NULL,
	"appointment_date" timestamp with time zone NOT NULL,
	"consultation_fee" integer,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hospitals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(20),
	"address" text,
	"city" varchar(100),
	"state" varchar(100),
	"pincode" varchar(10),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "doctor_profiles" ADD COLUMN "hospital_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "doctor_profiles" ADD COLUMN "department_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "doctor_profiles" ADD COLUMN "languages" varchar(255);--> statement-breakpoint
ALTER TABLE "doctor_profiles" ADD COLUMN "is_available" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "patient_profiles" ADD COLUMN "emergency_contact_name" varchar(100);--> statement-breakpoint
ALTER TABLE "patient_profiles" ADD COLUMN "medical_history" text;--> statement-breakpoint
ALTER TABLE "patient_profiles" ADD COLUMN "allergies" text;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_profile_id_patient_profiles_id_fk" FOREIGN KEY ("patient_profile_id") REFERENCES "public"."patient_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctor_profile_id_doctor_profiles_id_fk" FOREIGN KEY ("doctor_profile_id") REFERENCES "public"."doctor_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_hospital_id_hospitals_id_fk" FOREIGN KEY ("hospital_id") REFERENCES "public"."hospitals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_profiles" ADD CONSTRAINT "doctor_profiles_hospital_id_hospitals_id_fk" FOREIGN KEY ("hospital_id") REFERENCES "public"."hospitals"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "doctor_profiles" ADD CONSTRAINT "doctor_profiles_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "doctor_profiles_hospital_idx" ON "doctor_profiles" USING btree ("hospital_id");--> statement-breakpoint
CREATE INDEX "doctor_profiles_department_idx" ON "doctor_profiles" USING btree ("department_id");