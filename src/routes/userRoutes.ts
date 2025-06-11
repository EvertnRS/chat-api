import { Router } from 'express';
import { authenticateToken } from "../infra/middlewares/authMiddleware";
import { UserController } from '../modules/user/controllers/UserController';
import { AuthController } from '../modules/user/controllers/AuthController';

const router = Router();
const userController = new UserController();
const authController = new AuthController();

router.post('/signup', (req, res) => {userController.register(req, res)});
router.post('/login', (req, res) => {authController.login(req, res)});
router.put('/users/update/:id', authenticateToken, (req, res) =>{ userController.update(req, res)});
router.delete('/users/delete/:id', authenticateToken, (req, res) =>{ userController.delete(req, res)});

export default router;