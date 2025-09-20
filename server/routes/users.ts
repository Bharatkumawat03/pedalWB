import express from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateProfile,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress
} from '../controllers/userController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// User profile routes (protected)
router.use(protect as any);

// User profile management
// router.get('/profile', async (req, res, next) => {
//   try {
//     const authService = require('../services/authService').default;
//     const user = await authService.getCurrentUser((req as any).user?.id);
    
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }
    
//     res.json({ success: true, data: user });
//   } catch (error) {
//     next(error);
//   }
// });
router.put('/profile', updateProfile);

// Address management
router.get('/addresses', getUserAddresses);
router.post('/addresses', addUserAddress);
router.put('/addresses/:addressId', updateUserAddress);
router.delete('/addresses/:addressId', deleteUserAddress);

// Admin routes
router.use(authorize('admin') as any);
router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;