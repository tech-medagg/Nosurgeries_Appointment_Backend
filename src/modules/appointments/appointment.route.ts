import { Router } from "express";

import * as appointmentController from "./appointment.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";

const router = Router();

/* ======================================================
   Create Appointment
   Patient/Admin can create appointment request
====================================================== */

router.post(
  "/",
  authenticate,
  authorize(
    "SUPER_ADMIN",
    "ADMIN",
    "PATIENT"
  ),
  appointmentController.createAppointment
);

/* ======================================================
   Get All Appointments
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
  appointmentController.getAppointments
);

/* ======================================================
   Get DoctorAvailability By ID
====================================================== */

router.get(
  "/availability",
  authenticate,
  authorize(
    "SUPER_ADMIN",
    "ADMIN",
    "COORDINATOR"
  ),
  appointmentController.getDoctorAvailability
);

/* ======================================================
   Get Appointment By ID
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
  appointmentController.getAppointmentById
);

/* ======================================================
   Update Appointment
   Mainly used by Admin for:
   - Assigning doctor
   - Confirming appointment
   - Rescheduling
   - Cancelling
====================================================== */

router.put(
  "/:id",
  authenticate,
  authorize(
    "SUPER_ADMIN",
    "ADMIN",
    "COORDINATOR"
  ),
  appointmentController.updateAppointment
);

/* ======================================================
   Delete Appointment
====================================================== */

router.delete(
  "/:id",
  authenticate,
  authorize(
    "SUPER_ADMIN",
    "ADMIN"
  ),
  appointmentController.deleteAppointment
);

export default router;