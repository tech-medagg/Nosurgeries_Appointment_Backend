import dotenv from "dotenv";
import app from "./app";
import { initDatabase } from "./db/init";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  try {
    await initDatabase();
  } catch (err) {
    console.error("Failed to initialize database on startup:", err);
  }
});