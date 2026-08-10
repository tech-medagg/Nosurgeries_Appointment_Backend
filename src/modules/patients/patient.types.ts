import {
  CreatePatientInput,
  UpdatePatientInput,
  GetPatientsQuery,
} from "./patient.validation";

export type {
  CreatePatientInput,
  UpdatePatientInput,
  GetPatientsQuery,
};

export interface PatientResponse {
  id: string;

  userId: string;

  fullName: string;

  email: string;

  mobile: string;

  firstName: string;

  lastName: string | null;

  gender:
    | "MALE"
    | "FEMALE"
    | "OTHER"
    | null;

  dateOfBirth: string | null;

  bloodGroup: string | null;

  language: string | null;

  profileImage: string | null;

  address: string | null;

  city: string | null;

  state: string | null;

  country: string | null;

  pincode: string | null;

  emergencyContact: string | null;

  emergencyContactName: string | null;

  medicalHistory: string | null;

  allergies: string | null;

  createdAt: Date;

  updatedAt: Date;
}