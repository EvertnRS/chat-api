import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const LoginSchema = z.object({
  email: z.string().email("Invalid email format").openapi({ example: 'john@example.com' }),
  password: z.string().min(6, "Password must be at least 6 characters").openapi({ example: 'strongpassword' }),
});

export type LoginDTO = z.infer<typeof LoginSchema>;
