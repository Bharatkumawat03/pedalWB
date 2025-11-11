import express from 'express';
import { protect, authorize } from '../../middleware/auth';
import {
  getSubscribers,
  getSubscriber,
  updateSubscriber,
  deleteSubscriber,
  bulkUnsubscribe,
  getNewsletterAnalytics
} from '../../controllers/admin/newsletterController';

const router = express.Router();

// All routes require admin authentication
router.use(protect as any);
router.use(authorize('admin'));

// Newsletter subscriber routes
router.get('/', getSubscribers);
router.get('/analytics', getNewsletterAnalytics);
router.get('/:id', getSubscriber);
router.patch('/:id', updateSubscriber);
router.delete('/:id', deleteSubscriber);
router.post('/bulk-unsubscribe', bulkUnsubscribe);

export default router;



