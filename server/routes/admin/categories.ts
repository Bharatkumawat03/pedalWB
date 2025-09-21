import express from 'express';
import { protect, authorize } from '../../middleware/auth';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  getCategoryAnalytics
} from '../../controllers/admin/categoryController';

const router = express.Router();

// All routes require admin authentication
router.use(protect as any);
router.use(authorize('admin'));

// Category routes
router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.patch('/:id/toggle-status', toggleCategoryStatus);
router.get('/analytics', getCategoryAnalytics);

export default router;
