import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware";

export const authorize =
  (...allowedRoles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!allowedRoles.includes(user.roleName)) {
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