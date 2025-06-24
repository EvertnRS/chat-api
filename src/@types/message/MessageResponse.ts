import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const MessageResponseSchema = z.object({
  id: z.string().uuid().openapi({ example: '6f275a0b-53a9-4b07-83fd-f491349d4e3a' }),
  sender: z.string().uuid().openapi({ example: '6f275a0b-53a9-4b07-83fd-f491349d4e3a' }),
  recipient: z.string().uuid().openapi({ example: '6f275a0b-53a9-4b07-83fd-f491349d4e3a' }),
  text: z.string().nullable().openapi({ example: 'Message Content' }),
  file: z.string().nullable().openapi({ example: 'https://s3.amazonaws.com/bucket/file.png' }),
  sentAt: z.string().datetime().openapi({ example: '2024-06-23T14:55:30.000Z' }),
});

export type MessageResponse = z.infer<typeof MessageResponseSchema>;