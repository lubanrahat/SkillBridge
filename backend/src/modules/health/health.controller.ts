import type { Request, Response } from "express";
import { catchAsync } from "../../utils/asyncHandler";
import { ResponseUtil } from "../../utils/response.util";
import { AppError } from "../../errors/AppError";

class HealthController {
  public handleHealthCheck = catchAsync(async (req: Request, res: Response) => {
    return res.status(200).json({
      status: "OK",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });
}

export default HealthController;
