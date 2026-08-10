import * as hospitalRepository from "./hospital.repository";

import {
  CreateHospitalInput,
  UpdateHospitalInput,
  GetHospitalsQuery,
} from "./hospital.validation";

/* ==========================================================
   Create Hospital
========================================================== */

export const createHospital = async (
  data: CreateHospitalInput
) => {
  const existingName =
    await hospitalRepository.findByName(data.name);

  if (existingName) {
    return {
      success: false,
      message: "Hospital name already exists",
    };
  }

  if (data.email) {
    const existingEmail =
      await hospitalRepository.findByEmail(data.email);

    if (existingEmail) {
      return {
        success: false,
        message: "Hospital email already exists",
      };
    }
  }

  const hospital =
    await hospitalRepository.create(data);

  return {
    success: true,
    message: "Hospital created successfully",
    data: hospital,
  };
};

/* ==========================================================
   Get All Hospitals
========================================================== */

export const getHospitals = async (
  params: GetHospitalsQuery
) => {
  const result =
    await hospitalRepository.getAll(params);

  return {
    success: true,
    message: "Hospitals fetched successfully",
    data: result.hospitals,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    },
  };
};

/* ==========================================================
   Get Hospital By Id
========================================================== */

export const getHospitalById = async (
  id: string
) => {
  const hospital =
    await hospitalRepository.findById(id);

  if (!hospital) {
    return {
      success: false,
      message: "Hospital not found",
    };
  }

  return {
    success: true,
    message: "Hospital fetched successfully",
    data: hospital,
  };
};

/* ==========================================================
   Update Hospital
========================================================== */

export const updateHospital = async (
  id: string,
  data: UpdateHospitalInput
) => {
  const hospital =
    await hospitalRepository.findById(id);

  if (!hospital) {
    return {
      success: false,
      message: "Hospital not found",
    };
  }

  if (
    data.name &&
    data.name !== hospital.name
  ) {
    const existing =
      await hospitalRepository.findByName(
        data.name
      );

    if (existing) {
      return {
        success: false,
        message: "Hospital name already exists",
      };
    }
  }

  if (
    data.email &&
    data.email !== hospital.email
  ) {
    const existing =
      await hospitalRepository.findByEmail(
        data.email
      );

    if (existing) {
      return {
        success: false,
        message: "Hospital email already exists",
      };
    }
  }

  const updated =
    await hospitalRepository.update(
      id,
      data
    );

  return {
    success: true,
    message: "Hospital updated successfully",
    data: updated,
  };
};

/* ==========================================================
   Delete Hospital
========================================================== */

export const deleteHospital = async (
  id: string
) => {
  const hospital =
    await hospitalRepository.findById(id);

  if (!hospital) {
    return {
      success: false,
      message: "Hospital not found",
    };
  }

  await hospitalRepository.remove(id);

  return {
    success: true,
    message: "Hospital deleted successfully",
  };
};