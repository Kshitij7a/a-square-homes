// ─── A Square Homes — Express Server ──────────────────────────
// Entry point: serves static frontend + exposes /api/contact

require('dotenv').config();

const express  = require('express');
const path     = require('path');
const cors     = require('cors');
const helmet   = require('helmet');

const contactRouter = require('./routes/contact');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Security ──────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,   // allow inline styles/scripts in our HTML
  crossOriginEmbedderPolicy: false
}));

// ── CORS (only needed if frontend ever runs on a different origin) ──
app.use(cors());

// ── Body parsing ──────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static files (serves public/ as root) ─────────────────────
app.use(express.static(path.join(__dirname, '..', 'public')));

// ── API routes ────────────────────────────────────────────────
app.use('/api/contact', contactRouter);

// ── Fallback: serve index.html for any unknown GET request ────
app.get('{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  ◆ A Square Homes server running at http://localhost:${PORT}\n`);
});
