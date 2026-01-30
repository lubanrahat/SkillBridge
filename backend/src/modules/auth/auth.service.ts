import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import type {
  CreateUserInput,
  LoginUserInput,
  UpdateUserInput,
} from "../../schemas/auth.schema";
import bcrypt from "bcryptjs";
import { signToken } from "../../utils/jwt.util";
import type { JwtPayload } from "jsonwebtoken";

class AuthService {
  public register = async (paylod: CreateUserInput) => {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: paylod.email,
      },
    });

    if (existingUser) {
      throw new AppError(409, "User already exists", "DUPLICATE_ENTRY");
    }

    const hashedPassword = await bcrypt.hash(paylod.password, 10);
    paylod.password = hashedPassword;

    const user = await prisma.user.create({
      data: paylod,
    });

    const token = signToken({ userId: user.id, role: user.role });

    const { password, ...safeUser } = user;

    return {
      user: safeUser,
      token,
    };
  };

  public login = async (paylod: LoginUserInput) => {
    const user = await prisma.user.findUnique({
      where: {
        email: paylod.email,
      },
    });

    if (!user) {
      throw new AppError(404, "User not found", "NOT_FOUND");
    }

    const isPasswordValid = await bcrypt.compare(
      paylod.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new AppError(401, "Invalid credentials", "INVALID_CREDENTIALS");
    }

    const token = signToken({ userId: user.id, role: user.role });

    const { password, ...safeUser } = user;

    return {
      user: safeUser,
      token,
    };
  };

  public getProfile = async (user: JwtPayload) => {
    const profile = await prisma.user.findUnique({
      where: {
        id: user.userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        tutorProfile: true,
      },
    });

    if (!profile) {
      throw new AppError(404, "User not found", "NOT_FOUND");
    }

    return profile;
  };

  public updateProfile = async (userId: string, payload: UpdateUserInput) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(404, "User not found", "NOT_FOUND");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: payload,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        tutorProfile: true,
      },
    });

    return updatedUser;
  };
}

export default AuthService;
