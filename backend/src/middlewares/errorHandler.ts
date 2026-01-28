import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client";
import { AppError } from "../errors/AppError";
import { PrismaErrorHandler } from "../utils/prismaErrorHandler";
import { ResponseUtil } from "../utils/response.util";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Handle custom AppError
  if (err instanceof AppError) {
    return ResponseUtil.error(
      res,
      err.message,
      err.statusCode,
      err.code,
      err.details,
    );
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((error) => ({
      field: error.path.join("."),
      message: error.message,
    }));

    return ResponseUtil.error(
      res,
      "Validation failed",
      400,
      "VALIDATION_ERROR",
      formattedErrors,
    );
  }

  // Handle Prisma errors
  if (
    err instanceof Prisma.PrismaClientKnownRequestError ||
    err instanceof Prisma.PrismaClientValidationError ||
    err instanceof Prisma.PrismaClientInitializationError
  ) {
    const prismaError = PrismaErrorHandler.handle(err);
    return ResponseUtil.error(
      res,
      prismaError.message,
      prismaError.statusCode,
      prismaError.code,
      prismaError.details,
    );
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return ResponseUtil.error(res, "Invalid token", 401, "INVALID_TOKEN");
  }

  if (err.name === "TokenExpiredError") {
    return ResponseUtil.error(res, "Token expired", 401, "TOKEN_EXPIRED");
  }

  // Log unexpected errors
  console.error("Unhandled error:", err);

  // Default error response
  return ResponseUtil.error(
    res,
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message,
    500,
    "INTERNAL_ERROR",
  );
};
