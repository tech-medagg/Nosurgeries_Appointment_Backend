import * as patientRepository from "./patient.repository";

import {
  CreatePatientInput,
  UpdatePatientInput,
  GetPatientsQuery,
} from "./patient.validation";
import {
  CreateMyPatientProfileInput,
  UpdateMyPatientProfileInput,
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

/* ======================================================
   Get Patient By User Id
====================================================== */

export const getPatientByUserId = async (
  userId: string
) => {
  const patient =
    await patientRepository.findByUserId(
      userId
    );

  if (!patient) {
    return {
      success: false,
      message: "Patient profile not found.",
    };
  }

  return {
    success: true,
    data: patient,
  };
};

/* ======================================================
   Get My Patient Profile
====================================================== */

export const getMyProfile = async (
  userId: string
) => {
  let patient =
    await patientRepository.findMyProfile(
      userId
    );

  if (!patient) {
    const userRecord = await patientRepository.findUserById(userId);
    if (userRecord) {
      const nameParts = userRecord.fullName ? userRecord.fullName.trim().split(" ") : ["Patient"];
      const firstName = nameParts[0] || "Patient";
      const lastName = nameParts.slice(1).join(" ") || "";
      await patientRepository.createMyProfile(userId, {
        firstName,
        lastName,
        gender: "OTHER",
      } as any);
      patient = await patientRepository.findMyProfile(userId);
    }
  }

  if (!patient) {
    return {
      success: false,
      message: "Patient profile not found.",
    };
  }

  return {
    success: true,
    data: patient,
  };
};



/* ======================================================
   Create My Patient Profile
====================================================== */

export const createMyProfile = async (
  userId: string,
  data: CreateMyPatientProfileInput
) => {
  const existing =
    await patientRepository.findByUserId(
      userId
    );

  if (existing) {
    return {
      success: false,
      message: "Patient profile already exists.",
    };
  }

  const patient =
    await patientRepository.createMyProfile(
      userId,
      data
    );

  if (!patient) {
    return {
      success: false,
      message: "Failed to create patient profile.",
    };
  }

  return {
    success: true,
    message:
      "Patient profile created successfully.",
    data: patient,
  };
};

/* ======================================================
   Update My Patient Profile
====================================================== */

export const updateMyProfile = async (
  userId: string,
  data: UpdateMyPatientProfileInput
) => {
  const existing =
    await patientRepository.findByUserId(
      userId
    );

  if (!existing) {
    return {
      success: false,
      message: "Patient profile not found.",
    };
  }

  const patient =
    await patientRepository.updateMyProfile(
      userId,
      data
    );

  if (!patient) {
    return {
      success: false,
      message: "Failed to update patient profile.",
    };
  }

  return {
    success: true,
    message:
      "Patient profile updated successfully.",
    data: patient,
  };
};