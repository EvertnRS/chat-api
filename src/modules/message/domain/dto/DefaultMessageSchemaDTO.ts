import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const MessageParamsSchema = z.object({
  id: z.string().uuid({ message: 'Invalid chat ID' }).openapi({ example: '123e4567-e89b-12d3-a456-42661417400' }),
});

export const MessageListQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1))
    .refine((val) => !isNaN(val) && val > 0, { message: 'Page must be a positive number' })
    .openapi({ example: '1' }),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 10))
    .refine((val) => !isNaN(val) && val > 0, { message: 'Limit must be a positive number' })
    .openapi({ example: '10' }),
});