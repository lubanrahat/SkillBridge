import type { Request, Response } from "express";
import { catchAsync } from "../../utils/asyncHandler";
import { ResponseUtil } from "../../utils/response.util";
import BookingService from "./category.service";

class BookingController {
  public createBooking = catchAsync(async (req: Request, res: Response) => {
    const service = new BookingService();
    const result = await service.createBooking(req.body, req.user);
    return ResponseUtil.success(
      res,
      result,
      "Booking created successfully",
      201,
    );
  });
}

export default BookingController;
