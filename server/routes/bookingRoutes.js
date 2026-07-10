const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getBookingById, cancelBooking, getAllBookings, updateBookingStatus } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');
const { validate, bookingSchema } = require('../validations/schemas');

router.route('/')
  .post(protect, validate(bookingSchema), createBooking);

router.get('/my', protect, getMyBookings);
router.get('/all', protect, authorize('admin'), getAllBookings);

router.route('/:id')
  .get(protect, getBookingById);

router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/status', protect, authorize('admin'), updateBookingStatus);

module.exports = router;
