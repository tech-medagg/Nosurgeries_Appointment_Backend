import { Router } from "express";
import * as authController from "./auth.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.get("/roles", authController.getRoles);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authenticate, authController.me);

// Forgot / Reset Password
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Google OAuth
router.post("/google", authController.googleLogin);
router.post("/lookup-roles", authController.lookupRoles);

export default router;