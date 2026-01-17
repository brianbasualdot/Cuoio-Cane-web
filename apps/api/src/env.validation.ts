import { z } from 'zod';

export const envSchema = z.object({
    PORT: z.coerce.number().default(3002),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    SUPABASE_URL: z.string().url(),
    SUPABASE_KEY: z.string().min(1),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(), // Make optional first to avoid instant crash if missing, but we will warn or use it. Actually, for API it SHOULD be required for Admin stuff.
    SUPABASE_JWT_SECRET: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;

export const validate = (config: Record<string, unknown>) => {
    const result = envSchema.safeParse(config);
    if (!result.success) {
        throw new Error('Config validation error: ' + JSON.stringify(result.error.format()));
    }
    return result.data;
};
