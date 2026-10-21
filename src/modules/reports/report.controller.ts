import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as reportService from './report.service';
import { uploadReportSchema } from './report.validation';
import { db } from '../../db';
import { patientProfiles } from '../../db/schema/patient-profiles';
import { appointments } from '../../db/schema/appointments';
import { eq } from 'drizzle-orm';

// Patient uploads a report
export const uploadReport = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    let patientProfileId = req.body.patientId;

    if (!patientProfileId && req.body.appointmentId) {
      const apt = await db
        .select({ patientId: appointments.patientId })
        .from(appointments)
        .where(eq(appointments.id, req.body.appointmentId))
        .limit(1);
      if (apt.length > 0 && apt[0]) {
        patientProfileId = apt[0].patientId;
      }
    }

    if (!patientProfileId) {
      const profile = await db
        .select({ id: patientProfiles.id })
        .from(patientProfiles)
        .where(eq(patientProfiles.userId, userId))
        .limit(1);
      if (profile.length > 0 && profile[0]) {
        patientProfileId = profile[0].id;
      }
    }

    if (!patientProfileId) {
      return res.status(400).json({ success: false, message: 'Patient profile not found.' });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'File is required' });
    }

    const category = req.body.category || 'OTHER';

    // Build metadata for service
    const reportData = {
      patientId: patientProfileId,
      appointmentId: req.body.appointmentId || undefined,
      category,
      fileName: file.filename,
      originalFileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      fileUrl: `/uploads/${file.filename}`,
      uploadedBy: userId,
    };
    const result = await reportService.createReport(reportData);
    return res.status(result.success ? 201 : 400).json(result);
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// Patient gets own reports
export const getMyReports = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const profile = await db
      .select({ id: patientProfiles.id })
      .from(patientProfiles)
      .where(eq(patientProfiles.userId, userId))
      .limit(1);
    if (!profile.length || !profile[0]) {
      return res.status(200).json({ success: true, data: [] });
    }
    const result = await reportService.getReportsByPatient(profile[0].id);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// Admin view reports for a patient
export const getPatientReportsAdmin = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    if (!patientId) {
      return res.status(400).json({ success: false, message: 'Patient ID is required' });
    }
    const result = await reportService.getReportsByPatient(patientId);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// Admin view reports for an appointment
export const getAppointmentReportsAdmin = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.params;
    if (!appointmentId) {
      return res.status(400).json({ success: false, message: 'Appointment ID is required' });
    }
    const result = await reportService.getReportsByAppointment(appointmentId);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// Doctor view reports for an appointment (if assigned)
export const getAppointmentReportsDoctor = async (req: AuthRequest, res: Response) => {
  try {
    const doctorId = req.user?.userId; // doctor user ID
    const { appointmentId } = req.params;
    if (!doctorId || !appointmentId) {
      return res.status(400).json({ success: false, message: 'Doctor ID and Appointment ID are required' });
    }
    // Verify doctor is assigned to appointment inside service
    const result = await reportService.getReportsForDoctor(doctorId, appointmentId);
    if (!result.success) {
      return res.status(403).json(result);
    }
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
