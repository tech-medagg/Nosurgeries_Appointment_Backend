import { db } from "../db";
import { appointments } from "../db/schema/appointments";

async function clearAppointments() {
  try {
    console.log("🧹 Clearing all appointments records...");
    await db.delete(appointments);
    console.log("✅ All appointments cleared successfully!");
  } catch (error) {
    console.error("❌ Failed to clear appointments:", error);
  }
  process.exit(0);
}

clearAppointments();
