import { Router } from "express";

import * as hospitalController from "./hospital.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";

const router = Router();

/* ==========================================================
   Create Hospital (Admin Only)
========================================================== */

router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  hospitalController.createHospital
);

/* ==========================================================
   Get Hospitals (All Roles)
========================================================== */

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
  hospitalController.getHospitals
);

/* ==========================================================
   Get Hospital By Id (All Roles)
========================================================== */

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
  hospitalController.getHospitalById
);

/* ==========================================================
   Update Hospital (Admin Only)
========================================================== */

router.put(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  hospitalController.updateHospital
);

/* ==========================================================
   Delete Hospital (Admin Only)
========================================================== */

router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  hospitalController.deleteHospital
);

export default router;