const mongoose = require('mongoose');

const darshanSlotSchema = new mongoose.Schema(
  {
    templeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Temple',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    darshanType: {
      type: String,
      required: true,
      trim: true
    },
    timeSlot: {
      type: String,
      required: true,
      trim: true
    },
    totalCapacity: {
      type: Number,
      required: true,
      min: 1
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 0
    },
    bookedSeats: {
      type: Number,
      default: 0,
      min: 0
    },
    status: {
      type: String,
      enum: ['active', 'cancelled'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure uniqueness of slots on date/timeslot/type per temple
darshanSlotSchema.index({ templeId: 1, date: 1, darshanType: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('DarshanSlot', darshanSlotSchema);
