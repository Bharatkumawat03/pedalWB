import express from 'express';
import { protect, authorize } from '../../middleware/auth';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImages,
  bulkUpdateProducts,
  bulkDeleteProducts
} from '../../controllers/admin/productController';

const router = express.Router();

// All routes require admin authentication
router.use(protect as any);
router.use(authorize('admin'));

// Product routes
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.post('/upload-images', uploadImages);
router.patch('/bulk-update', bulkUpdateProducts);
router.delete('/bulk-delete', bulkDeleteProducts);

export default router;
