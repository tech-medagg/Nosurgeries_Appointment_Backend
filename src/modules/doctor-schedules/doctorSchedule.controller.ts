import { Request, Response } from "express";

import * as doctorScheduleService from "./doctorSchedule.service";

import {
  createDoctorScheduleSchema,
  updateDoctorScheduleSchema,
  getDoctorSchedulesSchema,
} from "./doctorSchedule.validation";

/* ======================================================
   Create
====================================================== */

export const createDoctorSchedule = async (
  req: Request,
  res: Response
) => {
  try {
    const body =
      createDoctorScheduleSchema.parse(req.body);

    const result =
      await doctorScheduleService.createDoctorSchedule(
        body
      );

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
   Get All
====================================================== */

export const getDoctorSchedules = async (
  req: Request,
  res: Response
) => {
  try {
    const query =
      getDoctorSchedulesSchema.parse(req.query);

    const result =
      await doctorScheduleService.getDoctorSchedules(
        query
      );

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   Get By Id
====================================================== */

export const getDoctorScheduleById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Schedule ID is required.",
      });
    }

    const result =
      await doctorScheduleService.getDoctorScheduleById(
        id
      );

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
   Update
====================================================== */

export const updateDoctorSchedule = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Schedule ID is required.",
      });
    }

    const body =
      updateDoctorScheduleSchema.parse(req.body);

    const result =
      await doctorScheduleService.updateDoctorSchedule(
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
   Delete
====================================================== */

export const deleteDoctorSchedule = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Schedule ID is required.",
      });
    }

    const result =
      await doctorScheduleService.deleteDoctorSchedule(
        id
      );

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