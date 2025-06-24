import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const UpdateChatBodySchema = z.object({
  name: z.string().min(3, "Name is required").optional().openapi({ example: 'John Doe' }),
  description: z.string().optional().openapi({ example: 'This is a chat description' }),
  participants: z.array(z.string()).optional().openapi({ example: ['123e4567-e89b-12d3-a456-42661417400'] }),
});


