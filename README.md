# Alpha Model's International School Admission System

A complete web-based admission system for Alpha Model's International School with automated notifications, database storage, and an intelligent chatbot.

## 🚀 Features

### ✅ Core Functionality
- **Online Admission Form**: Complete enrollment form with validation
- **WhatsApp Notifications**: Instant confirmation via Twilio Sandbox
- **Email Notifications**: Professional email confirmations via Gmail SMTP
- **Database Storage**: SQLite database for applicant management
- **Chatbot Widget**: AI-powered FAQ assistant (bottom-right corner)
- **Mobile Responsive**: Works perfectly on all devices

### 📱 WhatsApp Integration
- **Complete Form Data**: All enrollment fields included in messages
- **Reference Numbers**: Unique application tracking
- **Professional Formatting**: School branding and structured layout
- **Real-time Delivery**: Instant confirmation upon form submission
- **Phone Validation**: Automatic E.164 format conversion
- **Parent Details**: Name, contact, city, grade, and custom messages

### 📧 Email Integration
- **Professional HTML Templates**: Beautiful, responsive email design
- **Complete Application Data**: All form fields included in confirmation
- **Structured Information**: Clear sections for easy reading
- **Reference Tracking**: Unique reference numbers for follow-up
- **Next Steps**: Clear guidance on admission process
- **Contact Information**: Complete school details and directions

### 🤖 Chatbot Features
- **Quick Actions**: Pre-defined buttons for common questions
- **Smart Responses**: Keyword-based FAQ matching
- **Real-time**: Instant responses to user queries
- **Topics Covered**:
  - Admission dates and process
  - Fee structure by grade
  - School location and directions
  - Contact information
  - Facilities and curriculum

## 🛠️ Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: SQLite with SQLite3
- **WhatsApp**: Twilio API (Sandbox)
- **Email**: Nodemailer with Gmail SMTP
- **Frontend**: HTML, CSS, JavaScript
- **Security**: Helmet, Rate Limiting, Input Validation

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Gmail account with App Password
- Twilio account (for WhatsApp)

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd AMS-Project
npm install
```

### 2. Environment Setup
```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your credentials
nano .env
```

### 3. Configure Environment Variables
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Twilio Configuration (WhatsApp)
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Gmail Configuration (Email)
GMAIL_USER=your_gmail_address@gmail.com
GMAIL_PASSWORD=your_gmail_app_password_here

# School Information
SCHOOL_NAME="Alpha Model's International School"
SCHOOL_EMAIL=admissions@alphamodels.in
SCHOOL_PHONE=9949128732
```

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 5. Access the Application
- **Main Page**: http://localhost:3000
- **Enrollment Form**: http://localhost:3000/enroll
- **Health Check**: http://localhost:3000/api/health

## 📁 Project Structure

```
AMS-Project/
├── server.js                 # Main server file
├── package.json             # Dependencies and scripts
├── env.example              # Environment variables template
├── ams.db                   # SQLite database (auto-created)
├── routes/                  # API route handlers
│   ├── enroll.js           # Enrollment form processing
│   └── chatbot.js          # Chatbot API endpoints
├── services/               # Business logic services
│   ├── database.js         # Database operations
│   ├── whatsapp.js         # WhatsApp notification service
│   └── email.js            # Email notification service
├── static/                 # Static assets
│   ├── css/
│   │   └── chatbot.css     # Chatbot widget styles
│   └── js/
│       └── chatbot.js      # Chatbot widget functionality
├── Styles/                 # Existing CSS files
├── Images/                 # School images
├── main.html              # Homepage
├── enroll.html            # Enrollment form
└── login.html             # Login page
```

## �� API Endpoints

### Enrollment
- `POST /api/enroll` - Submit enrollment application
- `GET /api/enroll/stats` - Get enrollment statistics

### Chatbot
- `POST /api/chatbot` - Send message to chatbot
- `GET /api/chatbot/faqs` - Get all FAQ data

### Health Check
- `GET /api/health` - Server health status

## 📱 WhatsApp Setup

### 1. Twilio Account Setup
1. Sign up at [Twilio](https://www.twilio.com/)
2. Get your Account SID and Auth Token
3. Enable WhatsApp Sandbox

### 2. WhatsApp Sandbox Configuration
1. Go to Twilio Console → Messaging → Try it out → Send a WhatsApp message
2. Follow instructions to join your sandbox
3. Use the provided number in `TWILIO_WHATSAPP_FROM`

## 📧 Email Setup

### 1. Gmail App Password
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use this password in `GMAIL_PASSWORD`

### 2. Gmail Settings
- Use your Gmail address in `GMAIL_USER`
- The app password in `GMAIL_PASSWORD`

## 🗄️ Database

The system uses SQLite for simplicity and portability:

### Tables
- **applicants**: Stores all enrollment applications
  - id, reference_number, parent_name, email, phone, city, grade, message, status, created_at, updated_at

### Database Operations
- Automatic table creation on startup
- CRUD operations for applicants
- Statistics and reporting queries
- Search functionality

## 🤖 Chatbot Configuration

### FAQ Topics
The chatbot handles these topics automatically:
- **Admission Dates**: Application timelines and deadlines
- **Fee Structure**: Grade-wise fee breakdown
- **Location**: School address and directions
- **Contact Info**: Phone, email, and office details
- **Grades**: Available grade levels and curriculum
- **Facilities**: School infrastructure and amenities
- **Admission Process**: Step-by-step application process

### Customization
Edit `routes/chatbot.js` to modify FAQ responses or add new topics.

## 🔒 Security Features

- **Input Validation**: All form inputs are validated
- **Rate Limiting**: Prevents spam and abuse
- **CORS Protection**: Cross-origin request security
- **Helmet**: Security headers
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Input sanitization

## 📊 Monitoring and Logs

### Console Logs
The server provides detailed logging:
- ✅ Database connection status
- ✅ Email service status
- ✅ WhatsApp service status
- ✅ Application submissions
- ❌ Error logging with details

### Health Check
Monitor server status via `/api/health` endpoint.

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment

#### Option 1: Render (Recommended)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

#### Option 2: Vercel
1. Install Vercel CLI
2. Run `vercel` in project directory
3. Configure environment variables

#### Option 3: AWS/Heroku
1. Set up Node.js environment
2. Configure environment variables
3. Deploy using platform-specific commands

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
# Add all other required variables
```

## 🔧 Troubleshooting

### Common Issues

#### WhatsApp Not Working
- Verify Twilio credentials
- Check sandbox activation
- Ensure phone number format (+91XXXXXXXXXX)

#### Email Not Sending
- Verify Gmail credentials
- Check App Password setup
- Ensure 2FA is enabled

#### Database Errors
- Check file permissions for `ams.db`
- Verify SQLite installation
- Check disk space

#### Chatbot Not Responding
- Verify API endpoint accessibility
- Check browser console for errors
- Ensure static files are served correctly

### Debug Mode
```bash
NODE_ENV=development npm start
```

## 📈 Future Enhancements

- [ ] Admin Dashboard for managing applications
- [ ] Advanced AI chatbot with NLP
- [ ] SendGrid integration for bulk emails
- [ ] Twilio Business API for production WhatsApp
- [ ] File upload for documents
- [ ] Payment integration
- [ ] SMS notifications
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For technical support or questions:
- Email: admissions@alphamodels.in
- Phone: 9949128732
- School Address: Plot no: 395, Road no: 06, Raghavendra Colony, Beeramguda, Telangana 502032

---

**Built with ❤️ for Alpha Model's International School**


