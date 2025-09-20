import express from 'express';
import { protect } from '../middleware/auth';
import { 
  updateProfile, 
  getUserAddresses, 
  addUserAddress, 
  updateUserAddress, 
  deleteUserAddress 
} from '../controllers/userController';

const router = express.Router();

// User profile routes (protected)
router.use(protect as any);

// User profile management
router.get('/profile', async (req, res, next) => {
  try {
    const authService = require('../services/authService').default;
    const user = await authService.getCurrentUser((req as any).user?.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    return res.json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
});

router.put('/profile', updateProfile);

// Address management
router.get('/addresses', getUserAddresses);
router.post('/addresses', addUserAddress);
router.put('/addresses/:addressId', updateUserAddress);
router.delete('/addresses/:addressId', deleteUserAddress);

export default router;
