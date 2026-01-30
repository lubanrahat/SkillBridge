import { z } from "zod";

const envSchema = z.object({
  CLIENT_URL: z.string(),
  PORT: z.string(),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
});

function createEnv(env: NodeJS.ProcessEnv) {
  const validationResult = envSchema.safeParse(env);
  if (!validationResult.success) {
    throw new Error(validationResult.error.message);
  }
  return validationResult.data;
}

export const env = createEnv(process.env);
