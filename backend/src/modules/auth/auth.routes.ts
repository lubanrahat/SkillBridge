import express, { type Router } from "express";
import AuthController from "./auth.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/zodValidation";
import { updateUserSchema } from "../../schemas/auth.schema";

export default function registerAuthRoutes(): Router {
  const router = express.Router();
  const controller = new AuthController();

  router.get("/me", authenticate, controller.getProfile.bind(controller));
  router.patch(
    "/me",
    authenticate,
    validateRequest(updateUserSchema),
    controller.updateProfile.bind(controller),
  );

  router.post("/register", controller.register.bind(controller));
  router.post("/login", controller.login.bind(controller));

  return router;
}
