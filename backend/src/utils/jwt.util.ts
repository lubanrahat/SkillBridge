import jwt from "jsonwebtoken";
import type { Role } from "../generated/prisma/enums";
import { env } from "../config/env";

const JWT_SECRET = env?.JWT_SECRET || "supersecret";

interface JwtPayload {
  userId: string;
  role: Role;
}

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
