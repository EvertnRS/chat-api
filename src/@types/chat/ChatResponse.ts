import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const ChatResponseSchema = z.object({
    id: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-42661417400' }),
    name: z.string().openapi({ example: 'Chat Name' }),
    description: z.string().optional().openapi({ example: 'Chat Description' }),
    photo: z.string().optional().openapi({ example: 'https://s3.amazonaws.com/bucket/file.png' }),
    participants: z.array(z.string().uuid()).openapi({ example: ['123e4567-e89b-12d3-a456-42661417400'] }),
    creator: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-42661417400' }),
    lastMessageAt: z.coerce.date().openapi({ example: '2023-10-01T12:00:00Z' }),
    createdAt: z.coerce.date().openapi({ example: '2023-10-01T12:00:00Z' }),
});

export type ChatResponse = z.infer<typeof ChatResponseSchema>;