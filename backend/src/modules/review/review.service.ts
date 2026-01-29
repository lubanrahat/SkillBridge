import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import type { CreateReviewInput } from "../../schemas/review.schema";
import type { JwtPayload } from "jsonwebtoken";
import { BookingStatus } from "../../generated/prisma/client";

class ReviewService {
  public createReview = async (
    payload: CreateReviewInput,
    user: JwtPayload,
  ) => {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { id: payload.tutorProfileId },
      include: { user: true },
    });

    if (!tutorProfile) {
      throw new AppError(404, "Tutor profile not found", "NOT_FOUND");
    }

    const completedBooking = await prisma.booking.findFirst({
      where: {
        studentId: user.userId,
        tutorId: tutorProfile.userId,
        status: BookingStatus.COMPLETED,
      },
    });

    if (!completedBooking) {
      throw new AppError(
        400,
        "You must complete a session with this tutor before leaving a review",
        "INVALID_OPERATION",
      );
    }

    const existingReview = await prisma.review.findFirst({
      where: {
        studentId: user.userId,
        tutorProfileId: payload.tutorProfileId,
      },
    });

    if (existingReview) {
      throw new AppError(
        409,
        "You have already reviewed this tutor",
        "DUPLICATE_ENTRY",
      );
    }

    const review = await prisma.review.create({
      data: {
        studentId: user.userId,
        tutorProfileId: payload.tutorProfileId,
        rating: payload.rating,
        comment: payload.comment,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return review;
  };

  public getTutorReviews = async (tutorId: string) => {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId: tutorId },
    });

    if (!tutorProfile) {
      throw new AppError(404, "Tutor profile not found", "NOT_FOUND");
    }
    const reviews = await prisma.review.findMany({
      where: {
        tutorProfileId: tutorProfile.id,
      },
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
    });
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    return {
      reviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
    };
  };
}

export default ReviewService;
