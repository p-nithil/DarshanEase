const { z } = require('zod');

// Express middleware for Zod validation
exports.validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages
      });
    }
    next(error);
  }
};

// Auth Schemas
exports.registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please provide a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

exports.loginSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required')
});

// Temple Schemas
exports.templeSchema = z.object({
  name: z.string().min(3, 'Temple name must be at least 3 characters'),
  location: z.string().min(3, 'Location is required'),
  state: z.string().min(2, 'State/District is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  images: z.array(z.string().url('Invalid image URL')).optional().default([]),
  timings: z.string().min(3, 'Timings are required (e.g. 6:00 AM - 9:00 PM)'),
  darshanTypes: z.array(
    z.object({
      name: z.string().min(2, 'Darshan name is required'),
      price: z.number().min(0, 'Price must be 0 or greater'),
      description: z.string().optional()
    })
  ).min(1, 'At least one darshan type is required')
});

// Slot Schemas
exports.slotSchema = z.object({
  templeId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Temple ID'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format'
  }),
  darshanType: z.string().min(2, 'Darshan type is required'),
  timeSlot: z.string().min(3, 'Time slot is required'),
  totalCapacity: z.number().int().min(1, 'Capacity must be at least 1')
});

// Booking Schemas
exports.bookingSchema = z.object({
  templeId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Temple ID'),
  slotId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Slot ID'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format'
  }),
  darshanType: z.string().min(2, 'Darshan type is required'),
  timeSlot: z.string().min(3, 'Time slot is required'),
  persons: z.number().int().min(1, 'Devotees count must be at least 1').max(20, 'Max 20 tickets per booking'),
  totalPrice: z.number().min(0, 'Total price must be positive')
});
