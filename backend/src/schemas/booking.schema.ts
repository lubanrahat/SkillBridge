import { z } from "zod";

export const createBookingSchema = z.object({
  tutorId: z.string().uuid(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["CANCELLED", "COMPLETED"]),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<
  typeof updateBookingStatusSchema
>;
