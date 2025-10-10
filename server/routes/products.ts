import express from 'express';
import {
  getProducts,
  getProduct,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsByCategory,
  getRelatedProducts
} from '../controllers/productController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new', getFeaturedProducts); // Using featured for now
router.get('/search', getProducts); // Using main getProducts for search
router.get('/category/:category', getProductsByCategory);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProduct);
router.get('/:id/related', getRelatedProducts);
router.get('/:id/reviews', async (req, res, next) => {
  try {
    const Review = require('../models/Review').default;
    const { page = 1, limit = 10, sort = 'newest' } = req.query;
    
    const sortOptions: any = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      highest: { rating: -1 },
      lowest: { rating: 1 }
    };
    
    const reviews = await Review.find({ product: req.params.id })
      .populate('user', 'firstName lastName avatar')
      .sort(sortOptions[sort as string] || sortOptions.newest)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
    const total = await Review.countDocuments({ product: req.params.id });
    
    res.json({
      success: true,
      data: reviews,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / Number(limit)),
        count: reviews.length,
        totalReviews: total
      }
    });
  } catch (error) {
    next(error);
  }
});

// Protected admin routes
router.use(protect);
router.use(authorize('admin'));

router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;