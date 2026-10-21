import { db } from "../db";
import { roles } from "../db/schema/roles";
import { users } from "../db/schema/users";
import { doctorProfiles } from "../db/schema/doctor_profiles";
import { doctorSchedules } from "../db/schema/doctor_schedules";
import bcrypt from "bcrypt";
import { eq, and } from "drizzle-orm";

async function seed() {
  try {
    console.log("🌱 Seeding started...");

    // 1. Seed Roles
    const existingRoles = await db.select().from(roles);
    if (existingRoles.length === 0) {
      await db.insert(roles).values([
        {
          name: "SUPER_ADMIN",
          description: "System Super Admin",
        },
        {
          name: "ADMIN",
          description: "Application Admin",
        },
        {
          name: "DOCTOR",
          description: "Doctor",
        },
        {
          name: "PATIENT",
          description: "Patient",
        },
        {
          name: "COORDINATOR",
          description: "Coordinator",
        },
      ]);
      console.log("✅ Roles seeded successfully.");
    } else {
      console.log("ℹ️ Roles already exist.");
    }

    // 2. Fetch Admin Role ID & Seed Default Admin User
    const adminRoles = await db
      .select()
      .from(roles)
      .where(eq(roles.name, "ADMIN"))
      .limit(1);

    const adminRole = adminRoles[0];

    if (adminRole) {
      const existingAdmin = await db
        .select()
        .from(users)
        .where(eq(users.mobile, "9999999999"))
        .limit(1);

      if (existingAdmin.length === 0) {
        const hashedPassword = await bcrypt.hash("admin123456", 10);
        await db.insert(users).values({
          roleId: adminRole.id,
          fullName: "System Admin",
          email: "admin@nosurgeries.com",
          mobile: "9999999999",
          password: hashedPassword,
          status: "ACTIVE",
          isEmailVerified: true,
          isMobileVerified: true,
        });
        console.log("✅ Default Admin User created successfully (Mobile: 9999999999, Pass: admin123456).");
      } else {
        console.log("ℹ️ Default Admin User already exists.");
      }
    }

    // 3. Ensure Doctor Schedules exist for all days of the week (MONDAY..SUNDAY)
    const doctorsList = await db.select().from(doctorProfiles);
    const days = [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ];

    for (const doc of doctorsList) {
      for (const day of days) {
        const existingSched = await db
          .select()
          .from(doctorSchedules)
          .where(
            and(
              eq(doctorSchedules.doctorProfileId, doc.id),
              eq(doctorSchedules.dayOfWeek, day)
            )
          )
          .limit(1);

        if (existingSched.length === 0) {
          await db.insert(doctorSchedules).values({
            doctorProfileId: doc.id,
            dayOfWeek: day,
            startTime: "09:00:00",
            endTime: "17:00:00",
            slotDuration: 30,
            maxPatients: 20,
            isAvailable: true,
          });
          console.log(`✅ Seeded schedule for Dr. ${doc.firstName} on ${day}`);
        }
      }
    }

  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }

  process.exit(0);
}

seed();