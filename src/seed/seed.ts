import { db } from "../db";
import { roles } from "../db/schema/roles";

async function seed() {
  try {
    console.log("🌱 Seeding started...");

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
  } catch (error) {
    console.error(error);
  }

  process.exit(0);
}

seed();