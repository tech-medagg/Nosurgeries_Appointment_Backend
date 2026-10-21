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

  const startHour =
    startParts[0] ?? 0;

  const startMinute =
    startParts[1] ?? 0;

  const endHour =
    endParts[0] ?? 0;

  const endMinute =
    endParts[1] ?? 0;

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

    currentMinutes +=
      slotDuration;
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

     Patient can create an appointment
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
       Validate Appointment Time
    --------------------------------------------- */

    const availableSlots =
      generateTimeSlots(
        schedule.startTime,
        schedule.endTime,
        schedule.slotDuration
      );

    if (
      !availableSlots.includes(
        data.appointmentTime
      )
    ) {
      return {
        success: false,
        message:
          "Invalid appointment time. Please select an available slot.",
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
  query: GetAppointmentsQuery,
  userRole?: string
) => {
  const result =
    await appointmentRepository.getAll(
      query
    );

  const formattedAppointments = result.appointments.map((apt: any) => {
    const isOldPatient = Number(apt.patientAppointmentCount ?? 0) > 1;
    if (userRole === "DOCTOR") {
      const { patientMobile, patientEmail, ...rest } = apt;
      return { ...rest, isOldPatient };
    }
    return { ...apt, isOldPatient };
  });

  return {
    success: true,
    ...result,
    appointments: formattedAppointments,
  };
};

/* ======================================================
   Update Appointment / Reschedule Appointment
====================================================== */

export const updateAppointment = async (
  id: string,
  data: UpdateAppointmentInput
) => {
  /* ---------------------------------------------
     Check Appointment
  --------------------------------------------- */

  const existing =
    await appointmentRepository.findById(id);

  if (!existing) {
    return {
      success: false,
      message: "Appointment not found.",
    };
  }

  /* ---------------------------------------------
     Prevent Updating Completed / Cancelled
     Appointments
  --------------------------------------------- */

  if (
    existing.status === "CANCELLED" ||
    existing.status === "COMPLETED"
  ) {
    return {
      success: false,
      message:
        `Appointment cannot be updated because it is already ${existing.status.toLowerCase()}.`,
    };
  }

  /* ---------------------------------------------
     Validate Status Transition
  --------------------------------------------- */

  if (data.status) {
    const currentStatus = existing.status;
    const newStatus = data.status;

    const allowedTransitions: Record<
      string,
      string[]
    > = {
      PENDING: [
        "CONFIRMED",
        "CANCELLED",
        "RESCHEDULED",
      ],

      CONFIRMED: [
        "CHECKED_IN",
        "CANCELLED",
        "RESCHEDULED",
      ],

      CHECKED_IN: [
        "COMPLETED",
      ],

      RESCHEDULED: [
        "CONFIRMED",
        "CANCELLED",
        "RESCHEDULED",
      ],

      COMPLETED: [],

      CANCELLED: [],
    };

    const allowedStatuses =
      allowedTransitions[currentStatus] ?? [];

    if (
      !allowedStatuses.includes(newStatus)
    ) {
      return {
        success: false,
        message:
          `Invalid appointment status transition from ${currentStatus} to ${newStatus}.`,
      };
    }
  }

  /* ---------------------------------------------
     Determine Final Appointment Values

     If a new value is provided, use it.
     Otherwise keep the existing value.
  --------------------------------------------- */

  const finalDoctorProfileId =
    data.doctorProfileId ??
    existing.doctorProfileId;

  const finalAppointmentDate =
    data.appointmentDate
      ? new Date(data.appointmentDate)
      : existing.appointmentDate;

  const finalAppointmentTime =
    data.appointmentTime ??
    existing.appointmentTime;

  /* ---------------------------------------------
     Validate Appointment Date
  --------------------------------------------- */

  if (
    Number.isNaN(
      finalAppointmentDate.getTime()
    )
  ) {
    return {
      success: false,
      message:
        "Invalid appointment date.",
    };
  }

  /* ---------------------------------------------
     If Doctor Is Assigned
  --------------------------------------------- */

  if (finalDoctorProfileId) {
    /* ---------------------------------------------
       Check Doctor
    --------------------------------------------- */

    const doctor =
      await appointmentRepository.doctorExists(
        finalDoctorProfileId
      );

    if (!doctor) {
      return {
        success: false,
        message:
          "Doctor not found.",
      };
    }

    /* ---------------------------------------------
       Get Day Of Week
    --------------------------------------------- */

    const dayOfWeek =
      getDayOfWeek(
        finalAppointmentDate
      );

    /* ---------------------------------------------
       Check Doctor Schedule
    --------------------------------------------- */

    const schedule =
      await appointmentRepository.getDoctorSchedule(
        finalDoctorProfileId,
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
       Generate Valid Time Slots
    --------------------------------------------- */

    const availableSlots =
      generateTimeSlots(
        schedule.startTime,
        schedule.endTime,
        schedule.slotDuration
      );

/* ---------------------------------------------
   Validate Appointment Time
--------------------------------------------- */

if (!finalAppointmentTime) {
  return {
    success: false,
    message:
      "Appointment time is required.",
  };
}
    if (
      !availableSlots.includes(
        finalAppointmentTime
      )
    ) {
      return {
        success: false,
        message:
          "Invalid appointment time. Please select an available slot.",
      };
    }

    /* ---------------------------------------------
       Get Appointment Day Range
    --------------------------------------------- */

    const {
      startOfDay,
      endOfDay,
    } = getDayRange(
      finalAppointmentDate
    );

    /* ---------------------------------------------
       Get Booked Slots
    --------------------------------------------- */

    const bookedSlots =
      await appointmentRepository.getDoctorBookedSlots(
        finalDoctorProfileId,
        startOfDay,
        endOfDay
      );

    /* ---------------------------------------------
       Check Slot Availability

       The current appointment's existing time
       should not block itself.

       If the requested time belongs to another
       appointment, reject the reschedule.
    --------------------------------------------- */

    const changingSlot =
      finalDoctorProfileId !==
        existing.doctorProfileId ||
      finalAppointmentDate.getTime() !==
        existing.appointmentDate.getTime() ||
      finalAppointmentTime !==
        existing.appointmentTime;

    if (
      changingSlot &&
      bookedSlots.includes(
        finalAppointmentTime
      )
    ) {
      return {
        success: false,
        message:
          "This appointment slot is already booked.",
      };
    }

    /* ---------------------------------------------
       Check Doctor Daily Capacity
    --------------------------------------------- */

    const appointmentCount =
      await appointmentRepository.countDoctorAppointments(
        finalDoctorProfileId,
        finalAppointmentDate
      );

    /* ---------------------------------------------
       Exclude Current Appointment From Capacity

       When moving the same appointment within
       the same doctor/date, it should not count
       against capacity twice.
    --------------------------------------------- */

    const sameDoctor =
      existing.doctorProfileId ===
      finalDoctorProfileId;

    const sameDate =
      existing.appointmentDate.getTime() ===
      finalAppointmentDate.getTime();

    const adjustedCount =
      sameDoctor && sameDate
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
     Mark As Rescheduled

     If appointment date or time changes and no explicit
     status was provided, automatically change status to RESCHEDULED.
  --------------------------------------------- */

  if (
    !data.status &&
    (data.appointmentDate || data.appointmentTime)
  ) {
    data.status = "RESCHEDULED";
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
  hospitalId: string | undefined,
  departmentId: string | undefined,
  appointmentDate: string
) => {
  /* ---------------------------------------------
     Validate Appointment Date
  --------------------------------------------- */

  const [yearStr, monthStr, dayStr] = appointmentDate.split("-");
  const date =
    yearStr && monthStr && dayStr
      ? new Date(Number(yearStr), Number(monthStr) - 1, Number(dayStr), 12, 0, 0)
      : new Date(appointmentDate);

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
     Check Hospital (if specified)
  --------------------------------------------- */

  if (hospitalId) {
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
  }

  /* ---------------------------------------------
     Check Department (if specified)
  --------------------------------------------- */

  if (departmentId) {
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
     Build Availability
  --------------------------------------------- */

  const availability =
    await Promise.all(
      doctors.map(
        async (doctor) => {
          /* ---------------------------------------
             Generate All Time Slots
          --------------------------------------- */

          const allSlots =
            generateTimeSlots(
              doctor.startTime,
              doctor.endTime,
              doctor.slotDuration
            );

          /* ---------------------------------------
             Get Booked Slots
          --------------------------------------- */

          const bookedSlots =
            await appointmentRepository.getDoctorBookedSlots(
              doctor.doctorProfileId,
              startOfDay,
              endOfDay
            );

          const bookedSlotTimes = bookedSlots.filter(
            (time): time is string =>
              typeof time === "string" &&
              time.length > 0
          );

          const availableSlots =
            allSlots.filter(
              (slot) =>
                !bookedSlotTimes.includes(slot)
            );
          /* ---------------------------------------
             Return Doctor Availability
          --------------------------------------- */

          return {
            doctorProfileId:
              doctor.doctorProfileId,

            firstName:
              doctor.firstName,

            lastName:
              doctor.lastName,

            doctorName:
              `${doctor.firstName} ${
                doctor.lastName ?? ""
              }`.trim(),

            hospitalId:
              doctor.hospitalId,

            hospitalName:
              doctor.hospitalName ?? "",

            departmentId:
              doctor.departmentId,

            departmentName:
              doctor.departmentName ?? "",

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
              bookedSlotTimes.length,

            allSlots,
            bookedSlots: bookedSlotTimes,
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