import { Router } from "express";
import ReviewController from "./review.controller";
import { isAuthenticated, authorize } from "../../middlewares/auth.middleware";
import { zodValidation } from "../../middlewares/zodValidation";
import { createReviewSchema } from "../../schemas/review.schema";

function registerReviewRoutes(): Router {
  const router = Router();
  const controller = new ReviewController();

  router.post(
    "/",
    isAuthenticated,
    authorize("STUDENT"),
    zodValidation(createReviewSchema),
    controller.createReview,
  );

  // Get tutor reviews - public
  router.get("/tutor/:tutorId", controller.getTutorReviews);

  return router;
}

export default registerReviewRoutes;
