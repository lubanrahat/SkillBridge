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
}

export default TutorController;
