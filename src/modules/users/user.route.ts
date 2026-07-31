import { Router } from "express";

import * as userController from "./user.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  userController.getAllUsers
);

router.get(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  userController.getUserById
);

export default router;