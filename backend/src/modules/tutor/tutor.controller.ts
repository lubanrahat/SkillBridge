import type { Request, Response } from "express";
import { catchAsync } from "../../utils/asyncHandler";
import { ResponseUtil } from "../../utils/response.util";
import TutorService from "./tutor.service";

class TutorController {
  public createOrUpdateProfile = catchAsync(
    async (req: Request, res: Response) => {
      const service = new TutorService();
      const result = await service.createOrUpdateProfile(req.body, req.user);
      return ResponseUtil.success(
        res,
        result,
        "Tutor profile saved successfully",
        200,
      );
    },
  );

  public getAllTutors = catchAsync(async (req: Request, res: Response) => {
    const service = new TutorService();
    const filters = {
      subject: req.query.subject as string | undefined,
      categoryId: req.query.categoryId as string | undefined,
      minRate: req.query.minRate
        ? parseFloat(req.query.minRate as string)
        : undefined,
      maxRate: req.query.maxRate
        ? parseFloat(req.query.maxRate as string)
        : undefined,
      search: req.query.search as string | undefined,
    };
    const result = await service.getAllTutors(filters);
    return ResponseUtil.success(
      res,
      result,
      "Tutors fetched successfully",
      200,
    );
  });

  public getTutorById = catchAsync(async (req: Request, res: Response) => {
    const service = new TutorService();
    const result = await service.getTutorById(req.params.id as string);
    return ResponseUtil.success(res, result, "Tutor fetched successfully", 200);
  });

  public updateAvailability = catchAsync(
    async (req: Request, res: Response) => {
      const service = new TutorService();
      const result = await service.updateAvailability(req.body, req.user);
      return ResponseUtil.success(
        res,
        result,
        "Availability updated successfully",
        200,
      );
    },
  );
  
}

export default TutorController;
