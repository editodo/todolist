const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const { rateLimit } = require('express-rate-limit');
require('dotenv').config({ path: require('path').join(__dirname, '.env'), override: true }); // .env wins over stale PM2 env

// Refuse to start with missing secrets instead of falling back to guessable defaults
const missing = ['JWT_SECRET', 'SESSION_SECRET'].filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`❌ Missing required env: ${missing.join(', ')} (set them in server/.env)`);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Trust exactly one proxy hop (Nginx). 'true' would let clients fake X-Forwarded-For and dodge the rate limits.
app.set('trust proxy', 1);

// Native apps send no Origin header, so this only restricts browsers (web build + admin)
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
  : ['https://editodo.com', 'https://www.editodo.com'];
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push(/^http:\/\/localhost:\d+$/); // Expo web dev server on any port
}

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(bodyParser.json());

// Brute-force / spam protection on login, join and guest creation
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, message: { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' } });
app.use(['/api/auth/login', '/api/auth/join', '/api/auth/guest-login', '/api/auth/password-reset', '/api/auth/social', '/api/admin/login'], authLimiter);

// Session Middleware (Required for Admin Login)
app.use(session({
  secret: process.env.SESSION_SECRET,
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

  // Tables added after the original schema; IF NOT EXISTS keeps this safe on every start
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS password_resets (
        user_id INT PRIMARY KEY,
        code_hash VARCHAR(64) NOT NULL,
        expires_at DATETIME NOT NULL,
        attempts INT NOT NULL DEFAULT 0
      )`);
    await db.query(`
      CREATE TABLE IF NOT EXISTS social_accounts (
        provider VARCHAR(20) NOT NULL,
        provider_user_id VARCHAR(255) NOT NULL,
        user_id INT NOT NULL,
        apple_refresh_token TEXT NULL,
        apple_client_id VARCHAR(255) NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (provider, provider_user_id),
        KEY idx_social_user (user_id)
      )`);
    // Added after first release: which Apple client (iOS bundle / web Services ID) issued the token
    await db.query('ALTER TABLE social_accounts ADD COLUMN IF NOT EXISTS apple_client_id VARCHAR(255) NULL AFTER apple_refresh_token');
    // 글꼴 변경 / 언어 settings
    await db.query('ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS font_id INT NULL, ADD COLUMN IF NOT EXISTS language VARCHAR(5) NULL');
    await require('./routes/fonts').ensureFontTables();
    // Not-signed-in accounts no longer expire; they're removed after 1 year without opening the app
    await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active_at DATETIME NULL');
    await db.query("UPDATE users SET expires_at = NULL WHERE user_type = 'GUEST' AND expires_at IS NOT NULL");
  } catch (e) {
    console.error('⚠️  Could not ensure password_resets/social_accounts tables:', e.code || e.message);
  }

  // Routes
  const authRoutes = require('./routes/auth');
  const todoRoutes = require('./routes/todos');
  const diaryRoutes = require('./routes/diaries');
  const preferenceRoutes = require('./routes/preferences');
  const adminRoutes = require('./routes/admin');

  const { requireAuth } = require('./auth');

  app.use('/api/auth', authRoutes);
  app.use('/api/todos', requireAuth, todoRoutes);
  app.use('/api/diaries', requireAuth, diaryRoutes);
  app.use('/api/preferences', requireAuth, preferenceRoutes);
  app.use('/api/admin', adminRoutes); // Mount Admin Routes
  app.use('/api/fonts', require('./routes/fonts').router); // public font catalog + uploaded font files

  // Public read-only notices for the app (managed from the admin dashboard)
  app.get('/api/notices', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT id, title, content, created_at FROM notices ORDER BY created_at DESC');
      res.json(rows);
    } catch (error) {
      console.error('Get Notices Error:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  });

  app.get('/', (req, res) => {
    res.send('EditoTodo API Service is running.');
  });

  // Start Server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Daily: remove not-signed-in accounts unused for a year (production only, so local runs never delete)
  if (process.env.NODE_ENV === 'production') {
    const { cleanupGuests } = require('./cleanup_guests');
    const run = () => cleanupGuests().catch((e) => console.error('Guest cleanup failed:', e.message));
    setTimeout(run, 60 * 1000);
    setInterval(run, 24 * 60 * 60 * 1000);
  }
};

startServer();
