import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const UpdateUserParamsSchema = z.object({
  id: z.string().uuid({ message: 'Invalid user ID' }).openapi({ example: '123e4567-e89b-12d3-a456-42661417400' }),
});

export const UpdateUserBodySchema = z.object({
  name: z.string().min(3, "Name is required").optional().openapi({ example: 'John Doe' }),
  email: z.string().email({ message: 'Invalid email Format' }).optional().openapi({ example: 'john@example.com' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }).optional().openapi({ example: 'strongpassword' }),
});
