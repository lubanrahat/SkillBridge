import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../../schemas/category.schema";

class CategoryService {
  public getAllCategories = async () => {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return categories;
  };

  public createCategory = async (payload: CreateCategoryInput) => {
    const existing = await prisma.category.findUnique({
      where: { name: payload.name },
    });

    if (existing) {
      throw new AppError(409, "Category already exists", "DUPLICATE_ENTRY");
    }

    const category = await prisma.category.create({
      data: payload,
    });

    return category;
  };

  public updateCategory = async (
    categoryId: string,
    payload: UpdateCategoryInput,
  ) => {
    const existing = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existing) {
      throw new AppError(404, "Category not found", "NOT_FOUND");
    }

    if (payload.name && payload.name !== existing.name) {
      const duplicate = await prisma.category.findUnique({
        where: { name: payload.name },
      });

      if (duplicate) {
        throw new AppError(
          409,
          "Category name already exists",
          "DUPLICATE_ENTRY",
        );
      }
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: payload,
    });

    return category;
  };
}

export default CategoryService;
