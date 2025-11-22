import express from 'express';
import {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  toggleBrandStatus,
  getBrandStats,
  updateProductCounts,
  bulkUpdateBrands,
  bulkDeleteBrands
} from '../controllers/brandController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getBrands);
router.get('/stats', getBrandStats);
router.get('/:id', getBrand);

// Protected routes (require authentication)
router.post('/', protect, authorize('admin'), createBrand);
router.put('/:id', protect, authorize('admin'), updateBrand);
router.delete('/:id', protect, authorize('admin'), deleteBrand);
router.patch('/:id/toggle-status', protect, authorize('admin'), toggleBrandStatus);
router.post('/update-product-counts', protect, authorize('admin'), updateProductCounts);
router.put('/bulk/update', protect, authorize('admin'), bulkUpdateBrands);
router.delete('/bulk/delete', protect, authorize('admin'), bulkDeleteBrands);

export default router;
