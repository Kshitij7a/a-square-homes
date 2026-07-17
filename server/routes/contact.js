// ─── Contact Route — POST /api/contact ────────────────────────
// Validates form data, then sends email via Resend.

const express   = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const sendContactEmail = require('../utils/sendEmail');

const router = express.Router();

// ── Rate limiter: max 5 submissions per IP per 15 min ─────────
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many submissions. Please try again in a few minutes.'
  }
});

// ── Validation rules ──────────────────────────────────────────
const validateContact = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ max: 100 }).withMessage('Name is too long.'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please enter a valid email address.')
    .normalizeEmail(),

  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required.')
    .matches(/^[+\d\s()-]{7,20}$/).withMessage('Please enter a valid phone number.'),

  body('projectType')
    .optional({ checkFalsy: true })
    .trim()
    .isIn(['New Home', 'Renovation', 'Commercial Space', 'Styling Only'])
    .withMessage('Invalid project type.'),

  body('budget')
    .optional({ checkFalsy: true })
    .trim(),

  body('message')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 2000 }).withMessage('Message is too long (max 2000 characters).')
];

// ── POST /api/contact ─────────────────────────────────────────
router.post('/', contactLimiter, validateContact, async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array()[0].msg   // return first error only
    });
  }

  try {
    const { name, email, phone, projectType, budget, message } = req.body;

    await sendContactEmail({ name, email, phone, projectType, budget, message });

    console.log(`✓ Enquiry received from ${name} <${email}>`);

    return res.status(200).json({
      success: true,
      message: 'Thank you — we\'ll be in touch within 24 hours.'
    });
  } catch (err) {
    console.error('✗ Email send failed:', err.message);

    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again or email us directly.'
    });
  }
});

module.exports = router;
