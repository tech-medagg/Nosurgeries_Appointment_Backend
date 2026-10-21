import { db } from "../../db";
import { medicalReports, appointments } from "../../db/schema";
import { eq } from "drizzle-orm";

export interface CreateReportData {
  patientId?: string | undefined;
  appointmentId?: string | undefined;
  category: any;
  fileName: string;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  uploadedBy?: string | undefined;
}

export const createReport = async (data: CreateReportData) => {
  try {
    const [report] = await db.insert(medicalReports).values({
      patientId: data.patientId!,
      appointmentId: data.appointmentId || null,
      fileName: data.fileName,
      originalFileName: data.originalFileName,
      fileType: data.fileType,
      fileSize: data.fileSize,
      fileUrl: data.fileUrl,
      category: data.category,
      uploadedBy: data.uploadedBy || data.patientId || null,
    }).returning();

    return { success: true, message: "Report uploaded successfully", data: report };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const getReportsByPatient = async (patientId: string) => {
  try {
    const reports = await db
      .select()
      .from(medicalReports)
      .where(eq(medicalReports.patientId, patientId));

    return { success: true, data: reports };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const getReportsByAppointment = async (appointmentId: string) => {
  try {
    const reports = await db
      .select()
      .from(medicalReports)
      .where(eq(medicalReports.appointmentId, appointmentId));

    return { success: true, data: reports };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const getReportsForDoctor = async (doctorId?: string, appointmentId?: string) => {
  try {
    if (!appointmentId) {
      return { success: false, message: "Appointment ID is required" };
    }

    // Only show reports on doctor side after admin has scheduled it (status is not PENDING)
    const [apt] = await db
      .select({ status: appointments.status })
      .from(appointments)
      .where(eq(appointments.id, appointmentId))
      .limit(1);

    if (!apt) {
      return { success: false, message: "Appointment not found" };
    }

    if (apt.status === "PENDING") {
      // Not scheduled yet
      return { success: true, data: [] };
    }

    return await getReportsByAppointment(appointmentId);
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
