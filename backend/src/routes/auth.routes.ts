import { Router } from 'express';
import * as authCtrl from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// POST /api/auth/register
router.post('/register', authCtrl.register);

// POST /api/auth/login
router.post('/login', authCtrl.login);

// GET /api/auth/me
router.get('/me', authMiddleware, authCtrl.getMe);

export default router;
