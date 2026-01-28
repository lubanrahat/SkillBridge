import { Prisma } from "../generated/prisma/client";
import { AppError } from "../errors/AppError";

export class PrismaErrorHandler {
  static handle(error: any): AppError {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          const field = error.meta?.target as string[];
          return new AppError(
            409,
            `${field?.join(", ")} already exists`,
            "DUPLICATE_ENTRY",
            { field },
          );

        case "P2025":
          return new AppError(404, "Record not found", "NOT_FOUND");

        case "P2003":
          return new AppError(
            400,
            "Related record not found",
            "FOREIGN_KEY_CONSTRAINT",
            { field: error.meta?.field_name },
          );

        case "P2014":
          return new AppError(400, "Invalid ID provided", "INVALID_ID");

        case "P2015":
          return new AppError(
            404,
            "Related record not found",
            "RELATED_NOT_FOUND",
          );

        case "P2021":
          return new AppError(
            500,
            "Database table does not exist",
            "TABLE_NOT_FOUND",
          );

        case "P2022":
          return new AppError(
            500,
            "Database column does not exist",
            "COLUMN_NOT_FOUND",
          );

        default:
          return new AppError(
            500,
            "Database operation failed",
            "DATABASE_ERROR",
            { code: error.code },
          );
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      return new AppError(400, "Invalid data provided", "VALIDATION_ERROR");
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      return new AppError(
        500,
        "Database connection failed",
        "DATABASE_CONNECTION_ERROR",
      );
    }

    if (error instanceof Prisma.PrismaClientRustPanicError) {
      return new AppError(
        500,
        "Database engine error",
        "DATABASE_ENGINE_ERROR",
      );
    }

    return new AppError(500, "Internal server error", "INTERNAL_ERROR");
  }
}
