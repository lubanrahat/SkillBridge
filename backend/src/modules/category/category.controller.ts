import type { Request, Response } from "express";
import { catchAsync } from "../../utils/asyncHandler";
import CategoryService from "./category.service";
import { ResponseUtil } from "../../utils/response.util";

class CategoryController {
  public getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const service = new CategoryService();
    const result = await service.getAllCategories();
    return ResponseUtil.success(
      res,
      result,
      "Categories fetched successfully",
      200,
    );
  });

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

  public updateCategory = catchAsync(async (req: Request, res: Response) => {
    const service = new CategoryService();
    const result = await service.updateCategory(
      req.params.id as string,
      req.body,
    );
    return ResponseUtil.success(
      res,
      result,
      "Category updated successfully",
      200,
    );
  });

  public deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const service = new CategoryService();
    const result = await service.deleteCategory(req.params.id as string);
    return ResponseUtil.success(
      res,
      result,
      "Category deleted successfully",
      200,
    );
  });
}

export default CategoryController;
