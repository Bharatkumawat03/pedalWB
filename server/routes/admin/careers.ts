import express from 'express';
import { protect, authorize } from '../../middleware/auth';
import {
  getJobApplications,
  getJobApplication,
  updateJobApplication,
  deleteJobApplication,
  getCareerAnalytics
} from '../../controllers/admin/careerController';

const router = express.Router();

// All routes require admin authentication
router.use(protect as any);
router.use(authorize('admin'));

// Career application routes
router.get('/', getJobApplications);
router.get('/analytics', getCareerAnalytics);
router.get('/:id', getJobApplication);
router.patch('/:id', updateJobApplication);
router.delete('/:id', deleteJobApplication);

export default router;



