const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    templeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Temple',
      required: true
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DarshanSlot',
      required: true
    },
    bookingCode: {
      type: String,
      required: true,
      unique: true
    },
    date: {
      type: Date,
      required: true
    },
    darshanType: {
      type: String,
      required: true
    },
    timeSlot: {
      type: String,
      required: true
    },
    persons: {
      type: Number,
      required: true,
      min: 1
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
