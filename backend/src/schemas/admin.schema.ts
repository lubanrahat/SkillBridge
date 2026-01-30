import { z } from "zod";

export const updateUserStatusSchema = z.object({
  status: z.enum(["ACTIVE", "BANNED"]),
});

export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
