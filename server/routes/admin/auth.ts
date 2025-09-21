import express from 'express';
import { protect, authorize } from '../../middleware/auth';
import { loginAdmin, getCurrentAdmin, logoutAdmin } from '../../controllers/admin/authController';

const router = express.Router();

// Admin authentication routes
router.post('/login', loginAdmin);
router.get('/me', protect, authorize('admin'), getCurrentAdmin);
router.post('/logout', protect, authorize('admin'), logoutAdmin);

export default router;
