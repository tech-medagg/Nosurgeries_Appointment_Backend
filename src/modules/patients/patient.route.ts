import { Router } from "express";

import * as patientController from "./patient.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";

const router = Router();

/* ======================================================
   My Patient Profile
====================================================== */

router.get(
  "/me",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "COORDINATOR", "PATIENT"),
  patientController.getMyProfile
);

router.post(
  "/me",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "COORDINATOR", "PATIENT"),
  patientController.createMyProfile
);

router.put(
  "/me",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "COORDINATOR", "PATIENT"),
  patientController.updateMyProfile
);

/* ======================================================
   Create Patient (Admin)
====================================================== */

router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "COORDINATOR"),
  patientController.createPatient
);

/* ======================================================
   Get All Patients (Admin)
====================================================== */

router.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "COORDINATOR"),
  patientController.getPatients
);

/* ======================================================
   Get Patient By Id
====================================================== */

router.get(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "COORDINATOR", "PATIENT"),
  patientController.getPatientById
);

/* ======================================================
   Update Patient
====================================================== */

router.put(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "COORDINATOR"),
  patientController.updatePatient
);

/* ======================================================
   Delete Patient
====================================================== */

router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  patientController.deletePatient
);

export default router;