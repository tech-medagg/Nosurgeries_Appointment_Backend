import { Router } from 'express';
import * as reportController from './report.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';
import { upload } from '../../utils/upload';

const router = Router();

// Patient / Doctor / Admin upload report / prescription
router.post(
  '/',
  authenticate,
  authorize('PATIENT', 'DOCTOR', 'ADMIN', 'SUPER_ADMIN'),
  (req, res, next) => {
    upload.single('file')(req, res, (err: any) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message || 'File upload failed' });
      }
      next();
    });
  },
  reportController.uploadReport
);

// Get own reports (patient)
router.get(
  '/me',
  authenticate,
  authorize('PATIENT'),
  reportController.getMyReports
);

// Admin view patient reports
router.get(
  '/admin/patients/:patientId',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  reportController.getPatientReportsAdmin
);

// Admin view appointment reports
router.get(
  '/admin/appointments/:appointmentId',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN', 'DOCTOR'),
  reportController.getAppointmentReportsAdmin
);

// Doctor view appointment reports (only if assigned)
router.get(
  '/doctor/appointments/:appointmentId',
  authenticate,
  authorize('DOCTOR', 'ADMIN', 'SUPER_ADMIN'),
  reportController.getAppointmentReportsDoctor
);

export default router;
