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

  public getAllTutors = async (filters?: {
    subject?: string;
    categoryId?: string;
    minRate?: number;
    maxRate?: number;
    search?: string;
  }) => {
    const where: any = {};

    if (filters?.subject) {
      where.subjects = {
        has: filters.subject,
      };
    }

    if (filters?.minRate || filters?.maxRate) {
      where.hourlyRate = {};
      if (filters.minRate) {
        where.hourlyRate.gte = filters.minRate;
      }
      if (filters.maxRate) {
        where.hourlyRate.lte = filters.maxRate;
      }
    }

    if (filters?.search) {
      where.OR = [
        { user: { name: { contains: filters.search, mode: "insensitive" } } },
        { bio: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters?.categoryId) {
      where.categories = {
        some: {
          id: filters.categoryId,
        },
      };
    }

    const tutors = await prisma.tutorProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
        categories: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const tutorsWithRatings = tutors.map((tutor) => {
      const avgRating =
        tutor.reviews.length > 0
          ? tutor.reviews.reduce((sum, r) => sum + r.rating, 0) /
            tutor.reviews.length
          : 0;

      return {
        ...tutor,
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews: tutor.reviews.length,
        reviews: undefined,
      };
    });

    return tutorsWithRatings;
  };
}

export default TutorService;
