import { Router } from 'express';
import { authController } from '../controllers/authController';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', authController.register);

// POST /api/v1/auth/login
router.post('/login', authController.login);

// POST /api/v1/auth/logout
router.post('/logout', authController.logout);

// GET /api/v1/auth/me
router.get('/me', authController.getProfile);

// PUT /api/v1/auth/profile
router.put('/profile', authController.updateProfile);

export default router;
