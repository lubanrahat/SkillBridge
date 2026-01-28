import { Router } from "express";
import CategoryController from "./category.controller";
import { isAuthenticated, authorize } from "../../middlewares/auth.middleware";
import { zodValidation } from "../../middlewares/zodValidation";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../../schemas/category.schema";

function registerCategoryRoutes(): Router {
  const router = Router();
  const controller = new CategoryController();

  router.get("/", controller.getAllCategories);

  router.post(
    "/",
    isAuthenticated,
    authorize("ADMIN"),
    zodValidation(createCategorySchema),
    controller.createCategory,
  );

  router.put(
    "/:id",
    isAuthenticated,
    authorize("ADMIN"),
    zodValidation(updateCategorySchema),
    controller.updateCategory,
  );

  router.delete(
    "/:id",
    isAuthenticated,
    authorize("ADMIN"),
    controller.deleteCategory,
  );

  return router;
}

export default registerCategoryRoutes;
