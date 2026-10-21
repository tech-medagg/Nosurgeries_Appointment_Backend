import { Request, Response } from "express";

import * as appointmentService from "./appointment.service";

import {
  createAppointmentSchema,
  updateAppointmentSchema,
  getAppointmentsSchema,
  getDoctorAvailabilitySchema,
} from "./appointment.validation";

/* ======================================================
   Create Appointment
====================================================== */

export const createAppointment = async (
  req: Request,
  res: Response
) => {
  try {
    const data = createAppointmentSchema.parse(
      req.body
    );

    const result =
      await appointmentService.createAppointment(
        data
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
   Get Appointment By Id
====================================================== */

export const getAppointmentById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required.",
      });
    }

    const result =
      await appointmentService.getAppointmentById(
        id
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
   Get All Appointments
====================================================== */

export const getAppointments = async (
  req: Request,
  res: Response
) => {
  try {
    const query =
      getAppointmentsSchema.parse(req.query);

    const user = (req as any).user;
    const userRole = user?.roleName;

    const result =
      await appointmentService.getAppointments(
        query,
        userRole
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
   Update Appointment
====================================================== */

export const updateAppointment = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required.",
      });
    }

    const data =
      updateAppointmentSchema.parse(
        req.body
      );

    const result =
      await appointmentService.updateAppointment(
        id,
        data
      );

    return res
      .status(result.success ? 200 : 400)
      .json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   Delete Appointment
====================================================== */

export const deleteAppointment = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required.",
      });
    }

    const result =
      await appointmentService.deleteAppointment(
        id
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
   Get Doctor Availability
====================================================== */

export const getDoctorAvailability = async (
  req: Request,
  res: Response
) => {
  try {
    const query =
      getDoctorAvailabilitySchema.parse(
        req.query
      );

    const result =
      await appointmentService.getAvailableDoctors(
        query.hospitalId,
        query.departmentId,
        query.appointmentDate
      );

    return res
      .status(result.success ? 200 : 400)
      .json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};