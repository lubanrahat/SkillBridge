import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.util.js";
import type { Role } from "../generated/prisma/enums.js";
import { AppError } from "../errors/AppError.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return next(new AppError(401, "Unauthorized", "UNAUTHORIZED"));
    }

    const payload = verifyToken(token);

    console.log("payload auth middleware: ->",payload)

    req.user = payload;
    next();
  } catch (error) {
    next(new AppError(401, "Unauthorized", "UNAUTHORIZED"));
  }
};

export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, "Unauthorized", "UNAUTHORIZED");
    }

    console.log("req.user role auth middleware start: ->",req.user.role)

    if (!roles.includes(req.user.role)) {
      throw new AppError(403, "Forbidden", "FORBIDDEN");
    }

    console.log("req.user role auth middleware end: ->",req.user.role)
    next();
  };
};

// Export alias for consistency
export const isAuthenticated = authenticate;
