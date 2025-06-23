export const swaggerDocs = {
  openapi: '3.0.0',
  info: {
    title: 'Chat API',
    version: '1.0.0',
    description: 'API para um sistema de chat em tempo real com autenticação, grupos e envio de mensagens com arquivos.',
  },
  servers: [
    { url: 'http://localhost:3000' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', example: 'john@example.com' },
          password: { type: 'string', example: '123456' }
        }
      },
      Chat: {
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
      },
      Message: {
        type: 'object',
        properties: {
          content: { type: 'string', example: 'Olá pessoal!' },
          file: { type: 'string', format: 'binary' }
        }
      }
    }
  },
  paths: {
    // USERS
    '/signup': {
      post: {
        summary: 'Criar um novo usuário',
        tags: ['Users'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' }
            }
          }
        },
        responses: {
          201: { description: 'Usuário criado com sucesso' },
          400: { description: 'Erro de validação' }
        }
      }
    },
    '/login': {
      post: {
        summary: 'Login do usuário',
        tags: ['Users'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'john@example.com' },
                  password: { type: 'string', example: '123456' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Token JWT gerado' },
          401: { description: 'Credenciais inválidas' }
        }
      }
    },
    '/users/update/{id}': {
      put: {
        summary: 'Atualizar um usuário',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' }
            }
          }
        },
        responses: {
          200: { description: 'Usuário atualizado' }
        }
      }
    },
    '/users/delete/{id}': {
      delete: {
        summary: 'Deletar um usuário',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Usuário deletado' }
        }
      }
    },

    // CHATS
    '/chat/create': {
      post: {
        summary: 'Criar um grupo de chat',
        tags: ['Chats'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: { $ref: '#/components/schemas/Chat' }
            }
          }
        },
        responses: {
          201: { description: 'Chat criado' }
        }
      }
    },
    '/chat/{id}': {
      put: {
        summary: 'Atualizar um grupo de chat',
        tags: ['Chats'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: { $ref: '#/components/schemas/Chat' }
            }
          }
        },
        responses: {
          200: { description: 'Chat atualizado' }
        }
      },
      delete: {
        summary: 'Deletar um grupo de chat',
        tags: ['Chats'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Chat deletado' }
        }
      }
    },
    '/chat': {
      get: {
        summary: 'Listar todos os chats',
        tags: ['Chats'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Lista de chats' }
        }
      }
    },
    '/chat/exit/{id}': {
      post: {
        summary: 'Sair de um chat',
        tags: ['Chats'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Usuário saiu do chat' }
        }
      }
    },

    // MESSAGES
    '/message/create/{chatId}': {
      post: {
        summary: 'Criar uma mensagem no chat',
        tags: ['Messages'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'chatId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: { $ref: '#/components/schemas/Message' }
            }
          }
        },
        responses: {
          201: { description: 'Mensagem criada' }
        }
      }
    },
    '/message/update/{chatId}/{messageId}': {
      put: {
        summary: 'Atualizar uma mensagem',
        tags: ['Messages'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'chatId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'messageId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  content: { type: 'string', example: 'Mensagem atualizada' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Mensagem atualizada' }
        }
      }
    },
    '/message/{id}': {
      delete: {
        summary: 'Deletar uma mensagem',
        tags: ['Messages'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Mensagem deletada' }
        }
      }
    },
    '/message/{chatId}/': {
      get: {
        summary: 'Listar mensagens de um chat',
        tags: ['Messages'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'chatId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', example: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', example: 10 } }
        ],
        responses: {
          200: { description: 'Lista de mensagens' }
        }
      }
    }
  }
};
