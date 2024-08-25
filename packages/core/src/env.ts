import { z } from "zod";

export const envSchema = z.object({
    DISCORD_TOKEN: z.string(),
    REDIS_HOST: z.string().default("localhost"),
    REDIS_PORT: z.coerce.number().default(6379),
    REDIS_PASSWORD: z.string().default(""),
    REDIS_DATABASE: z.coerce.number().default(0),
    SHARD_COUNT: z.coerce.number(),
    SHARDS_PER_WORKER: z.coerce.number(),
    LOG_LEVEL: z.coerce.number().default(3),
});

export type Environment = z.infer<typeof envSchema>;

export const env: Environment = envSchema.parse(process.env);
