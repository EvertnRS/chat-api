import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const UserResponseSchema = z.object({
    id: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-42661417400' }),
    name: z.string().openapi({ example: 'John Doe' }),
    email: z.string().email().openapi({ example: 'john@example.com'}),
});

export type UserResponse = z.infer<typeof UserResponseSchema>;