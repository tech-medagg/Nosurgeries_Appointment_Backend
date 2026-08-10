import * as appointmentRepository from "./appointment.repository";

import {
  CreateAppointmentInput,
  UpdateAppointmentInput,
  GetAppointmentsQuery,
} from "./appointment.validation";

/* ======================================================
   Get Day Of Week
====================================================== */

const getDayOfWeek = (date: Date): string => {
  const days = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  return days[date.getDay()] ?? "SUNDAY";
};

/* ======================================================
   Get Start And End Of Day
====================================================== */

const getDayRange = (date: Date) => {
  const startOfDay = new Date(date);

  startOfDay.setHours(
    0,
    0,
    0,
    0
  );

  const endOfDay = new Date(date);

  endOfDay.setHours(
    23,
    59,
    59,
    999
  );

  return {
    startOfDay,
    endOfDay,
  };
};

/* ======================================================
   Generate Time Slots
====================================================== */

const generateTimeSlots = (
  startTime: string,
  endTime: string,
  slotDuration: number
): string[] => {
  const slots: string[] = [];

  const startParts = startTime
    .split(":")
    .map(Number);

  const endParts = endTime
    .split(":")
    .map(Number);

  const startHour = startParts[0] ?? 0;
  const startMinute = startParts[1] ?? 0;

  const endHour = endParts[0] ?? 0;
  const endMinute = endParts[1] ?? 0;

  let currentMinutes =
    startHour * 60 + startMinute;

  const endMinutes =
    endHour * 60 + endMinute;

  while (
    currentMinutes < endMinutes
  ) {
    const hour = Math.floor(
      currentMinutes / 60
    );

    const minute =
      currentMinutes % 60;

    const formattedHour =
      String(hour).padStart(2, "0");

    const formattedMinute =
      String(minute).padStart(2, "0");

    slots.push(
      `${formattedHour}:${formattedMinute}`
    );

    currentMinutes += slotDuration;
  }

  return slots;
};

/* ======================================================
   Create Appointment
====================================================== */

export const createAppointment = async (
  data: CreateAppointmentInput
) => {
  /* ---------------------------------------------
     Check Patient
  --------------------------------------------- */

  const patient =
    await appointmentRepository.patientExists(
      data.patientId
    );

  if (!patient) {
    return {
      success: false,
      message: "Patient not found.",
    };
  }

  /* ---------------------------------------------
     Check Hospital
  --------------------------------------------- */

  const hospital =
    await appointmentRepository.hospitalExists(
      data.hospitalId
    );

  if (!hospital) {
    return {
      success: false,
      message: "Hospital not found.",
    };
  }

  /* ---------------------------------------------
     Check Department
  --------------------------------------------- */

  const department =
    await appointmentRepository.departmentExists(
      data.departmentId
    );

  if (!department) {
    return {
      success: false,
      message: "Department not found.",
    };
  }

  /* ---------------------------------------------
     Doctor Is Optional

     Patient can submit appointment request
     without selecting a doctor.

     Admin can assign doctor later.
  --------------------------------------------- */

  if (data.doctorProfileId) {
    /* ---------------------------------------------
       Check Doctor
    --------------------------------------------- */

    const doctor =
      await appointmentRepository.doctorExists(
        data.doctorProfileId
      );

    if (!doctor) {
      return {
        success: false,
        message: "Doctor not found.",
      };
    }

    /* ---------------------------------------------
       Validate Appointment Date
    --------------------------------------------- */

    const appointmentDate =
      new Date(
        data.appointmentDate
      );

    if (
      Number.isNaN(
        appointmentDate.getTime()
      )
    ) {
      return {
        success: false,
        message:
          "Invalid appointment date.",
      };
    }

    /* ---------------------------------------------
       Get Day Of Week
    --------------------------------------------- */

    const dayOfWeek =
      getDayOfWeek(
        appointmentDate
      );

    /* ---------------------------------------------
       Check Doctor Schedule
    --------------------------------------------- */

    const schedule =
      await appointmentRepository.getDoctorSchedule(
        data.doctorProfileId,
        dayOfWeek
      );

    if (!schedule) {
      return {
        success: false,
        message:
          "Doctor is not available on this day.",
      };
    }

    /* ---------------------------------------------
       Check Doctor Daily Capacity
    --------------------------------------------- */

    const appointmentCount =
      await appointmentRepository.countDoctorAppointments(
        data.doctorProfileId,
        appointmentDate
      );

    if (
      appointmentCount >=
      schedule.maxPatients
    ) {
      return {
        success: false,
        message:
          "Doctor appointment capacity is full for this day.",
      };
    }
  }

  /* ---------------------------------------------
     Create Appointment
  --------------------------------------------- */

  const appointment =
    await appointmentRepository.create(
      data
    );

  return {
    success: true,
    message:
      "Appointment request created successfully.",
    data: appointment,
  };
};

/* ======================================================
   Get Appointment By ID
====================================================== */

export const getAppointmentById = async (
  id: string
) => {
  const appointment =
    await appointmentRepository.findById(
      id
    );

  if (!appointment) {
    return {
      success: false,
      message: "Appointment not found.",
    };
  }

  return {
    success: true,
    data: appointment,
  };
};

/* ======================================================
   Get All Appointments
====================================================== */

export const getAppointments = async (
  query: GetAppointmentsQuery
) => {
  const result =
    await appointmentRepository.getAll(
      query
    );

  return {
    success: true,
    ...result,
  };
};

/* ======================================================
   Update Appointment
====================================================== */

export const updateAppointment = async (
  id: string,
  data: UpdateAppointmentInput
) => {
  /* ---------------------------------------------
     Check Appointment
  --------------------------------------------- */

  const existing =
    await appointmentRepository.findById(
      id
    );

  if (!existing) {
    return {
      success: false,
      message: "Appointment not found.",
    };
  }

  /* ---------------------------------------------
     If Doctor Is Being Assigned/Changed
     Check Doctor
  --------------------------------------------- */

  if (data.doctorProfileId) {
    const doctor =
      await appointmentRepository.doctorExists(
        data.doctorProfileId
      );

    if (!doctor) {
      return {
        success: false,
        message: "Doctor not found.",
      };
    }

    /* ---------------------------------------------
       Determine Appointment Date
    --------------------------------------------- */

    const appointmentDate =
      data.appointmentDate
        ? new Date(
            data.appointmentDate
          )
        : existing.appointmentDate;

    if (
      Number.isNaN(
        appointmentDate.getTime()
      )
    ) {
      return {
        success: false,
        message:
          "Invalid appointment date.",
      };
    }

    /* ---------------------------------------------
       Get Day Of Week
    --------------------------------------------- */

    const dayOfWeek =
      getDayOfWeek(
        appointmentDate
      );

    /* ---------------------------------------------
       Check Doctor Schedule
    --------------------------------------------- */

    const schedule =
      await appointmentRepository.getDoctorSchedule(
        data.doctorProfileId,
        dayOfWeek
      );

    if (!schedule) {
      return {
        success: false,
        message:
          "Doctor is not available on this day.",
      };
    }

    /* ---------------------------------------------
       Check Doctor Capacity
    --------------------------------------------- */

    const appointmentCount =
      await appointmentRepository.countDoctorAppointments(
        data.doctorProfileId,
        appointmentDate
      );

    /*
      If this appointment already belongs
      to the same doctor, exclude it from
      the capacity calculation.
    */

    const sameDoctor =
      existing.doctorProfileId ===
      data.doctorProfileId;

    const adjustedCount =
      sameDoctor
        ? Math.max(
            appointmentCount - 1,
            0
          )
        : appointmentCount;

    if (
      adjustedCount >=
      schedule.maxPatients
    ) {
      return {
        success: false,
        message:
          "Doctor appointment capacity is full for this day.",
      };
    }
  }

  /* ---------------------------------------------
     Update Appointment
  --------------------------------------------- */

  const appointment =
    await appointmentRepository.update(
      id,
      data
    );

  return {
    success: true,
    message:
      "Appointment updated successfully.",
    data: appointment,
  };
};

/* ======================================================
   Delete Appointment
====================================================== */

export const deleteAppointment = async (
  id: string
) => {
  const deleted =
    await appointmentRepository.remove(
      id
    );

  if (!deleted) {
    return {
      success: false,
      message: "Appointment not found.",
    };
  }

  return {
    success: true,
    message:
      "Appointment deleted successfully.",
  };
};

/* ======================================================
   Get Available Doctors With Slots
====================================================== */

export const getAvailableDoctors = async (
  hospitalId: string,
  departmentId: string,
  appointmentDate: string
) => {
  /* ---------------------------------------------
     Validate Date
  --------------------------------------------- */

  const date =
    new Date(appointmentDate);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return {
      success: false,
      message:
        "Invalid appointment date.",
    };
  }

  /* ---------------------------------------------
     Check Hospital
  --------------------------------------------- */

  const hospital =
    await appointmentRepository.hospitalExists(
      hospitalId
    );

  if (!hospital) {
    return {
      success: false,
      message: "Hospital not found.",
    };
  }

  /* ---------------------------------------------
     Check Department
  --------------------------------------------- */

  const department =
    await appointmentRepository.departmentExists(
      departmentId
    );

  if (!department) {
    return {
      success: false,
      message: "Department not found.",
    };
  }

  /* ---------------------------------------------
     Get Available Doctors
  --------------------------------------------- */

  const doctors =
    await appointmentRepository.getAvailableDoctors(
      hospitalId,
      departmentId,
      date
    );

  /* ---------------------------------------------
     No Doctors
  --------------------------------------------- */

  if (!doctors.length) {
    return {
      success: true,
      message:
        "No doctors are available for the selected date.",
      data: [],
    };
  }

  /* ---------------------------------------------
     Get Day Range
  --------------------------------------------- */

  const {
    startOfDay,
    endOfDay,
  } = getDayRange(date);

  /* ---------------------------------------------
     Build Doctor Availability
  --------------------------------------------- */

  const availability =
    await Promise.all(
      doctors.map(
        async (doctor) => {
          /* ---------------------------------------
             Generate All Slots
          --------------------------------------- */

          const allSlots =
            generateTimeSlots(
              doctor.startTime,
              doctor.endTime,
              doctor.slotDuration
            );

          /* ---------------------------------------
             Get Already Booked Slots
          --------------------------------------- */

          const bookedSlots =
            await appointmentRepository.getDoctorBookedSlots(
              doctor.doctorProfileId,
              startOfDay,
              endOfDay
            );

          /* ---------------------------------------
             Remove Booked Slots
          --------------------------------------- */

          const availableSlots =
            allSlots.filter(
              (slot) =>
                !bookedSlots.includes(
                  slot
                )
            );

          /* ---------------------------------------
             Return Doctor Availability
          --------------------------------------- */

          return {
            doctorProfileId:
              doctor.doctorProfileId,

            doctorName:
              `${doctor.firstName} ${
                doctor.lastName ?? ""
              }`.trim(),

            dayOfWeek:
              doctor.dayOfWeek,

            startTime:
              doctor.startTime,

            endTime:
              doctor.endTime,

            slotDuration:
              doctor.slotDuration,

            maxPatients:
              doctor.maxPatients,

            bookedPatients:
              bookedSlots.length,

            availableSlots,
          };
        }
      )
    );

  /* ---------------------------------------------
     Return Availability
  --------------------------------------------- */

  return {
    success: true,
    message:
      "Doctor availability retrieved successfully.",
    data: availability,
  };
};