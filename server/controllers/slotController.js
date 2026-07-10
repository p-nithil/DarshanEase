const DarshanSlot = require('../models/DarshanSlot');
const Temple = require('../models/Temple');

// @desc    Get all slots
// @route   GET /api/slots
// @access  Public
exports.getSlots = async (req, res, next) => {
  try {
    const { templeId, date } = req.query;
    let query = { status: 'active' };

    if (templeId) query.templeId = templeId;
    
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const slots = await DarshanSlot.find(query).populate('templeId', 'name location state');

    res.status(200).json({
      success: true,
      count: slots.length,
      data: slots
    });
  } catch (error) {
    console.error('GetSlots error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving slots' });
  }
};

// @desc    Get slots for a specific temple
// @route   GET /api/slots/:templeId
// @access  Public
exports.getSlotsByTemple = async (req, res, next) => {
  try {
    const { date } = req.query;
    let query = { templeId: req.params.templeId, status: 'active' };

    if (date) {
      const startDate = new Date(date);
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setUTCHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const slots = await DarshanSlot.find(query);

    res.status(200).json({
      success: true,
      count: slots.length,
      data: slots
    });
  } catch (error) {
    console.error('GetSlotsByTemple error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving temple slots' });
  }
};

// @desc    Create a single slot
// @route   POST /api/slots
// @access  Private/Admin
exports.createSlot = async (req, res, next) => {
  try {
    const { templeId, date, darshanType, timeSlot, totalCapacity } = req.body;

    const temple = await Temple.findById(templeId);
    if (!temple) {
      return res.status(404).json({ success: false, message: 'Temple not found' });
    }

    // Check if slot already exists
    const slotDate = new Date(date);
    slotDate.setUTCHours(0, 0, 0, 0);

    const existingSlot = await DarshanSlot.findOne({
      templeId,
      date: slotDate,
      darshanType,
      timeSlot
    });

    if (existingSlot) {
      return res.status(400).json({
        success: false,
        message: 'A slot with this timing and type already exists for this date'
      });
    }

    const slot = await DarshanSlot.create({
      templeId,
      date: slotDate,
      darshanType,
      timeSlot,
      totalCapacity,
      availableSeats: totalCapacity,
      bookedSeats: 0
    });

    res.status(201).json({
      success: true,
      data: slot
    });
  } catch (error) {
    console.error('CreateSlot error:', error.message);
    res.status(500).json({ success: false, message: 'Server error creating slot' });
  }
};

// @desc    Update a slot
// @route   PUT /api/slots/:id
// @access  Private/Admin
exports.updateSlot = async (req, res, next) => {
  try {
    let slot = await DarshanSlot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' });
    }

    const { totalCapacity, status } = req.body;

    if (totalCapacity !== undefined) {
      const seatsDifference = totalCapacity - slot.totalCapacity;
      const newAvailableSeats = slot.availableSeats + seatsDifference;

      if (newAvailableSeats < 0) {
        return res.status(400).json({
          success: false,
          message: 'New capacity is less than currently booked seats'
        });
      }

      slot.totalCapacity = totalCapacity;
      slot.availableSeats = newAvailableSeats;
    }

    if (status !== undefined) {
      slot.status = status;
    }

    await slot.save();

    res.status(200).json({
      success: true,
      data: slot
    });
  } catch (error) {
    console.error('UpdateSlot error:', error.message);
    res.status(500).json({ success: false, message: 'Server error updating slot' });
  }
};

// @desc    Delete a slot
// @route   DELETE /api/slots/:id
// @access  Private/Admin
exports.deleteSlot = async (req, res, next) => {
  try {
    const slot = await DarshanSlot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' });
    }

    if (slot.bookedSeats > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a slot that already has bookings. Try cancelling it instead.'
      });
    }

    await DarshanSlot.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Slot deleted successfully'
    });
  } catch (error) {
    console.error('DeleteSlot error:', error.message);
    res.status(500).json({ success: false, message: 'Server error deleting slot' });
  }
};

// @desc    Bulk generate slots for a date range
// @route   POST /api/slots/generate
// @access  Private/Admin
exports.generateSlots = async (req, res, next) => {
  try {
    const { templeId, startDate, endDate, timeSlots, darshanTypes, totalCapacity } = req.body;

    const temple = await Temple.findById(templeId);
    if (!temple) {
      return res.status(404).json({ success: false, message: 'Temple not found' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let createdCount = 0;
    let duplicateCount = 0;

    // Loop through each day from start to end date
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const currentDate = new Date(d);
      currentDate.setUTCHours(0, 0, 0, 0);

      for (const tType of darshanTypes) {
        for (const tSlot of timeSlots) {
          try {
            await DarshanSlot.create({
              templeId,
              date: currentDate,
              darshanType: tType,
              timeSlot: tSlot,
              totalCapacity,
              availableSeats: totalCapacity,
              bookedSeats: 0
            });
            createdCount++;
          } catch (err) {
            // Uniqueness compound index check
            duplicateCount++;
          }
        }
      }
    }

    res.status(201).json({
      success: true,
      message: `Slots generation complete. Created: ${createdCount}, Skipped duplicates: ${duplicateCount}`
    });
  } catch (error) {
    console.error('GenerateSlots error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during bulk slot generation' });
  }
};
