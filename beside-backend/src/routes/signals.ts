import { Router } from 'express';
import { signalController } from '../controllers/signalController';

const router = Router();

// GET /api/v1/signals/nearby - 獲取附近的焦慮信號
router.get('/nearby', signalController.getNearbySignals);

// POST /api/v1/signals - 發送焦慮信號
router.post('/', signalController.createSignal);

// DELETE /api/v1/signals/:id - 取消焦慮信號
router.delete('/:id', signalController.cancelSignal);

// POST /api/v1/signals/:id/respond - 回應焦慮信號
router.post('/:id/respond', signalController.respondToSignal);

// GET /api/v1/signals/my - 獲取我的信號
router.get('/my', signalController.getMySignals);

// GET /api/v1/signals/responses - 獲取收到的回應
router.get('/responses', signalController.getMyResponses);

// GET /api/v1/signals/statistics - 獲取統計數據
router.get('/statistics', signalController.getStatistics);

export default router;
