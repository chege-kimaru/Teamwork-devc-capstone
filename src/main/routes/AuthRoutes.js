import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import Middlewares from '../middlewares';

const router = Router();

router.post('/signin', AuthController.signin);
router.post('/change-password', Middlewares.Auth, AuthController.changePassword);


export default router;
