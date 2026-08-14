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

  doctorProfileId: string;

  appointmentDate: Date;

  appointmentTime: string | null;

  consultationFee: number | null;

  notes: string | null;

  status:
    | "PENDING"
    | "CONFIRMED"
    | "CHECKED_IN"
    | "COMPLETED"
    | "CANCELLED"
    | "RESCHEDULED";

  createdAt: Date;

  updatedAt: Date;
}

export interface DoctorAvailability {
  doctorProfileId: string;

  firstName: string;

  lastName: string | null;

  doctorName: string;

  dayOfWeek: string;

  startTime: string;

  endTime: string;

  slotDuration: number;

  maxPatients: number;

  bookedPatients: number;

  availableSlots: string[];
}