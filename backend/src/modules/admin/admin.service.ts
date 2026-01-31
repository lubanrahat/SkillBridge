import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import { Role, UserStatus } from "../../generated/prisma/enums";

class AdminService {
  public getAllUsers = async (filters?: { role?: string; search?: string }) => {
    const where: any = {};

    if (filters?.role) {
      where.role = filters.role;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        tutorProfile: {
          select: {
            id: true,
            bio: true,
            hourlyRate: true,
            subjects: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return users;
  };

  public getAllBookings = async (filters?: {
    status?: string;
    tutorId?: string;
    studentId?: string;
  }) => {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.tutorId) {
      where.tutorId = filters.tutorId;
    }

    if (filters?.studentId) {
      where.studentId = filters.studentId;
    }

    const bookings = await prisma.booking.findMany({
      where,
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
        createdAt: "desc",
      },
    });

    return bookings;
  };

  public updateUserStatus = async (userId: string, status: UserStatus) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(404, "User not found", "NOT_FOUND");
    }

    console.log(user.role);

    if (status !== UserStatus.ACTIVE && status !== UserStatus.BAN) {
      throw new AppError(400, "Invalid status", "BAD_REQUEST");
    }

    if (user.role === Role.ADMIN) {
      throw new AppError(403, "Cannot modify admin users", "FORBIDDEN");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    });

    return {
      message: `User status updated to ${status}`,
      user: updatedUser,
    };
  };

  public getUserById = async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        tutorProfile: {
          select: {
            id: true,
            bio: true,
            hourlyRate: true,
            subjects: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError(404, "User not found", "NOT_FOUND");
    }

    return user;
  };

  public getStatistics = async () => {
    const [
      totalUsers,
      totalStudents,
      totalTutors,
      totalBookings,
      totalCompletedBookings,
      totalCategories,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "TUTOR" } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "COMPLETED" } }),
      prisma.category.count(),
    ]);

    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        tutor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      totalUsers,
      totalStudents,
      totalTutors,
      totalBookings,
      totalCompletedBookings,
      totalCategories,
      recentBookings,
    };
  };
}

export default AdminService;
