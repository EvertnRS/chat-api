import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);
export const DeleteUserBodySchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }).openapi({ example: 'userpassword' }),
});
