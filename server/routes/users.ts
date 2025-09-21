import express from 'express';
import { protect } from '../middleware/auth';
import { 
  updateProfile, 
  getUserAddresses, 
  addUserAddress, 
  updateUserAddress, 
  deleteUserAddress 
} from '../controllers/userController';
import User from '../models/User';

const router = express.Router();

// User profile routes (protected)
router.use(protect as any);

// User profile management
router.get('/profile', async (req, res, next) => {
  try {
    console.log('Profile route - User ID from request:', (req as any).user?.id);
    
    // Get user directly from database using the ID from the authenticated request
    const user = await User.findById((req as any).user?.id).select('-password');
    
    if (!user) {
      console.log('Profile route - User not found in database');
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    console.log('Profile route - User found:', user.email);
    return res.json({ success: true, data: user });
  } catch (error) {
    console.log('Profile route - Error:', error);
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
