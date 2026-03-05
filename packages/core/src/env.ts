import { z } from "zod";

export const EnvSchema = z.object({
    DATABASE_URL: z.string().optional(),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
    LLM_DUMMY_MODE: z.string().optional().default("true"),
});

// Since process.env is loosely typed, we cast it
export const env = EnvSchema.parse(process.env as Record<string, string | undefined>);
