import * as departmentRepository from "./department.repository";

import {
  CreateDepartmentInput,
  UpdateDepartmentInput,
  GetDepartmentsQuery,
} from "./department.validation";

/* ==========================================================
   Create Department
========================================================== */

export const createDepartment = async (
  data: CreateDepartmentInput
) => {
  const existingName =
    await departmentRepository.findByName(data.name);

  if (existingName) {
    return {
      success: false,
      message: "Department name already exists",
    };
  }

  const existingSlug =
    await departmentRepository.findBySlug(data.slug);

  if (existingSlug) {
    return {
      success: false,
      message: "Department slug already exists",
    };
  }

  const department =
    await departmentRepository.create(data);

  if (!department) {
    return {
      success: false,
      message: "Failed to create department",
    };
  }

  return {
    success: true,
    message: "Department created successfully",
    data: department,
  };
};

/* ==========================================================
   Get All Departments
========================================================== */

export const getDepartments = async (
  params: GetDepartmentsQuery
) => {
  const result =
    await departmentRepository.getAll(params);

  return {
    success: true,
    message: "Departments fetched successfully",
    data: result.departments,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    },
  };
};

/* ==========================================================
   Get Department By Id
========================================================== */

export const getDepartmentById = async (
  id: string
) => {
  const department =
    await departmentRepository.findById(id);

  if (!department) {
    return {
      success: false,
      message: "Department not found",
    };
  }

  return {
    success: true,
    message: "Department fetched successfully",
    data: department,
  };
};

/* ==========================================================
   Update Department
========================================================== */

export const updateDepartment = async (
  id: string,
  data: UpdateDepartmentInput
) => {
  const department =
    await departmentRepository.findById(id);

  if (!department) {
    return {
      success: false,
      message: "Department not found",
    };
  }

  if (
    data.name &&
    data.name !== department.name
  ) {
    const existing =
      await departmentRepository.findByName(
        data.name
      );

    if (existing) {
      return {
        success: false,
        message: "Department name already exists",
      };
    }
  }

  if (
    data.slug &&
    data.slug !== department.slug
  ) {
    const existing =
      await departmentRepository.findBySlug(
        data.slug
      );

    if (existing) {
      return {
        success: false,
        message: "Department slug already exists",
      };
    }
  }

  const updated =
    await departmentRepository.update(
      id,
      data
    );

  return {
    success: true,
    message: "Department updated successfully",
    data: updated,
  };
};

/* ==========================================================
   Delete Department
========================================================== */

export const deleteDepartment = async (
  id: string
) => {
  const department =
    await departmentRepository.findById(id);

  if (!department) {
    return {
      success: false,
      message: "Department not found",
    };
  }

  await departmentRepository.remove(id);

  return {
    success: true,
    message: "Department deleted successfully",
  };
};