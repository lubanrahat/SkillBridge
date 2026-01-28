// middleware/zodValidation.ts
import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import type { ZodTypeAny } from "zod";
import { AppError } from "../errors/AppError";

export const validateRequest = (schema: ZodTypeAny) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        throw new AppError(
          400,
          "Validation failed",
          "VALIDATION_ERROR",
          formattedErrors,
        );
      }
      next(error);
    }
  };
};

export const validateBody = (schema: ZodTypeAny) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        throw new AppError(
          400,
          "Validation failed",
          "VALIDATION_ERROR",
          formattedErrors,
        );
      }
      next(error);
    }
  };
};
