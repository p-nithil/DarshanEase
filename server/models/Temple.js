const mongoose = require('mongoose');

const darshanTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  }
});

const templeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a temple name'],
      unique: true,
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'Please add a state/district'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add a description']
    },
    images: {
      type: [String],
      default: []
    },
    timings: {
      type: String,
      required: [true, 'Please add temple timings (e.g. 6:00 AM - 9:00 PM)']
    },
    darshanTypes: {
      type: [darshanTypeSchema],
      default: []
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Temple', templeSchema);
