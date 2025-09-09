const express = require('express');
const {
  getProducts,
  getProduct,
  getFeaturedProducts,
  getNewProducts,
  searchProducts,
  getProductReviews,
  addProductReview,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validate, productSchema, reviewSchema } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new', getNewProducts);
router.get('/search', searchProducts);
router.get('/:id', optionalAuth, getProduct);
router.get('/:id/reviews', getProductReviews);

// Protected routes
router.use(protect); // All routes below require authentication

router.post('/:id/reviews', validate(reviewSchema), addProductReview);

// Admin routes
router.post('/', authorize('admin'), validate(productSchema), createProduct);
router.put('/:id', authorize('admin'), validate(productSchema), updateProduct);
router.delete('/:id', authorize('admin'), deleteProduct);

module.exports = router;