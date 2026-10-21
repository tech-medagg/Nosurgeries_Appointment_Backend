import { Router } from "express";

import * as doctorController from "./doctor.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";

const router = Router();

/* ======================================================
   Get My Doctor Profile (Logged-in Doctor)
====================================================== */

router.get(
  "/me",
  authenticate,
  authorize("DOCTOR"),
  doctorController.getMyDoctorProfile
);

/* ======================================================
   Create Doctor (Admin Only)
====================================================== */

router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  doctorController.createDoctor
);

/* ======================================================
   Get All Doctors (All Roles)
====================================================== */

router.get(
  "/",
  authenticate,
  authorize(
    "SUPER_ADMIN",
    "ADMIN",
    "DOCTOR",
    "COORDINATOR",
    "PATIENT"
  ),
  doctorController.getDoctors
);

/* ======================================================
   Get Doctor By Id (All Roles)
====================================================== */

router.get(
  "/:id",
  authenticate,
  authorize(
    "SUPER_ADMIN",
    "ADMIN",
    "DOCTOR",
    "COORDINATOR",
    "PATIENT"
  ),
  doctorController.getDoctorById
);

/* ======================================================
   Update Doctor (Admin Only)
====================================================== */

router.put(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "DOCTOR"),
  doctorController.updateDoctor
);

/* ======================================================
   Delete Doctor (Admin Only)
====================================================== */

router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  doctorController.deleteDoctor
);

export default router;