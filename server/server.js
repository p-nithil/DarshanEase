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

// CORS configuration — allow any Vercel domain + localhost in dev
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    // Allow any vercel.app subdomain automatically
    const isVercel = /\.vercel\.app$/.test(origin);

    if (allowedOrigins.includes(origin) || isVercel) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

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
  res.json({ message: 'DarshanEase Backend API is running 🛕' });
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
