import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "super-secret-key";

const JWT_EXPIRES_IN =
  process.env.JWT_EXPIRES_IN ?? "1d";

export interface JwtTokenPayload {
  userId: string;
  roleId: string;
  roleName: string;
  email: string;
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