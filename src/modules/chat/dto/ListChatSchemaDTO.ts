import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const ListChatsQuerySchema = z.object({
  search: z.string().optional().openapi({ example: 'chat name' })
});