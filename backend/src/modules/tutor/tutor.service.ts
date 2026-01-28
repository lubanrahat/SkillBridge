import type { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import type { CreateTutorProfileInput } from "../../schemas/tutor.schema";
import { Role } from "../../generated/prisma/enums";

class TutorService {

  public createOrUpdateProfile = async (
    payload: CreateTutorProfileInput,
    user: JwtPayload,
  ) => {
    
    const userRecord = await prisma.user.findUnique({
      where: { id: user.userId },
    });

    if (!userRecord) {
      throw new AppError(404, "User not found", "NOT_FOUND");
    }

    if (userRecord.role !== Role.TUTOR) {
      throw new AppError(403, "Only tutors can create profiles", "FORBIDDEN");
    }

    const existingProfile = await prisma.tutorProfile.findUnique({
      where: { userId: user.userId },
    });

    const { categoryIds, ...rest } = payload;

    if (existingProfile) {
      const updated = await prisma.tutorProfile.update({
        where: { userId: user.userId },
        data: {
          ...rest,
          categories: categoryIds
            ? {
                set: categoryIds.map((id) => ({ id })),
              }
            : undefined,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          categories: true,
        },
      });
      return updated;
    }

    const profile = await prisma.tutorProfile.create({
      data: {
        userId: user.userId,
        ...rest,
        categories: categoryIds
          ? {
              connect: categoryIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        categories: true,
      },
    });

    return profile;
  };
}

export default TutorService;
