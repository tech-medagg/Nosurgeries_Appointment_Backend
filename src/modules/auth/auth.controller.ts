import { Request, Response } from "express";

import * as authService from "./auth.service";
import { registerSchema } from "./auth.validation";

export const register = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);

    // Register user
    const result = await authService.register(validatedData);

    if (!result.success) {
      return res.status(409).json(result);
    }

    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error.message,
    });
  }
};