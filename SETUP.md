# AMS Admission System - Setup Guide

This guide will help you set up the Alpha Model's International School Admission System on your local machine.

## 🚀 Quick Setup (5 minutes)

### 1. Prerequisites Check
Make sure you have:
- ✅ Node.js v16+ installed
- ✅ Git installed
- ✅ A code editor (VS Code recommended)

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
# Copy the example environment file
cp env.example .env

# Edit the .env file with your credentials
# (See detailed configuration below)
```

### 4. Start the Server
```bash
# Option 1: Using npm
npm run dev

# Option 2: Using the batch file (Windows)
start.bat

# Option 3: Direct node command
node server.js
```

### 5. Access the Application
- **Homepage**: http://localhost:3000
- **Enrollment Form**: http://localhost:3000/enroll
- **Health Check**: http://localhost:3000/api/health

## 📋 Detailed Configuration

### Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

```env
# ========================================
# SERVER CONFIGURATION
# ========================================
PORT=3000
NODE_ENV=development

# ========================================
# TWILIO CONFIGURATION (WhatsApp)
# ========================================
# Get these from https://console.twilio.com/
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# ========================================
# GMAIL CONFIGURATION (Email)
# ========================================
# Use your Gmail address
GMAIL_USER=your_gmail_address@gmail.com
# Use App Password (not your regular password)
GMAIL_PASSWORD=your_gmail_app_password_here

# ========================================
# SCHOOL INFORMATION
# ========================================
SCHOOL_NAME="Alpha Model's International School"
SCHOOL_EMAIL=admissions@alphamodels.in
SCHOOL_PHONE=9949128732
SCHOOL_ADDRESS="Plot no: 395, Road no: 06, Raghavendra Colony, Beeramguda, Telangana 502032"

# ========================================
# SECURITY
# ========================================
SESSION_SECRET=your_random_secret_string_here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🔧 Service Setup

### WhatsApp Setup (Twilio)

1. **Create Twilio Account**
   - Go to [Twilio Console](https://console.twilio.com/)
   - Sign up for a free account
   - Verify your email and phone number

2. **Get Credentials**
   - In Twilio Console, find your Account SID and Auth Token
   - Copy them to your `.env` file

3. **Enable WhatsApp Sandbox**
   - Go to Messaging → Try it out → Send a WhatsApp message
   - Follow the instructions to join your sandbox
   - Use the provided number in `TWILIO_WHATSAPP_FROM`

4. **Test WhatsApp**
   - Send a test message to your sandbox number
   - Reply with the provided code to activate

### Email Setup (Gmail)

1. **Enable 2-Factor Authentication**
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → Turn it on

2. **Generate App Password**
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" and generate a password
   - Use this password in `GMAIL_PASSWORD` (not your regular password)

3. **Test Email**
   - The system will automatically test the email connection on startup
   - Check console logs for email service status

## 🗄️ Database Setup

The SQLite database is automatically created when you first run the server:

```bash
# Database file will be created at:
ams.db

# Tables are automatically created:
# - applicants (stores all enrollment applications)
```

## 🧪 Testing the System

### 1. Test the Enrollment Form
1. Go to http://localhost:3000/enroll
2. Fill out the form with test data
3. Submit the form
4. Check for:
   - Success message on the page
   - Email confirmation (if configured)
   - WhatsApp message (if configured)
   - Database entry (check console logs)

### 2. Test the Chatbot
1. Click the "Need Help?" button (bottom-right)
2. Try asking questions like:
   - "What are the admission dates?"
   - "How much are the fees?"
   - "Where is the school located?"
   - "What's your contact number?"

### 3. Test API Endpoints
```bash
# Health check
curl http://localhost:3000/api/health

# Get enrollment stats
curl http://localhost:3000/api/enroll/stats

# Test chatbot
curl -X POST http://localhost:3000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "What are the admission dates?"}'
```

## 🔍 Troubleshooting

### Common Issues and Solutions

#### 1. "Module not found" errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 2. Port already in use
```bash
# Change port in .env file
PORT=3001

# Or kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

#### 3. WhatsApp not working
- ✅ Verify Twilio credentials are correct
- ✅ Check if you've joined the WhatsApp sandbox
- ✅ Ensure phone number format: +91XXXXXXXXXX
- ✅ Check Twilio console for error messages

#### 4. Email not sending
- ✅ Verify Gmail credentials
- ✅ Ensure 2FA is enabled
- ✅ Use App Password, not regular password
- ✅ Check Gmail settings for "Less secure app access"

#### 5. Database errors
- ✅ Check file permissions for `ams.db`
- ✅ Ensure sufficient disk space
- ✅ Verify SQLite is working: `node -e "console.log(require('sqlite3').version)"`

#### 6. Chatbot not responding
- ✅ Check browser console for JavaScript errors
- ✅ Verify static files are being served
- ✅ Test API endpoint directly: `curl -X POST http://localhost:3000/api/chatbot -H "Content-Type: application/json" -d '{"message": "test"}'`

### Debug Mode
```bash
# Enable debug logging
NODE_ENV=development DEBUG=* npm start

# Check specific service logs
NODE_ENV=development DEBUG=ams:* npm start
```

## 📱 Mobile Testing

### Local Network Access
To test on mobile devices on your local network:

1. **Find your IP address**
   ```bash
   # Windows
   ipconfig

   # Mac/Linux
   ifconfig
   ```

2. **Update server.js**
   ```javascript
   app.listen(PORT, '0.0.0.0', () => {
     console.log(`🚀 AMS Admission System running on http://0.0.0.0:${PORT}`);
   });
   ```

3. **Access from mobile**
   - Use your computer's IP address: `http://192.168.1.XXX:3000`
   - Ensure both devices are on the same network

## 🚀 Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
# Add all other required variables
# Consider using a production database (PostgreSQL/MySQL)
```

### Recommended Hosting Platforms
1. **Render** (Recommended for beginners)
2. **Vercel** (Great for Node.js apps)
3. **Railway** (Simple deployment)
4. **Heroku** (Traditional choice)
5. **AWS** (Advanced users)

## 📞 Support

If you encounter issues:

1. **Check the logs** - Console output contains detailed error information
2. **Verify configuration** - Double-check all environment variables
3. **Test services individually** - Test WhatsApp and email separately
4. **Check documentation** - Refer to the main README.md
5. **Contact support** - Email: admissions@alphamodels.in

## ✅ Checklist

Before going live, ensure:

- [ ] All environment variables are configured
- [ ] WhatsApp sandbox is activated and tested
- [ ] Email service is working
- [ ] Database is accessible and working
- [ ] Chatbot responds to common questions
- [ ] Form validation is working
- [ ] Mobile responsiveness is tested
- [ ] Security headers are enabled
- [ ] Rate limiting is configured
- [ ] Error handling is working

---

**Happy coding! 🎉**
