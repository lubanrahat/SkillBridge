import type { Request, Response } from "express";
import { catchAsync } from "../../utils/asyncHandler";
import ReviewService from "./review.service";
import { ResponseUtil } from "../../utils/response.util";

class ReviewController {
  public createReview = catchAsync(async (req: Request, res: Response) => {
    const service = new ReviewService();
    const result = await service.createReview(req.body, req.user);
    return ResponseUtil.success(
      res,
      result,
      "Review created successfully",
      201,
    );
  });

  public getTutorReviews = catchAsync(async (req: Request, res: Response) => {
    const service = new ReviewService();
    const result = await service.getTutorReviews(req.params.tutorId as string);
    return ResponseUtil.success(
      res,
      result,
      "Reviews fetched successfully",
      200,
    );
  });
}

export default ReviewController;
