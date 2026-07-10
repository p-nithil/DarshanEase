const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUser, deleteUser, updateProfile, updatePassword } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.put('/profile/update', protect, updateProfile);
router.put('/profile/password', protect, updatePassword);

router.route('/')
  .get(protect, authorize('admin'), getUsers);

router.route('/:id')
  .get(protect, authorize('admin'), getUserById)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

module.exports = router;
