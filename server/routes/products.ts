import express from 'express';
import {
  getProducts,
  getProduct,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewProducts,
  getBestSellers,
  getProductsByCategory,
  getRelatedProducts
} from '../controllers/productController';
import {
  getProductReviews,
  canUserRate,
  submitRating,
  submitReview
} from '../controllers/reviewController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new', getNewProducts);
router.get('/bestsellers', getBestSellers);
router.get('/search', getProducts); // Using main getProducts for search
router.get('/category/:category', getProductsByCategory);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProduct);
router.get('/:id/related', getRelatedProducts);
router.get('/:id/reviews', getProductReviews);

// Protected routes for rating/reviewing
router.get('/:productId/can-rate', protect, canUserRate);
router.post('/:productId/rate', protect, submitRating);
router.post('/:productId/review', protect, submitReview);

// Protected admin routes
router.use(protect);
router.use(authorize('admin'));

router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;