import { Router } from 'express';
import { UserController } from '../src/modules/user/controllers/UserController';
import { AuthController } from '../src/modules/user/controllers/AuthController';
import { authenticateToken } from "../src/infra/middlewares";

const router = Router();
const userController = new UserController();
const authController = new AuthController();

router.post('/signup', (req, res) => {userController.register(req, res)});
router.post('/login', (req, res) => {authController.login(req, res)});
router.put('/users/update/:id', authenticateToken, (req, res) =>{ userController.update(req, res)});

export default router;