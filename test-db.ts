import "dotenv/config";
import { Client } from "pg";

async function test() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("✅ Connected successfully");
    await client.end();
  } catch (err) {
    console.error(err);
  }
}

test();