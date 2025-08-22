# 🎓 AMS Admission System - Application Flow Guide

## 📋 **Application Flow: Login → Main → Enroll**

### 🔐 **Step 1: Login Page** (`/`)
- **URL**: `http://localhost:3000/`
- **Purpose**: Landing page with school information
- **Features**:
  - School branding and introduction
  - "Know More" button to navigate to main page
  - Admissions information and school details
- **Navigation**: Click "Know More" to go to Main Page

### 🏠 **Step 2: Main Page** (`/main`)
- **URL**: `http://localhost:3000/main`
- **Purpose**: School overview and information hub
- **Features**:
  - School introduction and mission
  - Image gallery and slideshow
  - Navigation to enrollment
- **Navigation Options**:
  - "Light the Way Forward" button → Enroll Page
  - "Enroll Now" button → Enroll Page
  - "Admissions" in navigation → Enroll Page

### 📝 **Step 3: Enroll Page** (`/enroll`)
- **URL**: `http://localhost:3000/enroll`
- **Purpose**: Complete admission form submission
- **Features**:
  - Complete enrollment form with all fields
  - Contact information display
  - **Form Fields**:
    - Parent Name (required)
    - Parent's Email (required)
    - Parent's Contact Number (required)
    - Current City of Residence (required)
    - Child's Grade (KG to Grade 7, required)
    - Additional Message (optional)
- **After Submission**:
  - Email notification sent to parent
  - WhatsApp notification sent to parent
  - All form data included in notifications
  - Success confirmation displayed

## 🎯 **Simple Navigation Flow**

### User Experience
- **Direct Access**: All pages accessible without authentication
- **Clear Navigation**: Simple button-based navigation
- **Seamless Flow**: Smooth transition between pages
- **User-Friendly**: No login barriers or complex authentication

## 🎯 **User Journey**

1. **Landing**: User visits `http://localhost:3000/`
2. **Explore**: Views school information and branding
3. **Navigate**: Clicks "Know More" to go to main page
4. **Discover**: Views detailed school information and content
5. **Enroll**: Clicks enrollment button to access form
6. **Submit**: Completes and submits admission form
7. **Notifications**: Receives email and WhatsApp confirmations

## 🚀 **Quick Start**

1. **Start Server**: `npm run dev`
2. **Open Browser**: `http://localhost:3000`
3. **Navigate**: Click "Know More" to explore
4. **Enroll**: Click enrollment buttons to access form
5. **Test**: Submit enrollment form to see notifications

## 📱 **Navigation Flow**

```
Login Page (/) 
    ↓ [Click "Know More"]
Main Page (/main)
    ↓ [Click Enroll]
Enroll Page (/enroll)
    ↓ [Form Submit]
Email + WhatsApp Notifications
```

## 🔧 **Technical Implementation**

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js with Express.js
- **Authentication**: Client-side localStorage
- **Database**: SQLite for applicant storage
- **Notifications**: Gmail SMTP + Twilio WhatsApp
- **Routing**: Express.js route handlers
- **Security**: Route protection and session management

---

**Note**: This flow ensures a proper user experience with authentication, clear navigation, and complete data collection for the admission process.
