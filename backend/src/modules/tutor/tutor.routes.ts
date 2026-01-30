import { Router } from "express";
import TutorController from "./tutor.controller";
import { isAuthenticated, authorize } from "../../middlewares/auth.middleware";
import { zodValidation } from "../../middlewares/zodValidation";
import {
  createTutorProfileSchema,
  updateAvailabilitySchema,
} from "../../schemas/tutor.schema";

function registerTutorRoutes(): Router {
  const router = Router();
  const controller = new TutorController();

  // Public routes
  router.get("/", controller.getAllTutors);
  router.get("/:id", controller.getTutorById);

  // Protected tutor routes
  router.put(
    "/profile",
    isAuthenticated,
    authorize("TUTOR"),
    zodValidation(createTutorProfileSchema),
    controller.createOrUpdateProfile,
  );

  router.put(
    "/availability",
    isAuthenticated,
    authorize("TUTOR"),
    zodValidation(updateAvailabilitySchema),
    controller.updateAvailability,
  );

  return router;
}

export default registerTutorRoutes;
