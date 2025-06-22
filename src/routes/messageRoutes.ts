import { Router, Request, Response } from 'express';
import { authenticateToken } from "../infra/middlewares/authMiddleware";
import { UserRepository } from '../modules/user/domain/repositories/UserRepository';
import { ChatRepository } from '../modules/chat/domain/repositories/ChatRepository';
import { MessageRepository } from '../modules/message/domain/repositories/MessageRepository';
import { JWTProvider } from '../infra/providers/auth/JWTProvider';
import { S3StorageProvider } from '../infra/providers/storage/S3StorageProvider';
import { WebSocketProvider } from '../infra/providers/websocket/WebSocketProvider';
import { MessageController } from '../modules/message/controllers/MessageController';
import multer from 'multer';

const router = Router();
const jwtProvider = new JWTProvider();
const messageRepository = new MessageRepository();
const chatRepository = new ChatRepository();
const userRepository = new UserRepository();
const storageProvider = new S3StorageProvider();
const webSocketProvider = new WebSocketProvider();
const upload = multer();

const messageController = new MessageController(messageRepository, userRepository,  chatRepository, storageProvider, webSocketProvider);

router.use(authenticateToken(jwtProvider));
router.post('/message/create/:chatId', upload.single('file'), async (req: Request, res: Response) => {messageController.createMessage(req, res)});



export default router;