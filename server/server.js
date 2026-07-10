const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// CORS configuration (essential for frontend cookie communication)
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
  })
);

// Import routers
const authRouter = require('./routes/authRoutes');
const templeRouter = require('./routes/templeRoutes');
const slotRouter = require('./routes/slotRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const userRouter = require('./routes/userRoutes');

// Mount routes
app.use('/api/auth', authRouter);
app.use('/api/temples', templeRouter);
app.use('/api/slots', slotRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/users', userRouter);

// Base route
app.get('/', (req, res) => {
  res.send('DarshanEase Backend API is running successfully');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
