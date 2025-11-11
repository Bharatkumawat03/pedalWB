import express from 'express';
import { protect, authorize } from '../../middleware/auth';
import {
  getContactMessages,
  getContactMessage,
  updateContactMessage,
  deleteContactMessage,
  getContactAnalytics
} from '../../controllers/admin/contactController';

const router = express.Router();

// All routes require admin authentication
router.use(protect as any);
router.use(authorize('admin'));

// Contact message routes
router.get('/', getContactMessages);
router.get('/analytics', getContactAnalytics);
router.get('/:id', getContactMessage);
router.patch('/:id', updateContactMessage);
router.delete('/:id', deleteContactMessage);

export default router;



