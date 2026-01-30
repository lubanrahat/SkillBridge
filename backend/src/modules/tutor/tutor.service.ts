import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import type {
  CreateTutorProfileInput,
  UpdateAvailabilityInput,
} from "../../schemas/tutor.schema";
import type { JwtPayload } from "jsonwebtoken";

class TutorService {
  public createOrUpdateProfile = async (
    payload: CreateTutorProfileInput,
    user: JwtPayload,
  ) => {
    // Check if user is a tutor
    const userRecord = await prisma.user.findUnique({
      where: { id: user.userId },
    });

    if (!userRecord) {
      throw new AppError(404, "User not found", "NOT_FOUND");
    }

    if (userRecord.role !== "TUTOR") {
      throw new AppError(403, "Only tutors can create profiles", "FORBIDDEN");
    }

    // Check if profile already exists
    const existingProfile = await prisma.tutorProfile.findUnique({
      where: { userId: user.userId },
    });

    const { categoryIds, ...rest } = payload;

    if (existingProfile) {
      // Update existing profile
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

    // Create new profile
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

    // Calculate average rating for each tutor
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
        reviews: undefined, // Remove individual reviews from list view
      };
    });

    return tutorsWithRatings;
  };

  public getTutorById = async (tutorId: string) => {
    const include = {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reviews: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      categories: true,
    } as const;

    const tutorByProfileId = await prisma.tutorProfile.findUnique({
      where: { id: tutorId },
      include,
    });

    const tutor =
      tutorByProfileId ??
      (await prisma.tutorProfile.findUnique({
        where: { userId: tutorId },
        include,
      }));

    if (!tutor) {
      throw new AppError(404, "Tutor not found", "NOT_FOUND");
    }

    // Calculate average rating
    const avgRating =
      tutor.reviews.length > 0
        ? tutor.reviews.reduce((sum, r) => sum + r.rating, 0) /
          tutor.reviews.length
        : 0;

    return {
      ...tutor,
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: tutor.reviews.length,
    };
  };

  public updateAvailability = async (
    payload: UpdateAvailabilityInput,
    user: JwtPayload,
  ) => {
    const profile = await prisma.tutorProfile.findUnique({
      where: { userId: user.userId },
    });

    if (!profile) {
      throw new AppError(404, "Tutor profile not found", "NOT_FOUND");
    }

    const updated = await prisma.tutorProfile.update({
      where: { userId: user.userId },
      data: { availability: payload.availability },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return updated;
  };
}

export default TutorService;
