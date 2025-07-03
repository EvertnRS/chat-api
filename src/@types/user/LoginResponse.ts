import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const LoginResponseSchema = z.object({
    user: z.object({
        id: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-42661417400' }),
        name: z.string().min(1).openapi({ example: 'John Doe' }),
        email: z.string().email().openapi({ example: 'john@example.com'})
    }),
    token: z.string().openapi({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;