import {
  CreateDoctorInput,
  UpdateDoctorInput,
  GetDoctorsQuery,
} from "./doctor.validation";

export type {
  CreateDoctorInput,
  UpdateDoctorInput,
  GetDoctorsQuery,
};

export interface DoctorResponse {
  id: string;

  userId: string;

  hospitalId: string;

  departmentId: string;

  firstName: string;

  lastName: string | null;

  gender: "MALE" | "FEMALE" | "OTHER" | null;

  dateOfBirth: Date | null;

  profileImage: string | null;

  qualification: string;

  specialization: string;

  registrationNumber: string | null;

  experienceYears: number;

  consultationFee: number | null;

  languages: string | null;

  biography: string | null;

  isAvailable: boolean;

  status: "ACTIVE" | "INACTIVE";

  hospitalName?: string;

  departmentName?: string;

  email?: string;

  mobile?: string;

  createdAt: Date;

  updatedAt: Date;
}