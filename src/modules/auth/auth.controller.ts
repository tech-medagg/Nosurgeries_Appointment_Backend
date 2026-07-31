import { Request, Response } from "express";

import * as authService from "./auth.service";
import { registerSchema } from "./auth.validation";
import { loginSchema } from "./auth.validation";
import { AuthRequest } from "../../middleware/auth.middleware";

export const register = async (req: Request, res: Response) => {
    console.log(req.body);

    try {
        const validatedData = registerSchema.parse(req.body);

        const result = await authService.register(validatedData);

        return res.status(201).json(result);
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            error: error.message,
        });
    }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Validate request
    const validatedData = loginSchema.parse(req.body);

    // Call service
    const result = await authService.login(validatedData);

    if (!result.success) {
      return res.status(401).json(result);
    }

    return res.status(200).json(result);
  } catch (error: any) {
  console.error("FULL ERROR:");
  console.error(error);

  return res.status(500).json({
    success: false,
    message: error.message,
  });
}
};
export const me = async (
  req: AuthRequest,
  res: Response
) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
};