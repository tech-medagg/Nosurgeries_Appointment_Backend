import * as doctorRepository from "./doctor.repository";

import {
  CreateDoctorInput,
  UpdateDoctorInput,
  GetDoctorsQuery,
} from "./doctor.validation";

/* ======================================================
   Create Doctor
====================================================== */

export const createDoctor = async (
  data: CreateDoctorInput
) => {
  const existingUser =
    await doctorRepository.findByUserId(
      data.userId
    );

  if (existingUser) {
    return {
      success: false,
      message:
        "Doctor profile already exists for this user.",
    };
  }

  const existingRegistration =
    await doctorRepository.findByRegistrationNumber(
      data.registrationNumber
    );

  if (existingRegistration) {
    return {
      success: false,
      message:
        "Registration number already exists.",
    };
  }

  const doctor =
    await doctorRepository.create(data);

  return {
    success: true,
    message:
      "Doctor created successfully.",
    data: doctor,
  };
};

/* ======================================================
   Get All Doctors
====================================================== */

export const getDoctors = async (
  query: GetDoctorsQuery
) => {
  const result =
    await doctorRepository.getAll(query);

  return {
    success: true,
    message:
      "Doctors fetched successfully.",
    data: result.doctors,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages:
        result.totalPages,
    },
  };
};

/* ======================================================
   Get Doctor By Id
====================================================== */

export const getDoctorById = async (
  id: string
) => {
  const doctor =
    await doctorRepository.findById(id);

  if (!doctor) {
    return {
      success: false,
      message:
        "Doctor not found.",
    };
  }

  return {
    success: true,
    data: doctor,
  };
};

/* ======================================================
   Update Doctor
====================================================== */

export const updateDoctor = async (
  id: string,
  data: UpdateDoctorInput
) => {
  const doctor =
    await doctorRepository.findById(id);

  if (!doctor) {
    return {
      success: false,
      message:
        "Doctor not found.",
    };
  }

  if (
    data.registrationNumber &&
    data.registrationNumber !==
      doctor.registrationNumber
  ) {
    const exists =
      await doctorRepository.findByRegistrationNumber(
        data.registrationNumber
      );

    if (exists) {
      return {
        success: false,
        message:
          "Registration number already exists.",
      };
    }
  }

  const updated =
    await doctorRepository.update(
      id,
      data
    );

  return {
    success: true,
    message:
      "Doctor updated successfully.",
    data: updated,
  };
};

/* ======================================================
   Delete Doctor
====================================================== */

export const deleteDoctor = async (
  id: string
) => {
  const doctor =
    await doctorRepository.findById(id);

  if (!doctor) {
    return {
      success: false,
      message:
        "Doctor not found.",
    };
  }

  await doctorRepository.remove(id);

  return {
    success: true,
    message:
      "Doctor deleted successfully.",
  };
};