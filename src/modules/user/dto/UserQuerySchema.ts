import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const UserQuerySchema = z.object({
  id: z.string().uuid({ message: 'Invalid user ID' }).optional().openapi({ example: '123e4567-e89b-12d3-a456-42661417400' }),
});