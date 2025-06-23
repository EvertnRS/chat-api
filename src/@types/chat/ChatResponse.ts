import { z } from 'zod';

export const ChatResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().optional(),
    photo: z.string().optional(),
    participants: z.array(z.string().uuid()),
    creator: z.string().uuid(),
    lastMessageAt: z.coerce.date(),
    createdAt: z.coerce.date()
});

export type ChatResponse = z.infer<typeof ChatResponseSchema>;