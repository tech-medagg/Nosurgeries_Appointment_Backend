import {
  CreateDoctorScheduleInput,
  UpdateDoctorScheduleInput,
  GetDoctorSchedulesQuery,
} from "./doctorSchedule.validation";

export type {
  CreateDoctorScheduleInput,
  UpdateDoctorScheduleInput,
  GetDoctorSchedulesQuery,
};

export interface DoctorScheduleResponse {
  id: string;

  doctorProfileId: string;

  dayOfWeek:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";

  startTime: string;

  endTime: string;

  slotDuration: number;

  maxPatients: number;

  isAvailable: boolean;

  createdAt: Date;

  updatedAt: Date;
}