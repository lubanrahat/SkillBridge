import type { Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { catchAsync } from "../../utils/asyncHandler";
import { ResponseUtil } from "../../utils/response.util";
import CategoryService from "./category.service";

class CategoryController {
  public createCategory = catchAsync(async (req: Request, res: Response) => {
    const service = new CategoryService();
    const result = await service.createCategory(req.body);
    return ResponseUtil.success(
      res,
      result,
      "Category created successfully",
      201,
    );
  });
}

export default CategoryController;
