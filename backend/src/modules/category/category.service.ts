import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import type { CreateCategoryInput } from "../../schemas/category.schema";

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
}

export default CategoryService;
