import { Router, Request, Response } from 'express';
import { authenticateToken } from "../infra/middlewares/authMiddleware";
import { ChatController } from '../modules/chat/controllers/ChatController';
import { ChatRepository } from '../modules/chat/domain/repositories/ChatRepository';
import { UserRepository } from '../modules/user/domain/repositories/UserRepository';
import { JWTProvider } from '../infra/providers/auth/JWTProvider';
import { S3StorageProvider } from '../infra/providers/storage/S3StorageProvider';
import multer from 'multer';

const router = Router();
const jwtProvider = new JWTProvider();
const chatRepository = new ChatRepository();
const userRepository = new UserRepository();
const storageProvider = new S3StorageProvider();
const upload = multer();

const chatController = new ChatController(chatRepository, userRepository, storageProvider);

router.use(authenticateToken(jwtProvider));
router.post('/chat/create', upload.single("photo"),  (req, res) => {chatController.createChat(req, res)});
router.put('/chat/:id', upload.single("photo"), (req, res) => {chatController.updateChat(req, res)});
router.delete('/chat/:id',  (req, res) => {chatController.deleteChat(req, res)});
router.get('/chat',  (req, res) => {chatController.listChats(req, res)});
router.post('/chat/exit/:id', (req, res) => {chatController.exitChat(req, res)});

export default router;