import { db } from "./db";
import { doctorProfiles } from "./db/schema/doctor_profiles";
import { doctorSchedules } from "./db/schema/doctor_schedules";
import { hospitals } from "./db/schema/hospitals";
import { departments } from "./db/schema/departments";

async function checkDb() {
  console.log("=== HOSPITALS ===");
  const hList = await db.select().from(hospitals);
  console.log(hList);

  console.log("=== DEPARTMENTS ===");
  const dList = await db.select().from(departments);
  console.log(dList);

  console.log("=== DOCTOR PROFILES ===");
  const docList = await db.select().from(doctorProfiles);
  console.log(docList);

  console.log("=== DOCTOR SCHEDULES ===");
  const schedList = await db.select().from(doctorSchedules);
  console.log(schedList);

  process.exit(0);
}

checkDb().catch((e) => {
  console.error(e);
  process.exit(1);
});
