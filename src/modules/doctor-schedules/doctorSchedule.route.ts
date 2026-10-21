import { Router } from "express";

import * as doctorScheduleController from "./doctorSchedule.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "DOCTOR"),
  doctorScheduleController.createDoctorSchedule
);

router.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "DOCTOR", "COORDINATOR", "PATIENT"),
  doctorScheduleController.getDoctorSchedules
);

router.get(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "DOCTOR", "COORDINATOR", "PATIENT"),
  doctorScheduleController.getDoctorScheduleById
);

router.put(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "DOCTOR"),
  doctorScheduleController.updateDoctorSchedule
);

router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "DOCTOR"),
  doctorScheduleController.deleteDoctorSchedule
);

export default router;