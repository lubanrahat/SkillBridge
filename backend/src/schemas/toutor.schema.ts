import { z } from "zod";

export const createProfileSchema = z.object({
  bio: z.string().optional(),
  hourlyRate: z.number().positive(),
  subjects: z.array(z.string()).min(1),
  availability: z.any().optional(),
});

export const updateProfileSchema = z.object({
  bio: z.string().optional(),
  hourlyRate: z.number().positive().optional(),
  subjects: z.array(z.string()).min(1).optional(),
  availability: z.any().optional(),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
