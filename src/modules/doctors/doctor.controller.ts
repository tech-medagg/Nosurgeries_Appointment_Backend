import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";

import * as doctorService from "./doctor.service";

import {
  createDoctorSchema,
  updateDoctorSchema,
  getDoctorsSchema,
} from "./doctor.validation";

const getId = (req: Request): string | null => {
  const id = req.params.id;

  if (!id) {
    return null;
  }

  return id;
};

/* ======================================================
   Get My Doctor Profile (for logged-in DOCTOR)
====================================================== */

export const getMyDoctorProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const result =
      await doctorService.getDoctorByUserId(userId);

    return res
      .status(result.success ? 200 : 404)
      .json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   Create Doctor
====================================================== */

export const createDoctor = async (
  req: Request,
  res: Response
) => {
  try {
    const body =
      createDoctorSchema.parse(req.body);

    const result =
      await doctorService.createDoctor(body);

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

/* ======================================================
   Get All Doctors
====================================================== */

export const getDoctors = async (
  req: Request,
  res: Response
) => {
  try {
    const query =
      getDoctorsSchema.parse(req.query);

    const result =
      await doctorService.getDoctors(query);

    return res.status(200).json(result);

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

/* ======================================================
   Get Doctor By Id
====================================================== */

export const getDoctorById = async (
  req: Request,
  res: Response
) => {

  const id = getId(req);

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Doctor id is required",
    });
  }

  const result =
    await doctorService.getDoctorById(id);

  return res
    .status(result.success ? 200 : 404)
    .json(result);
};

/* ======================================================
   Update Doctor
====================================================== */

export const updateDoctor = async (
  req: Request,
  res: Response
) => {

  try {

    const id = getId(req);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Doctor id is required",
      });
    }

    const body =
      updateDoctorSchema.parse(req.body);

    const result =
      await doctorService.updateDoctor(
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

/* ======================================================
   Delete Doctor
====================================================== */

export const deleteDoctor = async (
  req: Request,
  res: Response
) => {

  const id = getId(req);

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Doctor id is required",
    });
  }

  const result =
    await doctorService.deleteDoctor(id);

  return res
    .status(result.success ? 200 : 404)
    .json(result);
};