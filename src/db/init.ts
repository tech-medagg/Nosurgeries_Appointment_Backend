import path from "path";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";

import { db, pool } from "./index";
import { roles } from "./schema/roles";
import { users } from "./schema/users";

export async function initDatabase() {
  try {
    console.log("🔍 Checking database connection...");
    const client = await pool.connect();
    client.release();
    console.log("✅ Database connected successfully.");

    // Check if migrations folder exists and run migrations
    const migrationsFolder = path.resolve(process.cwd(), "drizzle");
    console.log(`📦 Running migrations from ${migrationsFolder}...`);
    try {
      await migrate(db, { migrationsFolder });
      console.log("✅ Migrations up to date.");
    } catch (migErr) {
      console.warn("⚠️ Migration notice:", migErr);
    }

    // Ensure roles exist
    const existingRoles = await db.select().from(roles);
    if (existingRoles.length === 0) {
      console.log("🌱 Seeding default roles...");
      await db.insert(roles).values([
        { name: "SUPER_ADMIN", description: "System Super Admin" },
        { name: "ADMIN", description: "Application Admin" },
        { name: "DOCTOR", description: "Doctor" },
        { name: "PATIENT", description: "Patient" },
        { name: "COORDINATOR", description: "Coordinator" },
      ]);
      console.log("✅ Roles created.");
    }

    // Refresh roles list
    const allRoles = await db.select().from(roles);
    const getRole = (name: string) => allRoles.find((r) => r.name === name);
    const patientRole = getRole("PATIENT");
    const doctorRole = getRole("DOCTOR");
    const adminRole = getRole("ADMIN");

    if (patientRole && doctorRole && adminRole) {
      const TEST_PASSWORD = "12345678";
      const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);

      const testUsers = [
        {
          mobile: "9344228002",
          fullName: "Test Patient",
          email: "patient@test.com",
          roleId: patientRole.id,
          role: "PATIENT",
        },
        {
          mobile: "9344228003",
          fullName: "Test Doctor",
          email: "doctor@test.com",
          roleId: doctorRole.id,
          role: "DOCTOR",
        },
        {
          mobile: "9344228004",
          fullName: "Test Admin",
          email: "admin@test.com",
          roleId: adminRole.id,
          role: "ADMIN",
        },
      ];

      for (const u of testUsers) {
        const existing = await db
          .select()
          .from(users)
          .where(eq(users.email, u.email))
          .limit(1);

        if (existing.length === 0) {
          await db.insert(users).values({
            roleId: u.roleId,
            fullName: u.fullName,
            email: u.email,
            mobile: u.mobile,
            password: hashedPassword,
            status: "ACTIVE",
            isEmailVerified: true,
            isMobileVerified: true,
          });
          console.log(`✅ Seeded ${u.role}: ${u.email}`);
        }
      }
    }
  } catch (error) {
    console.error("❌ initDatabase error:", error);
  }
}
