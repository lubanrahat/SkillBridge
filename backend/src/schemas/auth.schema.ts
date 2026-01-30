import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["STUDENT", "TUTOR", "ADMIN"]),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format").optional(),
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>["body"];
export type LoginUserInput = z.infer<typeof loginUserSchema>["body"];
export type UpdateUserInput = z.infer<typeof updateUserSchema>["body"];
