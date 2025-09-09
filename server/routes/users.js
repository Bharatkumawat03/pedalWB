const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  getAddresses,
  getDashboard,
  updatePreferences,
  getAllUsers,
  updateUserStatus,
  deleteUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { validate, addressSchema } = require('../middleware/validation');

const router = express.Router();

// All user routes require authentication
router.use(protect);

// User routes
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.get('/dashboard', getDashboard);
router.put('/preferences', updatePreferences);

// Address routes
router.get('/addresses', getAddresses);
router.post('/addresses', validate(addressSchema), addAddress);
router.put('/addresses/:addressId', validate(addressSchema), updateAddress);
router.delete('/addresses/:addressId', deleteAddress);

// Admin routes
router.get('/admin/all', authorize('admin'), getAllUsers);
router.put('/:id/status', authorize('admin'), updateUserStatus);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;