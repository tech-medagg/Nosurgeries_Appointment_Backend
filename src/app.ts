import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";

import routes from "./routes";

// ─── Production safety check ─────────────────────────────────────────────────
// Crash fast if critical secrets are missing in production so we never serve
// with insecure defaults.
if (process.env.NODE_ENV === "production") {
  const required = ["JWT_SECRET", "DATABASE_URL", "ALLOWED_ORIGIN"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error(`❌ Missing required env vars: ${missing.join(", ")}`);
    process.exit(1);
  }
}

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
// In development: allow localhost (Vite default port).
// In production: restrict to the ALLOWED_ORIGIN env var (e.g. your Vercel URL).
const allowedOrigins = process.env.ALLOWED_ORIGIN
  ? process.env.ALLOWED_ORIGIN.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow same-origin requests (e.g. Postman, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: true,
  })
);

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

app.use("/api", routes);

export default app;