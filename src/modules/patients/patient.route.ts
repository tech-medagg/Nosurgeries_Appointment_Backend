import { Router } from "express";

import * as patientController from "./patient.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";

const router = Router();

/* ======================================================
   Create Patient
====================================================== */

router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  patientController.createPatient
);

/* ======================================================
   Get All Patients
====================================================== */

router.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  patientController.getPatients
);

/* ======================================================
   Get Patient By Id
====================================================== */

router.get(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  patientController.getPatientById
);

/* ======================================================
   Update Patient
====================================================== */

router.put(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
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