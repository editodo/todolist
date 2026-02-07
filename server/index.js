const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Trust Proxy (Required for Nginx HTTPS)
app.enable('trust proxy');

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(bodyParser.json());

// Session Middleware (Required for Admin Login)
app.use(session({
  secret: process.env.SESSION_SECRET || 'editodo-super-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true if https
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Database Check
const db = require('./db');

// Main Server Function
const startServer = async () => {

  // Routes
  const authRoutes = require('./routes/auth');
  const todoRoutes = require('./routes/todos');
  const diaryRoutes = require('./routes/diaries');
  const preferenceRoutes = require('./routes/preferences');
  const adminRoutes = require('./routes/admin');

  app.use('/api/auth', authRoutes);
  app.use('/api/todos', todoRoutes);
  app.use('/api/diaries', diaryRoutes);
  app.use('/api/preferences', preferenceRoutes);
  app.use('/api/admin', adminRoutes); // Mount Admin Routes

  app.get('/', (req, res) => {
    res.send('EditoTodo API Service is running.');
  });

  // Start Server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();
