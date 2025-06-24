import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const CreateMessageBodySchema = z.object({
    content: z.string().openapi({ example: 'Message Content' })
});

export const MessageFileSchema = z.object({
  file: z.custom<Express.Multer.File>((val) => {
    return typeof val === 'object' && val !== null && 'originalname' in val;
  })
    .optional()
    .refine(
      (file) => {
        if (!file) return true;
        return /^(image|audio|video)\/.+$/.test(file.mimetype);
      },
        'File must be an image, audio, or video'     
    ),
}).openapi({
  description: 'Optional file attachment. Accepts image/*, audio/*, and video/* formats.',
});
