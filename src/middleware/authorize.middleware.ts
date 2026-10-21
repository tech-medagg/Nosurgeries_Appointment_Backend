import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "./auth.middleware";

export const authorize =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as AuthRequest).user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const userRole = user.roleName ? user.roleName.toUpperCase() : "";
      const normalizedAllowedRoles = allowedRoles.map((role) => role.toUpperCase());

      if (!userRole || !normalizedAllowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden: You don't have permission to access this resource",
        });
      }

      next();
    } catch {
      return res.status(500).json({
        success: false,
        message: "Authorization failed",
      });
    }
  };