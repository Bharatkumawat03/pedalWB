import express from 'express';
import {
  getCategories,
  getCategory,
  getCategoryBySlug,
  getCategoryProducts,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/slug/:slug', getCategoryBySlug); // Slug-based lookup (must come before :id route)
router.get('/:slug/products', getCategoryProducts);
router.get('/:id', getCategory); // ID-based lookup (must come after slug route)

// Protected admin routes
router.use(protect);
router.use(authorize('admin'));

router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;