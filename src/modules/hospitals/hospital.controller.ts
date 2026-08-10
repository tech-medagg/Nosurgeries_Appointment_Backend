import { Request, Response } from "express";

import * as hospitalService from "./hospital.service";

import {
  createHospitalSchema,
  updateHospitalSchema,
  getHospitalsSchema,
} from "./hospital.validation";

const getId = (req: Request): string | null => {
  const id = req.params.id;

  if (!id) {
    return null;
  }

  return id;
};

/* ==========================================================
   Create Hospital
========================================================== */

export const createHospital = async (
  req: Request,
  res: Response
) => {
  try {
    const body = createHospitalSchema.parse(req.body);

    const result =
      await hospitalService.createHospital(body);

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

/* ==========================================================
   Get Hospitals
========================================================== */

export const getHospitals = async (
  req: Request,
  res: Response
) => {
  try {
    const query =
      getHospitalsSchema.parse(req.query);

    const result =
      await hospitalService.getHospitals(query);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   Get Hospital By Id
========================================================== */

export const getHospitalById = async (
  req: Request,
  res: Response
) => {
  const id = getId(req);

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Hospital id is required",
    });
  }

  const result =
    await hospitalService.getHospitalById(id);

  return res
    .status(result.success ? 200 : 404)
    .json(result);
};

/* ==========================================================
   Update Hospital
========================================================== */

export const updateHospital = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getId(req);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Hospital id is required",
      });
    }

    const body =
      updateHospitalSchema.parse(req.body);

    const result =
      await hospitalService.updateHospital(
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

/* ==========================================================
   Delete Hospital
========================================================== */

export const deleteHospital = async (
  req: Request,
  res: Response
) => {
  const id = getId(req);

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Hospital id is required",
    });
  }

  const result =
    await hospitalService.deleteHospital(id);

  return res
    .status(result.success ? 200 : 404)
    .json(result);
};