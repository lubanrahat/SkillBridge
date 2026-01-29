import { Router } from "express";
import BookingController from "./booking.controller";
import { isAuthenticated, authorize } from "../../middlewares/auth.middleware";
import { zodValidation } from "../../middlewares/zodValidation";
import { createBookingSchema } from "../../schemas/booking.schema";

function registerBookingRoutes(): Router {
  const router = Router();
  const controller = new BookingController();

  router.post(
    "/",
    isAuthenticated,
    authorize("STUDENT"),
    zodValidation(createBookingSchema),
    controller.createBooking,
  );

  router.get("/", isAuthenticated, controller.getUserBookings);
  router.get("/:id", isAuthenticated, controller.getBookingById);

  return router;
}

export default registerBookingRoutes;
