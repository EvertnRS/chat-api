import { z } from 'zod';

export const DeleteUserParamsSchema = z.object({
  id: z.string().uuid({ message: 'Invalid user ID' }).openapi({ example: '123e4567-e89b-12d3-a456-42661417400' }),
});

export const DeleteUserBodySchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }).openapi({ example: 'userpassword' }),
});
