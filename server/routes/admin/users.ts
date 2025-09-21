import express from 'express';
import { protect, authorize } from '../../middleware/auth';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  suspendUser,
  activateUser,
  getUserAnalytics,
  exportUsers
} from '../../controllers/admin/userController';

const router = express.Router();

// All routes require admin authentication
router.use(protect as any);
router.use(authorize('admin'));

// User routes
router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/suspend', suspendUser);
router.patch('/:id/activate', activateUser);
router.get('/analytics', getUserAnalytics);
router.get('/export', exportUsers);

export default router;
