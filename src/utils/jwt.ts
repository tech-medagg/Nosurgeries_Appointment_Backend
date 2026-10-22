import jwt from "jsonwebtoken";

// ─── Guard: never run with a missing / default secret ─────────────────────────
if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === "production") {
    console.error("❌ JWT_SECRET env var is not set. Refusing to start.");
    process.exit(1);
  }
  console.warn("⚠️  JWT_SECRET not set — using dev-only fallback. Set it before deploying.");
}

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-only-fallback-secret-do-not-use-in-prod";

const JWT_EXPIRES_IN =
  process.env.JWT_EXPIRES_IN ?? "1d";

export interface JwtTokenPayload {
  userId: string;
  roleId: string;
  roleName: string;
  email: string;
  fullName?: string;
  mobile?: string;
}

export const generateAccessToken = (
  payload: JwtTokenPayload
): string => {
  return jwt.sign(
    payload,
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN as any,
    }
  );
};

export const verifyAccessToken = (
  token: string
): JwtTokenPayload => {
  return jwt.verify(
    token,
    JWT_SECRET
  ) as JwtTokenPayload;
};