import { Request, Response } from "express";

import * as departmentService from "./department.service";

import {
  createDepartmentSchema,
  updateDepartmentSchema,
  getDepartmentsSchema,
} from "./department.validation";

const getId = (req: Request): string | null => {
  const id = req.params.id;

  if (!id) {
    return null;
  }

  return id;
};

/* ===================================================== */

export const createDepartment = async (
  req: Request,
  res: Response
) => {
  try {
    const body =
      createDepartmentSchema.parse(req.body);

    const result =
      await departmentService.createDepartment(body);

    return res
      .status(result.success ? 201 : 400)
      .json(result);

  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===================================================== */

export const getDepartments = async (
  req: Request,
  res: Response
) => {
  try {

    const query =
      getDepartmentsSchema.parse(req.query);

    const result =
      await departmentService.getDepartments(query);

    return res.status(200).json(result);

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

/* ===================================================== */

export const getDepartmentById = async (
  req: Request,
  res: Response
) => {

  const id = getId(req);

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Department id is required",
    });
  }

  const result =
    await departmentService.getDepartmentById(id);

  return res
    .status(result.success ? 200 : 404)
    .json(result);
};

/* ===================================================== */

export const updateDepartment = async (
  req: Request,
  res: Response
) => {

  try {

    const id = getId(req);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Department id is required",
      });
    }

    const body =
      updateDepartmentSchema.parse(req.body);

    const result =
      await departmentService.updateDepartment(
        id,
        body
      );

    return res
      .status(result.success ? 200 : 404)
      .json(result);

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};

/* ===================================================== */

export const deleteDepartment = async (
  req: Request,
  res: Response
) => {

  const id = getId(req);

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Department id is required",
    });
  }

  const result =
    await departmentService.deleteDepartment(id);

  return res
    .status(result.success ? 200 : 404)
    .json(result);

};