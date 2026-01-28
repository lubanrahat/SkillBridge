import express, { type Router } from "express";
import AuthController from "./auth.controller";

export default function registerAuthRoutes(): Router {
  const router = express.Router();
  const controller = new AuthController();

  router.post("/register", controller.register.bind(controller));
  router.post("/login", controller.login.bind(controller));

  return router;
}
