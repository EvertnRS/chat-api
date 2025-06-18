import { Router } from 'express';
import { authenticateToken } from "../infra/middlewares/authMiddleware";
import { UserController } from '../modules/user/controllers/UserController';
import { AuthController } from '../modules/user/controllers/AuthController';
import { UserRepository } from '../modules/user/domain/repositories/UserRepository';
import { JWTProvider } from '../infra/providers/auth/JWTProvider';

const router = Router();
const userRepository = new UserRepository;
const jwtProvider = new JWTProvider();

const userController = new UserController(userRepository);
const authController = new AuthController(userRepository, jwtProvider);

router.post('/signup', (req, res) => {userController.register(req, res)});
router.post('/login', (req, res) => {authController.login(req, res)});
router.put('/users/update/:id', authenticateToken(jwtProvider), (req, res) =>{ userController.update(req, res)});
router.delete('/users/delete/:id', authenticateToken(jwtProvider), (req, res) =>{ userController.delete(req, res)});

export default router;