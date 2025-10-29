import { Router } from 'express';
import { userController } from '../controllers/userController';

const router = Router();

// GET /api/v1/users/profile - 獲取用戶資料
router.get('/profile', userController.getProfile);

// PUT /api/v1/users/profile - 更新用戶資料
router.put('/profile', userController.updateProfile);

// PUT /api/v1/users/location - 更新位置
router.put('/location', userController.updateLocation);

// GET /api/v1/users/nearby - 獲取附近用戶
router.get('/nearby', userController.getNearbyUsers);

export default router;
