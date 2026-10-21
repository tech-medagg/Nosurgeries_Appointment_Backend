import * as doctorRepository from "./doctor.repository";
import { db } from "../../db";
import { users } from "../../db/schema/users";
import { hospitals } from "../../db/schema/hospitals";
import { departments } from "../../db/schema/departments";
import { eq } from "drizzle-orm";

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

  if (data.registrationNumber) {
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
   Get Doctor By User Id (for /me endpoint)
====================================================== */

export const getDoctorByUserId = async (
  userId: string
) => {
  let doctor =
    await doctorRepository.findByUserId(
      userId
    );

  if (!doctor) {
    try {
      const userRes = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      const hospitalRes = await db.select().from(hospitals).limit(1);
      const departmentRes = await db.select().from(departments).limit(1);

      if (userRes[0] && hospitalRes[0] && departmentRes[0]) {
        const nameParts = (userRes[0].fullName || "Doctor").trim().split(" ");
        const firstName = nameParts[0] || "Doctor";
        const lastName = nameParts.slice(1).join(" ") || "";

        doctor = await doctorRepository.create({
          userId,
          hospitalId: hospitalRes[0].id,
          departmentId: departmentRes[0].id,
          firstName,
          lastName,
          qualification: "MBBS, MD",
          specialization: "General Specialist",
          experienceYears: 5,
          consultationFee: 100,
          isAvailable: true,
          status: "ACTIVE",
        });
      }
    } catch (err) {
      console.error("Auto-create doctor profile failed:", err);
    }
  }

  if (!doctor) {
    return {
      success: false,
      message:
        "Doctor profile not found for this user.",
    };
  }

  return {
    success: true,
    message: "Doctor profile fetched successfully.",
    data: doctor,
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