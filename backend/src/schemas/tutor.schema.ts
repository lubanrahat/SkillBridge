import { z } from "zod";

export const createTutorProfileSchema = z.object({
  bio: z.string().optional(),
  hourlyRate: z.number().positive("Hourly rate must be positive"),
  subjects: z.array(z.string()).min(1, "At least one subject is required"),
  categoryIds: z.array(z.string()).optional(),
  availability: z.any().optional(),
});

export const updateAvailabilitySchema = z.object({
  availability: z.any(),
});

export type CreateTutorProfileInput = z.infer<typeof createTutorProfileSchema>;
export type UpdateAvailabilityInput = z.infer<typeof updateAvailabilitySchema>;
