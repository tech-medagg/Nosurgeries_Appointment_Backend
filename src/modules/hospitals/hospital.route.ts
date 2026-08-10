import { Router } from "express";

import * as hospitalController from "./hospital.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";

const router = Router();

/* ==========================================================
   Create Hospital
========================================================== */

router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  hospitalController.createHospital
);

/* ==========================================================
   Get Hospitals
========================================================== */

router.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  hospitalController.getHospitals
);

/* ==========================================================
   Get Hospital By Id
========================================================== */

router.get(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  hospitalController.getHospitalById
);

/* ==========================================================
   Update Hospital
========================================================== */

router.put(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  hospitalController.updateHospital
);

/* ==========================================================
   Delete Hospital
========================================================== */

router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  hospitalController.deleteHospital
);

export default router;