import express, { type Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import registerHealthRoutes from "./modules/health/health.routes";
import { errorHandler } from "./middlewares/errorHandler";
import registerAuthRoutes from "./modules/auth/auth.routes";
import registerTutorRoutes from "./modules/tutor/tutor.routes";
import registerCategoryRoutes from "./modules/category/category.routes";
import registerBookingRoutes from "./modules/booking/booking.routes";

function createApp(): Application {
  const app: Application = express();

  app.use(
    cors({
      origin: env?.CLIENT_URL,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    }),
  );

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(registerHealthRoutes());
  app.use("/api/v1/auth", registerAuthRoutes());
  app.use("/api/v1/tutors", registerTutorRoutes());
  app.use("/api/v1/bookings", registerBookingRoutes());
  app.use("/api/v1/categories", registerCategoryRoutes());

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Route not found",
      },
    });
  });

  app.use(errorHandler);

  return app;
}

export default createApp;
