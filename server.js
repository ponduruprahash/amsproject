const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Set environment variables for email and WhatsApp services
process.env.TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || 'AC292b036d5d7b0f76d5f8b61a95c19e5f';
process.env.TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '69fda4f7b879ea4b8db81e61c4e72c3f';
process.env.TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
process.env.SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
process.env.SMTP_PORT = process.env.SMTP_PORT || '587';
process.env.SMTP_USER = process.env.SMTP_USER || 'sankancharl619@gmail.com';
process.env.SMTP_PASS = process.env.SMTP_PASS || 'qvegnvsxixealfsq';
process.env.SCHOOL_FROM_EMAIL = process.env.SCHOOL_FROM_EMAIL || 'sankancharl619@gmail.com';

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/Images', express.static(path.join(__dirname, 'Images')));
app.use('/Styles', express.static(path.join(__dirname, 'Styles')));

// Routes
app.use('/api/enroll', require('./routes/enroll'));
app.use('/api/chatbot', require('./routes/chatbot'));

// Serve HTML pages with proper flow: Login → Main → Enroll
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/main', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.html'));
});

app.get('/enroll', (req, res) => {
  res.sendFile(path.join(__dirname, 'enroll.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AMS Admission System running on port ${PORT}`);
  console.log(`📧 Email notifications: ${process.env.GMAIL_USER ? 'Enabled' : 'Disabled'}`);
  console.log(`📱 WhatsApp notifications: ${process.env.TWILIO_ACCOUNT_SID ? 'Enabled' : 'Disabled'}`);
  console.log(`🗄️  Database: SQLite (ams.db)`);
});
