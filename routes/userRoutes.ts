import { Router } from 'express';
import { UserController } from '../src/modules/user/controllers/UserController';
import { AuthController } from '../src/modules/user/controllers/AuthController';

const router = Router();
const userController = new UserController();
const authController = new AuthController();

router.post('/signup', (req, res) => {userController.register(req, res)});
router.post('/login', (req, res) => {authController.login(req, res)});

export default router;