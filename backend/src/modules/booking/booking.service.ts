import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import type {
  CreateBookingInput,
  UpdateBookingStatusInput,
} from "../../schemas/booking.schema";
import type { JwtPayload } from "jsonwebtoken";
import { BookingStatus } from "../../generated/prisma/client";

class BookingService {
  public createBooking = async (
    payload: CreateBookingInput,
    user: JwtPayload,
  ) => {
    let tutor = await prisma.user.findUnique({
      where: { id: payload.tutorId },
      include: { tutorProfile: true },
    });

    if (!tutor) {
      const tutorProfile = await prisma.tutorProfile.findUnique({
        where: { id: payload.tutorId },
        select: { userId: true },
      });

      if (tutorProfile) {
        tutor = await prisma.user.findUnique({
          where: { id: tutorProfile.userId },
          include: { tutorProfile: true },
        });
      }
    }

    if (!tutor || !tutor.tutorProfile) {
      throw new AppError(404, "Tutor not found", "NOT_FOUND");
    }

    const tutorUserId = tutor.id;

    const startTime = new Date(payload.startTime);
    const endTime = new Date(payload.endTime);

    if (endTime <= startTime) {
      throw new AppError(
        400,
        "End time must be after start time",
        "INVALID_INPUT",
      );
    }

    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        tutorId: tutorUserId,
        status: {
          in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
        },
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } },
            ],
          },
        ],
      },
    });

    if (conflictingBooking) {
      throw new AppError(409, "Time slot already booked", "BOOKING_CONFLICT");
    }

    const durationInHours =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    const totalPrice = durationInHours * tutor.tutorProfile.hourlyRate;

    const booking = await prisma.booking.create({
      data: {
        studentId: user.userId,
        tutorId: tutorUserId,
        startTime,
        endTime,
        totalPrice,
        status: BookingStatus.CONFIRMED, 
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tutor: {
          select: {
            id: true,
            name: true,
            email: true,
            tutorProfile: true,
          },
        },
      },
    });

    return booking;
  };

  public getUserBookings = async (user: JwtPayload) => {
    const userRecord = await prisma.user.findUnique({
      where: { id: user.userId },
    });

    if (!userRecord) {
      throw new AppError(404, "User not found", "NOT_FOUND");
    }

    const bookings = await prisma.booking.findMany({
      where:
        userRecord.role === "STUDENT"
          ? { studentId: user.userId }
          : { tutorId: user.userId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tutor: {
          select: {
            id: true,
            name: true,
            email: true,
            tutorProfile: true,
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
    });

    return bookings;
  };

  public getBookingById = async (bookingId: string, user: JwtPayload) => {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tutor: {
          select: {
            id: true,
            name: true,
            email: true,
            tutorProfile: true,
          },
        },
      },
    });

    if (!booking) {
      throw new AppError(404, "Booking not found", "NOT_FOUND");
    }

    if (booking.studentId !== user.userId && booking.tutorId !== user.userId) {
      throw new AppError(403, "Access denied", "FORBIDDEN");
    }

    return booking;
  };

  public updateBookingStatus = async (
    bookingId: string,
    payload: UpdateBookingStatusInput,
    user: JwtPayload,
  ) => {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new AppError(404, "Booking not found", "NOT_FOUND");
    }

    // Verify user is part of this booking
    if (booking.studentId !== user.userId && booking.tutorId !== user.userId) {
      throw new AppError(403, "Access denied", "FORBIDDEN");
    }

    // Update status
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: payload.status as BookingStatus },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tutor: {
          select: {
            id: true,
            name: true,
            email: true,
            tutorProfile: true,
          },
        },
      },
    });

    return updatedBooking;
  };
}

export default BookingService;
