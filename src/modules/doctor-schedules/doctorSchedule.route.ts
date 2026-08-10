import { Router } from "express";

import * as doctorScheduleController from "./doctorSchedule.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  doctorScheduleController.createDoctorSchedule
);

router.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  doctorScheduleController.getDoctorSchedules
);

router.get(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  doctorScheduleController.getDoctorScheduleById
);

router.put(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  doctorScheduleController.updateDoctorSchedule
);

router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  doctorScheduleController.deleteDoctorSchedule
);

export default router;