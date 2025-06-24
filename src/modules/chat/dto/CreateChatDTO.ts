import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const CreateChatBodySchema = z.object({
  name: z.string().min(3, "Name is required").openapi({ example: 'John Doe' }),
  description: z.string().optional().openapi({ example: 'This is a chat description' }),
  participants: z.array(z.string()).min(1, "At least one participant is required").openapi({ example: ['123e4567-e89b-12d3-a456-42661417400'] }),
});

