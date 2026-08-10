import * as patientRepository from "./patient.repository";

import {
  CreatePatientInput,
  UpdatePatientInput,
  GetPatientsQuery,
} from "./patient.validation";

/* ======================================================
   Create Patient
====================================================== */

export const createPatient = async (
  data: CreatePatientInput
) => {
  const emailExists =
    await patientRepository.findByEmail(
      data.email
    );

  if (emailExists) {
    return {
      success: false,
      message: "Email already exists.",
    };
  }

  const mobileExists =
    await patientRepository.findByMobile(
      data.mobile
    );

  if (mobileExists) {
    return {
      success: false,
      message: "Mobile number already exists.",
    };
  }

  const patient =
    await patientRepository.create(data);

  return {
    success: true,
    message:
      "Patient created successfully.",
    data: patient,
  };
};

/* ======================================================
   Get All Patients
====================================================== */

export const getPatients = async (
  query: GetPatientsQuery
) => {
  const result =
    await patientRepository.getAll(query);

  return {
    success: true,
    data: result.patients,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    },
  };
};

/* ======================================================
   Get Patient By Id
====================================================== */

export const getPatientById = async (
  id: string
) => {
  const patient =
    await patientRepository.findById(id);

  if (!patient) {
    return {
      success: false,
      message: "Patient not found.",
    };
  }

  return {
    success: true,
    data: patient,
  };
};

/* ======================================================
   Update Patient
====================================================== */

export const updatePatient = async (
  id: string,
  data: UpdatePatientInput
) => {
  const patient =
    await patientRepository.findById(id);

  if (!patient) {
    return {
      success: false,
      message: "Patient not found.",
    };
  }

  const updated =
    await patientRepository.update(
      id,
      data
    );

  return {
    success: true,
    message:
      "Patient updated successfully.",
    data: updated,
  };
};

/* ======================================================
   Delete Patient
====================================================== */

export const deletePatient = async (
  id: string
) => {
  const patient =
    await patientRepository.findById(id);

  if (!patient) {
    return {
      success: false,
      message: "Patient not found.",
    };
  }

  await patientRepository.remove(id);

  return {
    success: true,
    message:
      "Patient deleted successfully.",
  };
};