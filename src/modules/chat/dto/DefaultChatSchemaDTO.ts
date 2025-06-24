import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const ChatParamsSchema = z.object({
  id: z.string().uuid({ message: 'Invalid chat ID' }).openapi({ example: '123e4567-e89b-12d3-a456-42661417400' }),
});

export const ChatFileSchema = z.object({
  file: z.custom<Express.Multer.File>((val) => {
    return typeof val === 'object' && val !== null && 'originalname' in val; }).optional()
}).openapi({
  description: 'Optional photo of Chat.'
});