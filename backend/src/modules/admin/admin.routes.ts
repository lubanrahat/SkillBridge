import { Router } from "express";
import AdminController from "./admin.controller";
import { isAuthenticated, authorize } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/zodValidation";
import { updateUserStatusSchema } from "../../schemas/admin.schema";

function registerAdminRoutes(): Router {
  const router = Router();
  const controller = new AdminController();
  
  router.get(
    "/users",
    isAuthenticated,
    authorize("ADMIN"),
    controller.getAllUsers,
  );

  router.get(
    "/bookings",
    isAuthenticated,
    authorize("ADMIN"),
    controller.getAllBookings,
  );

  router.patch(
    "/users/:id",
    isAuthenticated,
    authorize("ADMIN"),
    validate(updateUserStatusSchema),
    controller.updateUserStatus,
  );

  router.get(
    "/statistics",
    isAuthenticated,
    authorize("ADMIN"),
    controller.getStatistics,
  );

  return router;
}

export default registerAdminRoutes;
