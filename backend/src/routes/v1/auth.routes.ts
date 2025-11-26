import { Router } from "express";
import authController from "../../controllers/auth.controller.ts";
import { validate } from "../../middlewares/validation.middleware.ts";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from "../../validators/auth.validator.ts";
import { authenticate } from "../../middlewares/auth.middleware.ts";
import { authRateLimiter } from "../../middlewares/rateLimit.middleware.ts";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  authController.register
);

router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema),
  authController.login
);

router.post(
  "/refresh-token",
  validate(refreshTokenSchema),
  authController.refreshToken
);

router.get(
  "/profile",
  authenticate,
  authController.getProfile
);

export default router;
