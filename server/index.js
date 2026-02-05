const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Check
const db = require('./db');

// Routes
// Routes
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const diaryRoutes = require('./routes/diaries');
const preferenceRoutes = require('./routes/preferences');

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/diaries', diaryRoutes);
app.use('/api/preferences', preferenceRoutes);

app.get('/', (req, res) => {
  res.send('EditoTodo API Service is running.');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
