import { Router } from "express";

import * as departmentController from "./department.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";

const router = Router();

/* ==========================================================
   Create Department
========================================================== */

router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  departmentController.createDepartment
);

/* ==========================================================
   Get All Departments
========================================================== */

router.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  departmentController.getDepartments
);

/* ==========================================================
   Get Department By Id
========================================================== */

router.get(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  departmentController.getDepartmentById
);

/* ==========================================================
   Update Department
========================================================== */

router.put(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  departmentController.updateDepartment
);

/* ==========================================================
   Delete Department
========================================================== */

router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  departmentController.deleteDepartment
);

export default router;