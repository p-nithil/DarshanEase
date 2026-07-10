const Booking = require('../models/Booking');
const DarshanSlot = require('../models/DarshanSlot');
const Temple = require('../models/Temple');

// Helper to generate unique booking code
const generateBookingCode = () => {
  return 'DE-' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const { templeId, slotId, date, darshanType, timeSlot, persons, totalPrice } = req.body;
    const userId = req.user.id;

    // Validate temple existence
    const temple = await Temple.findById(templeId);
    if (!temple) {
      return res.status(404).json({ success: false, message: 'Temple not found' });
    }

    // Atomic update to deduct available seats and prevent double booking
    const slot = await DarshanSlot.findOneAndUpdate(
      {
        _id: slotId,
        templeId,
        darshanType,
        timeSlot,
        status: 'active',
        availableSeats: { $gte: persons }
      },
      {
        $inc: { availableSeats: -persons, bookedSeats: persons }
      },
      { new: true }
    );

    if (!slot) {
      return res.status(400).json({
        success: false,
        message: 'Selected slot does not have enough available seats or is inactive'
      });
    }

    // Generate unique code
    let bookingCode = generateBookingCode();
    let codeExists = await Booking.findOne({ bookingCode });
    while (codeExists) {
      bookingCode = generateBookingCode();
      codeExists = await Booking.findOne({ bookingCode });
    }

    // Create the booking
    const booking = await Booking.create({
      userId,
      templeId,
      slotId,
      bookingCode,
      date: new Date(date),
      darshanType,
      timeSlot,
      persons,
      totalPrice,
      bookingStatus: 'confirmed'
    });

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('CreateBooking error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during booking' });
  }
};

// @desc    Get bookings of the logged-in user
// @route   GET /api/bookings/my
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('templeId', 'name location state images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('GetMyBookings error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving your bookings' });
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('templeId', 'name location state timings description images')
      .populate('userId', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Enforce check: only creator of the booking or admin can view
    if (booking.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('GetBookingById error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving booking detail' });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check if user is booking owner or admin
    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    // Update booking status
    booking.bookingStatus = 'cancelled';
    await booking.save();

    // Revert available seats in the slot
    await DarshanSlot.findByIdAndUpdate(booking.slotId, {
      $inc: { availableSeats: booking.persons, bookedSeats: -booking.persons }
    });

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    console.error('CancelBooking error:', error.message);
    res.status(500).json({ success: false, message: 'Server error cancelling booking' });
  }
};

// @desc    Get all bookings (Admin only, filters by temple, user, date, status)
// @route   GET /api/bookings/all
// @access  Private/Admin
exports.getAllBookings = async (req, res, next) => {
  try {
    const { templeId, status, search, date } = req.query;
    let query = {};

    if (templeId) query.templeId = templeId;
    if (status) query.bookingStatus = status;
    
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    let bookingsBuilder = Booking.find(query)
      .populate('templeId', 'name location state')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    let bookings = await bookingsBuilder;

    // Filter by name/email/phone from query if search query is provided
    if (search) {
      const searchLower = search.toLowerCase();
      bookings = bookings.filter((b) => {
        return (
          b.userId?.name?.toLowerCase().includes(searchLower) ||
          b.userId?.email?.toLowerCase().includes(searchLower) ||
          b.bookingCode?.toLowerCase().includes(searchLower) ||
          b.templeId?.name?.toLowerCase().includes(searchLower)
        );
      });
    }

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('GetAllBookings error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving all bookings' });
  }
};

// @desc    Admin: Change booking status (e.g. manually approve/cancel)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { bookingStatus } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.bookingStatus === bookingStatus) {
      return res.status(400).json({ success: false, message: `Booking status is already ${bookingStatus}` });
    }

    // Handle cancellation side effects
    if (bookingStatus === 'cancelled' && booking.bookingStatus !== 'cancelled') {
      await DarshanSlot.findByIdAndUpdate(booking.slotId, {
        $inc: { availableSeats: booking.persons, bookedSeats: -booking.persons }
      });
    } else if (bookingStatus === 'confirmed' && booking.bookingStatus === 'cancelled') {
      // Re-deduct seats if changed from cancelled back to confirmed
      const slot = await DarshanSlot.findOneAndUpdate(
        { _id: booking.slotId, availableSeats: { $gte: booking.persons } },
        { $inc: { availableSeats: -booking.persons, bookedSeats: booking.persons } }
      );
      if (!slot) {
        return res.status(400).json({ success: false, message: 'Cannot restore booking, not enough seats left' });
      }
    }

    booking.bookingStatus = bookingStatus;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('UpdateBookingStatus error:', error.message);
    res.status(500).json({ success: false, message: 'Server error updating booking status' });
  }
};
