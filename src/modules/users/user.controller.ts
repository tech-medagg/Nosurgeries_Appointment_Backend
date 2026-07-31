import { Request, Response } from "express";

import * as userService from "./user.service";
import { getUsersSchema } from "./user.validation";

export const getAllUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const query = getUsersSchema.parse(req.query);

    const result = await userService.getAllUsers(query);

    return res.status(200).json(result);
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message ?? "Failed to fetch users",
    });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    const result = await userService.getUserById(id);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message ?? "Failed to fetch user",
    });
  }
};