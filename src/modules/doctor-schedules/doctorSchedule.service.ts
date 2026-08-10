import * as doctorScheduleRepository from "./doctorSchedule.repository";
import * as doctorRepository from "../doctors/doctor.repository";

import {
  CreateDoctorScheduleInput,
  UpdateDoctorScheduleInput,
  GetDoctorSchedulesQuery,
} from "./doctorSchedule.validation";

/* ======================================================
   Create Schedule
====================================================== */

export const createDoctorSchedule = async (
  data: CreateDoctorScheduleInput
) => {
  // Check Doctor Exists
  const doctor = await doctorRepository.findById(
    data.doctorProfileId
  );

  if (!doctor) {
    return {
      success: false,
      message: "Doctor not found.",
    };
  }

  // Check Existing Schedule
  const existing =
    await doctorScheduleRepository.findByDoctorId(
      data.doctorProfileId
    );

  const duplicate = existing.find(
    (schedule) =>
      schedule.dayOfWeek === data.dayOfWeek &&
      schedule.startTime === data.startTime &&
      schedule.endTime === data.endTime
  );

  if (duplicate) {
    return {
      success: false,
      message:
        "Schedule already exists for this doctor.",
    };
  }

  const schedule =
    await doctorScheduleRepository.create(data);

  return {
    success: true,
    message:
      "Doctor schedule created successfully.",
    data: schedule,
  };
};

/* ======================================================
   Get All
====================================================== */

export const getDoctorSchedules = async (
  query: GetDoctorSchedulesQuery
) => {
  const result =
    await doctorScheduleRepository.getAll(query);

  return {
    success: true,
    data: result.schedules,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    },
  };
};

/* ======================================================
   Get By Id
====================================================== */

export const getDoctorScheduleById = async (
  id: string
) => {
  const schedule =
    await doctorScheduleRepository.findById(id);

  if (!schedule) {
    return {
      success: false,
      message: "Schedule not found.",
    };
  }

  return {
    success: true,
    data: schedule,
  };
};

/* ======================================================
   Update
====================================================== */

export const updateDoctorSchedule = async (
  id: string,
  data: UpdateDoctorScheduleInput
) => {
  const schedule =
    await doctorScheduleRepository.findById(id);

  if (!schedule) {
    return {
      success: false,
      message: "Schedule not found.",
    };
  }

  const updated =
    await doctorScheduleRepository.update(
      id,
      data
    );

  return {
    success: true,
    message:
      "Doctor schedule updated successfully.",
    data: updated,
  };
};

/* ======================================================
   Delete
====================================================== */

export const deleteDoctorSchedule = async (
  id: string
) => {
  const schedule =
    await doctorScheduleRepository.findById(id);

  if (!schedule) {
    return {
      success: false,
      message: "Schedule not found.",
    };
  }

  await doctorScheduleRepository.remove(id);

  return {
    success: true,
    message:
      "Doctor schedule deleted successfully.",
    };
};