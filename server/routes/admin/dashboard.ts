import express from 'express';
import { protect, authorize } from '../../middleware/auth';
import { getDashboardStats, getAnalytics } from '../../controllers/admin/dashboardController';

const router = express.Router();

// All routes require admin authentication
router.use(protect as any);
router.use(authorize('admin'));

// Dashboard routes
router.get('/stats', getDashboardStats);
router.get('/analytics', getAnalytics);

export default router;
