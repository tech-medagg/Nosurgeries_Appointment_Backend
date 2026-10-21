import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";
import "./relations";

const isNeon = !!process.env.DATABASE_URL?.includes("neon.tech");
const isProduction = process.env.NODE_ENV === "production";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isNeon || isProduction ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool, {
  schema,
});