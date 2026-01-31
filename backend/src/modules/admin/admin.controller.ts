import type { Request, Response } from "express";
import { catchAsync } from "../../utils/asyncHandler";
import AdminService from "./admin.service";
import { ResponseUtil } from "../../utils/response.util";

class AdminController {
  public getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const service = new AdminService();
    const filters = {
      role: req.query.role as string | undefined,
      search: req.query.search as string | undefined,
    };
    const result = await service.getAllUsers(filters);
    return ResponseUtil.success(res, result, "Users fetched successfully", 200);
  });

  public getAllBookings = catchAsync(async (req: Request, res: Response) => {
    const service = new AdminService();
    const filters = {
      status: req.query.status as string | undefined,
      tutorId: req.query.tutorId as string | undefined,
      studentId: req.query.studentId as string | undefined,
    };
    const result = await service.getAllBookings(filters);
    return ResponseUtil.success(
      res,
      result,
      "Bookings fetched successfully",
      200,
    );
  });

  public getUserById = catchAsync(async (req: Request, res: Response) => {
    const service = new AdminService();
    const result = await service.getUserById(req.params.id as string);
    return ResponseUtil.success(res, result, "User fetched successfully", 200);
  });

  public updateUserStatus = catchAsync(async (req: Request, res: Response) => {
    const service = new AdminService();
    const result = await service.updateUserStatus(
      req.params.id as string,
      req.body.status,
    );
    return ResponseUtil.success(
      res,
      result,
      "User status updated successfully",
      200,
    );
  });

  public getStatistics = catchAsync(async (req: Request, res: Response) => {
    const service = new AdminService();
    const result = await service.getStatistics();
    return ResponseUtil.success(
      res,
      result,
      "Statistics fetched successfully",
      200,
    );
  });
}

export default AdminController;
