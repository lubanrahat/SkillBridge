import { Router } from "express";
import TutorController from "./tutor.controller";
import { isAuthenticated, authorize } from "../../middlewares/auth.middleware";
import { zodValidation } from "../../middlewares/zodValidation";
import { createTutorProfileSchema } from "../../schemas/tutor.schema";

function registerTutorRoutes(): Router {
  const router = Router();
  const controller = new TutorController();

  router.put(
    "/profile",
    isAuthenticated,
    authorize("TUTOR"),
    zodValidation(createTutorProfileSchema),
    controller.createOrUpdateProfile,
  );

  return router;
}

export default registerTutorRoutes;
