import { z } from 'zod';

export const LoginResponseSchema = z.object({
    user: z.object({
        id: z.string().uuid()
    }),
    token: z.string()
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;