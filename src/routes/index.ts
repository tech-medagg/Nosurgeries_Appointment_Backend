import { Router } from "express";

import authRoutes from "../modules/auth/auth.route";
import departmentRoutes from "../modules/departments/department.route";
import hospitalRoutes from "../modules/hospitals/hospital.route";
import doctorRoutes from "../modules/doctors/doctor.route";
import doctorScheduleRoutes from "../modules/doctor-schedules/doctorSchedule.route";
import patientRoutes from "../modules/patients/patient.route";
import appointmentRoutes from "../modules/appointments/appointment.route";
import reportRoutes from "../modules/reports/report.route";
const router = Router();

router.use("/auth", authRoutes);
router.use("/departments", departmentRoutes);
router.use("/hospitals", hospitalRoutes);
router.use("/doctors", doctorRoutes);
router.use("/doctor-schedules", doctorScheduleRoutes);
router.use("/patients", patientRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/reports", reportRoutes);
export default router;