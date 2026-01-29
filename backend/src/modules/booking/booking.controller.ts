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

  public getUserBookings = catchAsync(async (req: Request, res: Response) => {
    const service = new BookingService();
    const result = await service.getUserBookings(req.user);
    return ResponseUtil.success(
      res,
      result,
      "Bookings fetched successfully",
      200,
    );
  });

   public getBookingById = catchAsync(async (req: Request, res: Response) => {
    const service = new BookingService();
    const result = await service.getBookingById(
      req.params.id as string,
      req.user,
    );
    return ResponseUtil.success(
      res,
      result,
      "Booking fetched successfully",
      200,
    );
  });

}

export default BookingController;
