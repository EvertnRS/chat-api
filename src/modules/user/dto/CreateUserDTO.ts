import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const CreateUserSchema = z.object({
  name: z.string().min(3, "Name is required").openapi({ example: 'John Doe' }),
  email: z.string().email("Invalid email Format").openapi({ example: 'john@example.com' }),
  password: z.string().min(6, "Password must be at least 6 characters").openapi({ example: 'strongpassword' }),
});


export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
