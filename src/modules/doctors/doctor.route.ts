import { Router } from "express";

import * as doctorController from "./doctor.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";

const router = Router();

/* ======================================================
   Create Doctor
====================================================== */

router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  doctorController.createDoctor
);

/* ======================================================
   Get All Doctors
====================================================== */

router.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  doctorController.getDoctors
);

/* ======================================================
   Get Doctor By Id
====================================================== */

router.get(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  doctorController.getDoctorById
);

/* ======================================================
   Update Doctor
====================================================== */

router.put(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  doctorController.updateDoctor
);

/* ======================================================
   Delete Doctor
====================================================== */

router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  doctorController.deleteDoctor
);

export default router;