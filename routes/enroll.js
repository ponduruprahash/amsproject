const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Import services
const DatabaseService = require('../services/database');
const WhatsAppService = require('../services/whatsapp');
const EmailService = require('../services/email');

// Validation rules
const enrollmentValidation = [
  body('parent_name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Parent name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('phone')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('city')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be between 2 and 100 characters'),
  body('grade')
    .isIn(['kg', '1', '2', '3', '4', '5', '6', '7'])
    .withMessage('Please select a valid grade'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Message must not exceed 1000 characters')
];

// POST /api/enroll - Handle enrollment form submission
router.post('/', enrollmentValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        ok: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      parent_name,
      email,
      phone,
      city,
      grade,
      message = ''
    } = req.body;

    // Generate unique reference number
    const referenceNumber = `AMS${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Create applicant object
    const applicant = {
      id: uuidv4(),
      reference_number: referenceNumber,
      parent_name,
      email,
      phone,
      city,
      grade,
      message,
      status: 'new',
      created_at: new Date().toISOString()
    };

    // Save to database
    const dbResult = await DatabaseService.saveApplicant(applicant);
    if (!dbResult.success) {
      console.error('Database error:', dbResult.error);
      return res.status(500).json({
        ok: false,
        error: 'Failed to save application. Please try again.'
      });
    }

    // Send notifications asynchronously (don't wait for them)
    console.log('📧 Sending notifications...');
    Promise.allSettled([
      WhatsAppService.sendConfirmation(phone, referenceNumber, parent_name, grade, applicant),
      EmailService.sendConfirmation(email, applicant)
    ]).then(results => {
      const [whatsappResult, emailResult] = results;
      
      console.log('📱 WhatsApp result:', whatsappResult.status, whatsappResult.value || whatsappResult.reason);
      console.log('📧 Email result:', emailResult.status, emailResult.value || emailResult.reason);
      
      if (whatsappResult.status === 'rejected') {
        console.error('WhatsApp notification failed:', whatsappResult.reason);
      }
      if (emailResult.status === 'rejected') {
        console.error('Email notification failed:', emailResult.reason);
      }
    });

    // Return success response immediately
    res.json({
      ok: true,
      message: 'Application submitted successfully!',
      reference_number: referenceNumber,
      applicant_id: applicant.id
    });

  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({
      ok: false,
      error: 'Internal server error. Please try again later.'
    });
  }
});

// GET /api/enroll/stats - Get enrollment statistics (for admin)
router.get('/stats', async (req, res) => {
  try {
    const stats = await DatabaseService.getEnrollmentStats();
    res.json({
      ok: true,
      stats
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch statistics'
    });
  }
});

module.exports = router;
