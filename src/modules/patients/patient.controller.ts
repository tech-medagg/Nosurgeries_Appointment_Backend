import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import * as patientService from "./patient.service";

import {
  createPatientSchema,
  updatePatientSchema,
  getPatientsSchema,
} from "./patient.validation";
import {
  createMyPatientProfileSchema,
  updateMyPatientProfileSchema,
} from "./patient.validation";
/* ======================================================
   Create Patient
====================================================== */

export const createPatient = async (
  req: Request,
  res: Response
) => {
  try {
    const body =
      createPatientSchema.parse(req.body);

    const result =
      await patientService.createPatient(
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
   Get All Patients
====================================================== */

export const getPatients = async (
  req: Request,
  res: Response
) => {
  try {
    const query =
      getPatientsSchema.parse(req.query);

    const result =
      await patientService.getPatients(
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
   Get Logged-in Patient Profile
====================================================== */

export const getMyPatientProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result =
      await patientService.getPatientByUserId(
        userId
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
   Get My Patient Profile
====================================================== */

export const getMyProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user not found.",
      });
    }

    const result =
      await patientService.getMyProfile(
        userId
      );

    return res
      .status(result.success ? 200 : 404)
      .json(result);
  } catch (error: any) {
    console.error(
      "GET MY PATIENT PROFILE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   Create My Patient Profile
====================================================== */

export const createMyProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user not found.",
      });
    }

    const body =
      createMyPatientProfileSchema.parse(
        req.body
      );

    const result =
      await patientService.createMyProfile(
        userId,
        body
      );

    return res
      .status(result.success ? 201 : 409)
      .json(result);
  } catch (error: any) {
    console.error(
      "CREATE MY PATIENT PROFILE ERROR:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   Update My Patient Profile
====================================================== */

export const updateMyProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user not found.",
      });
    }

    const body =
      updateMyPatientProfileSchema.parse(
        req.body
      );

    const result =
      await patientService.updateMyProfile(
        userId,
        body
      );

    return res
      .status(result.success ? 200 : 404)
      .json(result);
  } catch (error: any) {
    console.error(
      "UPDATE MY PATIENT PROFILE ERROR:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   Get Patient By Id
====================================================== */

export const getPatientById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required.",
      });
    }

    const result =
      await patientService.getPatientById(id);

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
   Update Patient
====================================================== */

export const updatePatient = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required.",
      });
    }

    const body =
      updatePatientSchema.parse(req.body);

    const result =
      await patientService.updatePatient(
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
   Delete Patient
====================================================== */

export const deletePatient = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required.",
      });
    }

    const result =
      await patientService.deletePatient(id);

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