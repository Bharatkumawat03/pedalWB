const express = require('express');
const {
  getCategories,
  getCategory,
  getCategoryProducts,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:slug', getCategory);
router.get('/:slug/products', getCategoryProducts);

// Admin routes
router.use(protect, authorize('admin')); // All routes below require admin authentication

router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;