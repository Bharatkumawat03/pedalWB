import express from 'express';
import {
  getCategories,
  getCategory,
  getCategoryProducts,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:slug', getCategory);
router.get('/:slug/products', getCategoryProducts);

// Protected admin routes
router.use(protect);
router.use(authorize('admin'));

router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;