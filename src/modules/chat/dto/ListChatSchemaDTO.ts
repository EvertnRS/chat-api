import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const ListChatQuerySchema = z.object({
  searchTerm: z.string().optional().openapi({ example: 'chat name' }),

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