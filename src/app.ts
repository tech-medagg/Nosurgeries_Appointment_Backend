import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";

import { pool } from "./db";
import routes from "./routes";

// ─── Production safety check ─────────────────────────────────────────────────
// Crash fast if critical secrets are missing in production so we never serve
// with insecure defaults.
if (process.env.NODE_ENV === "production") {
  const required = ["JWT_SECRET", "DATABASE_URL"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error(`❌ Missing required env vars: ${missing.join(", ")}`);
    process.exit(1);
  }
}

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
const rawAllowed = process.env.ALLOWED_ORIGIN || "";
const configuredOrigins = rawAllowed
  .split(",")
  .map((o) => o.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const isOriginAllowed = (origin: string): boolean => {
  const cleanOrigin = origin.replace(/\/+$/, "").toLowerCase();

  // If wildcard or explicitly in configured list
  if (
    configuredOrigins.includes("*") ||
    configuredOrigins.some((o) => o.toLowerCase() === cleanOrigin)
  ) {
    return true;
  }

  // Allow localhost & local network for development
  if (
    cleanOrigin.startsWith("http://localhost:") ||
    cleanOrigin.startsWith("http://127.0.0.1:")
  ) {
    return true;
  }

  // Allow all Vercel domains (*.vercel.app)
  if (/^https:\/\/[a-z0-9-_.]+\.vercel\.app$/i.test(cleanOrigin)) {
    return true;
  }

  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (isOriginAllowed(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

app.get("/health", async (_req, res) => {
  try {
    const dbRes = await pool.query("SELECT current_database(), current_user");
    const countRes = await pool.query("SELECT COUNT(*) FROM users");
    res.json({
      status: "ok",
      db: dbRes.rows[0],
      userCount: countRes.rows[0].count,
    });
  } catch (err: any) {
    const dbUrl = process.env.DATABASE_URL || "";
    const maskedUrl = dbUrl.includes("@")
      ? `${dbUrl.split("@")[0]?.replace(/:[^:]*$/, ":***")}@${dbUrl.split("@")[1] || ""}`
      : dbUrl
      ? "SET_WITHOUT_AT_SYMBOL"
      : "NOT_SET";
    res.status(500).json({
      status: "error",
      database_url_configured: maskedUrl,
      message: err?.message || String(err),
      code: err?.code,
      stack: err?.stack,
    });
  }
});

app.use("/api", routes);

export default app;