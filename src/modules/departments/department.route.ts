import { Router } from "express";

import * as departmentController from "./department.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";

const router = Router();

/* ==========================================================
   Create Department (Admin Only)
========================================================== */

router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  departmentController.createDepartment
);

/* ==========================================================
   Get All Departments (All Roles)
========================================================== */

router.get(
  "/",
  authenticate,
  authorize(
    "SUPER_ADMIN",
    "ADMIN",
    "DOCTOR",
    "COORDINATOR",
    "PATIENT"
  ),
  departmentController.getDepartments
);

/* ==========================================================
   Get Department By Id (All Roles)
========================================================== */

router.get(
  "/:id",
  authenticate,
  authorize(
    "SUPER_ADMIN",
    "ADMIN",
    "DOCTOR",
    "COORDINATOR",
    "PATIENT"
  ),
  departmentController.getDepartmentById
);

/* ==========================================================
   Update Department (Admin Only)
========================================================== */

router.put(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  departmentController.updateDepartment
);

/* ==========================================================
   Delete Department (Admin Only)
========================================================== */

router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  departmentController.deleteDepartment
);

export default router;