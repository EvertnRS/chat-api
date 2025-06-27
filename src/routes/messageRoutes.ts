import { Router, Request, Response } from 'express';
import { authenticateToken } from "../infra/middlewares/authMiddleware";
import { UserRepository } from '../modules/user/domain/repositories/UserRepository';
import { ChatRepository } from '../modules/chat/domain/repositories/ChatRepository';
import { MessageRepository } from '../modules/message/domain/repositories/MessageRepository';
import { JWTProvider } from '../infra/providers/auth/JWTProvider';
import { S3StorageProvider } from '../infra/providers/storage/S3StorageProvider';
import { WebSocketProvider } from '../infra/providers/websocket/WebSocketProvider';
import { MessageController } from '../modules/message/controllers/MessageController';
import { NodemailerProvider } from '../infra/providers/email/NodeMailerProvider';
import upload from '../infra/middlewares/multerConfig';

export function createMessageRoutes(webSocketProvider: WebSocketProvider) {
  const router = Router();
  const jwtProvider = new JWTProvider();
  const messageRepository = new MessageRepository();
  const chatRepository = new ChatRepository();
  const userRepository = new UserRepository();
  const storageProvider = new S3StorageProvider();
  const nodemailerProvider = new NodemailerProvider();

  const messageController = new MessageController(
    messageRepository,
    userRepository,
    chatRepository,
    storageProvider,
    webSocketProvider,
    nodemailerProvider
  );

  router.use(authenticateToken(jwtProvider));
  router.post('/message/create/:chatId', upload.single('file'), async (req, res) => {
    await messageController.createMessage(req, res);
  });
  router.put('/message/update/:chatId/:messageId', async (req, res) => {
    await messageController.updateMessage(req, res);
  });
  router.delete('/message/:id', async (req, res, next) => {
    try {
      await messageController.deleteMessage(req, res);
    } catch (error) {
      next(error);
    }
  });
  router.get('/message/:chatId/', async (req, res, next) => {
    try {
      await messageController.listMessages(req, res);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
