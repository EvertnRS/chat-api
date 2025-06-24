import { OpenAPIRegistry, OpenApiGeneratorV3, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import {
  CreateUserSchema,
  LoginSchema,
  UpdateUserBodySchema,
  DeleteUserBodySchema,
  UserParamsSchema
} from '../../modules/user/dto';

import {
  CreateChatBodySchema,
  UpdateChatBodySchema,
  ChatParamsSchema,
  ListChatsQuerySchema
} from '../../modules/chat/dto';

import {
  CreateMessageBodySchema,
  MessageFileSchema,
  MessageParamsSchema,
  MessageListQuerySchema
} from '../../modules/message/domain/dto';

import { UserResponseSchema } from '../../@types/user/UserResponse';
import { LoginResponseSchema } from '../../@types/user/LoginResponse';
import { ChatResponseSchema } from '../../@types/chat/ChatResponse';
import { MessageResponseSchema } from '../../@types/message/MessageResponse';

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

registry.register('CreateUser', CreateUserSchema);
registry.register('Login', LoginSchema);
registry.register('UpdateUser', UpdateUserBodySchema);
registry.register('UserResponse', UserResponseSchema);
registry.register('LoginResponse', LoginResponseSchema);
registry.register('DeleteUserBody', DeleteUserBodySchema);
registry.register('UserParams', UserParamsSchema);
registry.register('CreateChatBody', CreateChatBodySchema);
registry.register('UpdateChatBody', UpdateChatBodySchema);
registry.register('ChatParams', ChatParamsSchema);
registry.register('ListChatsQuery', ListChatsQuerySchema);
registry.register('CreateMessageBody', CreateMessageBodySchema);
registry.register('MessageFile', MessageFileSchema);
registry.register('MessageParams', MessageParamsSchema);
registry.register('MessageListQuery', MessageListQuerySchema);

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

registry.registerPath({
  method: 'put',
  path: '/users/update/{id}',
  tags: ['Users'],
  request: {
    params: UserParamsSchema,
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
    params: UserParamsSchema,
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


registry.register('CreateChat', CreateChatBodySchema);
registry.register('UpdateChat', UpdateChatBodySchema);
registry.register('ChatResponse', ChatResponseSchema);

registry.registerPath({
  method: 'post',
  path: '/chats',
  tags: ['Chats'],
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: CreateChatBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Chat created successfully',
      content: {
        'application/json': {
          schema: ChatResponseSchema,
        },
      },
    },
    400: { description: 'Validation error' },
  },
  security: [{ bearerAuth: [] }],
});

registry.registerPath({
  method: 'put',
  path: '/chats/{id}',
  tags: ['Chats'],
  request: {
    params: ChatParamsSchema,
    body: {
      content: {
        'multipart/form-data': {
          schema: UpdateChatBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Chat updated successfully',
      content: {
        'application/json': {
          schema: ChatResponseSchema,
        },
      },
    },
    400: { description: 'Validation error' },
  },
  security: [{ bearerAuth: [] }],
});

registry.registerPath({
  method: 'get',
  path: '/chats',
  tags: ['Chats'],
  request: {
    query: ListChatsQuerySchema,
  },
  responses: {
    200: {
      description: 'List of user chats',
      content: {
        'application/json': {
          schema: z.array(ChatResponseSchema),
        },
      },
    },
    400: { description: 'Validation error' },
  },
  security: [{ bearerAuth: [] }],
});

registry.registerPath({
  method: 'delete',
  path: '/chats/{id}',
  tags: ['Chats'],
  request: {
    params: ChatParamsSchema,
  },
  responses: {
    204: { description: 'Chat deleted successfully' },
    400: { description: 'Validation error' },
  },
  security: [{ bearerAuth: [] }],
});

registry.registerPath({
  method: 'post',
  path: '/chats/exit/{id}',
  tags: ['Chats'],
  request: {
    params: ChatParamsSchema,
  },
  responses: {
    200: { description: 'Exited from chat' },
    400: { description: 'Validation error' },
  },
  security: [{ bearerAuth: [] }],
});

registry.registerPath({
  method: 'post',
  path: '/message/create/{id}',
  tags: ['Messages'],
  request: {
    params: ChatParamsSchema,
    body: {
      content: {
        'multipart/form-data': {
          schema: CreateMessageBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Message created successfully',
      content: {
        'application/json': {
          schema: MessageResponseSchema,
        },
      },
    },
    400: { description: 'Validation error' },
  },
  security: [{ bearerAuth: [] }],
});

registry.registerPath({
  method: 'put',
  path: '/message/update/{id}/{chatId}',
  tags: ['Messages'],
  request: {
    params: MessageParamsSchema.merge(ChatParamsSchema),
    body: {
      content: {
        'application/json': {
          schema: CreateMessageBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Message updated successfully',
      content: {
        'application/json': {
          schema: MessageResponseSchema,
        },
      },
    },
    400: { description: 'Validation error' },
  },
  security: [{ bearerAuth: [] }],
});

registry.registerPath({
  method: 'delete',
  path: '/message/delete/{id}',
  tags: ['Messages'],
  request: {
    params: MessageParamsSchema,
  },
  responses: {
    204: { description: 'Message deleted successfully' },
    400: { description: 'Validation error' },
  },
  security: [{ bearerAuth: [] }],
});

registry.registerPath({
  method: 'get',
  path: '/message/list/{id}',
  tags: ['Messages'],
  request: {
    params: ChatParamsSchema,
    query: MessageListQuerySchema,
  },
  responses: {
    200: {
      description: 'List of messages in chat',
      content: {
        'application/json': {
          schema: z.array(MessageResponseSchema),
        },
      },
    },
    400: { description: 'Validation error' },
  },
  security: [{ bearerAuth: [] }],
});

registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

const generator = new OpenApiGeneratorV3(registry.definitions);

export const swaggerDocument = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: 'Chat API',
    version: '1.0.0',
    description: 'API para sistema de chat com autenticação, grupos, mensagens e arquivos.',
  },
  servers: [{ url: 'http://localhost:3000' }],
});
