import { OpenAPIRegistry, OpenApiGeneratorV3, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { 
  CreateUserSchema, 
  LoginSchema, 
  UpdateUserBodySchema, 
  UpdateUserParamsSchema,
  DeleteUserBodySchema,
  DeleteUserParamsSchema
} from '../../modules/user/dto';

import { UserResponseSchema } from '../../@types/user/UserResponse';
import { LoginResponseSchema } from '../../@types/user/LoginResponse';

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

registry.register('CreateUser', CreateUserSchema);
registry.register('Login', LoginSchema);
registry.register('UpdateUser', UpdateUserBodySchema);

registry.registerPath({
  method: 'post',
  path: '/signup',
  tags: ['Users'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateUserSchema,
        },
      },
    },
  },
  responses: {
    201: { 
      description: 'User created',
      content: {
        'application/json': {
          schema: UserResponseSchema,
        },
      },
     },
    400: { description: 'Validation error' },
  },
});

// Login
registry.registerPath({
  method: 'post',
  path: '/login',
  tags: ['Users'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: LoginSchema,
        },
      },
    },
  },
  responses: {
    200: { 
      description: 'JWT Token returned',
      content: {
        'application/json': {
          schema: LoginResponseSchema,
        },
      },
     },
    400: { description: 'Invalid credentials' },
  },
});

// Update User
registry.registerPath({
  method: 'put',
  path: '/users/update/{id}',
  tags: ['Users'],
  request: {
    params: UpdateUserParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: UpdateUserBodySchema,
        },
      },
    },
  },
  responses: {
    200: { 
      description: 'User updated',
      content: {
        'application/json': {
          schema: UserResponseSchema,
        },
      },
     },
    400: { description: 'Validation error' },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/users/delete/{id}',
  tags: ['Users'],
  request: {
    params: DeleteUserParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: DeleteUserBodySchema,
        },
      },
    },
  },
  responses: {
    204: { description: 'User deleted' },
    400: { description: 'Validation error' },
  },
});

registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT'
});

registry.registerComponent('schemas', 'User', {
  type: 'object',
  properties: {
    name: { type: 'string', example: 'John Doe' },
    email: { type: 'string', example: 'john@example.com' },
    password: { type: 'string', example: '123456' }
  }
});

registry.registerComponent('schemas', 'Chat', {
  type: 'object',
  properties: {
    name: { type: 'string', example: 'Grupo da Família' },
    description: { type: 'string', example: 'Grupo para assuntos de família' },
    participants: {
      type: 'array',
      items: { type: 'string', example: 'uuid-do-usuario' }
    },
    photo: { type: 'string', format: 'binary' }
  }
});

registry.registerComponent('schemas', 'Message', {
  type: 'object',
  properties: {
    content: { type: 'string', example: 'Olá pessoal!' },
    file: { type: 'string', format: 'binary' }
  }
});

const generator = new OpenApiGeneratorV3(registry.definitions);
export const swaggerDocument = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: 'Chat API',
    version: '1.0.0',
    description: 'API para um sistema de chat em tempo real com autenticação, grupos e envio de mensagens com arquivos.',
  },
  servers: [
    { url: 'http://localhost:3000' }
  ]
});
