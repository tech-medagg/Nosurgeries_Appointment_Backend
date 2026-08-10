import {
  CreateAppointmentInput,
  UpdateAppointmentInput,
  GetAppointmentsQuery,
} from "./appointment.validation";

export type {
  CreateAppointmentInput,
  UpdateAppointmentInput,
  GetAppointmentsQuery,
};

export interface AppointmentResponse {
  id: string;

  patientId: string;

  hospitalId: string;

  departmentId: string;

  doctorProfileId: string | null;

  appointmentDate: Date;

  appointmentTime: string;

  consultationType: string;

  symptoms: string | null;

  notes: string | null;

  tokenNumber: number | null;

  status:
    | "PENDING"
    | "CONFIRMED"
    | "CHECKED_IN"
    | "COMPLETED"
    | "CANCELLED"
    | "NO_SHOW";

  createdAt: Date;

  updatedAt: Date;
}

export interface DoctorAvailability {
  doctorProfileId: string;
  doctorName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  slotDuration: number;
  maxPatients: number;
  bookedPatients: number;
  availableSlots: number;
}