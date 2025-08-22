const twilio = require('twilio');

class WhatsAppService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;
    this.client = null;
    
    if (this.accountSid && this.authToken) {
      this.client = twilio(this.accountSid, this.authToken);
    }
  }

  // Sanitize phone number to E.164 format
  sanitizePhoneNumber(phone) {
    // Remove all non-digit characters
    let digits = phone.replace(/\D/g, '');
    
    // Handle Indian numbers
    if (digits.length === 10) {
      return `+91${digits}`;
    }
    
    // Handle numbers starting with 0
    if (digits.startsWith('0') && digits.length === 11) {
      return `+91${digits.substring(1)}`;
    }
    
    // If already has country code
    if (digits.startsWith('91') && digits.length === 12) {
      return `+${digits}`;
    }
    
    // If already in E.164 format
    if (digits.startsWith('+')) {
      return digits;
    }
    
    // Default: assume Indian number
    return `+91${digits}`;
  }

  async sendConfirmation(phone, referenceNumber, parentName, grade, applicant = {}) {
    console.log('🔍 WhatsApp Debug - Client:', !!this.client, 'From:', this.whatsappFrom);
    console.log('🔍 WhatsApp Debug - Account SID:', this.accountSid);
    console.log('🔍 WhatsApp Debug - Auth Token:', this.authToken ? 'Present' : 'Missing');
    
    if (!this.client || !this.whatsappFrom) {
      console.log('⚠️ WhatsApp notifications not configured');
      return { success: false, error: 'WhatsApp not configured' };
    }

    try {
      // Send to fixed school number instead of the form phone number
      const schoolPhone = '+919949128732'; // Fixed school WhatsApp number
      const gradeText = grade === 'kg' ? 'Kindergarten' : `Grade ${grade}`;
      
      // Use the applicant data passed as parameter
      
      const message = `🎓 *Alpha Model's International School*

*New Application Received*

A new application has been submitted for ${gradeText}!

📋 *Application Details:*
• Reference Number: ${referenceNumber}
• Parent Name: ${parentName}
• Parent's Contact: ${phone}
• Parent's Email: ${applicant.email || 'Not provided'}
• Current City: ${applicant.city || 'Not specified'}
• Child's Grade Applied: ${gradeText}
• Application Date: ${new Date().toLocaleDateString('en-IN')}
• Status: Under Review
${applicant.message ? `• Additional Message: ${applicant.message}` : ''}

📞 *Next Steps:*
• Review the application details
• Contact the parent within 24-48 hours
• Schedule interaction session if needed
• Update application status

📍 *School Address:*
Alpha Model's International School
Plot no: 395, Road no: 06, Raghavendra Colony
Beeramguda, Telangana 502032

Please take appropriate action on this application.

Best regards,
AMS Admission System
Alpha Model's International School`;

      const result = await this.client.messages.create({
        from: this.whatsappFrom,
        to: `whatsapp:${schoolPhone}`,
        body: message
      });

      console.log(`✅ WhatsApp message sent to ${schoolPhone}: ${result.sid}`);
      return { success: true, messageId: result.sid };

    } catch (error) {
      console.error('❌ WhatsApp send error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send WhatsApp message' 
      };
    }
  }

  async sendStatusUpdate(phone, referenceNumber, status, additionalInfo = '') {
    if (!this.client || !this.whatsappFrom) {
      return { success: false, error: 'WhatsApp not configured' };
    }

    try {
      const sanitizedPhone = this.sanitizePhoneNumber(phone);
      
      let statusMessage = '';
      switch (status) {
        case 'contacted':
          statusMessage = '📞 *Application Update*\n\nWe have reviewed your application and would like to schedule an interaction session. Please check your email for details.';
          break;
        case 'enrolled':
          statusMessage = '🎉 *Congratulations!*\n\nYour application has been approved! Welcome to Alpha Model\'s International School. Please check your email for enrollment instructions.';
          break;
        case 'rejected':
          statusMessage = '📝 *Application Update*\n\nThank you for your interest. Unfortunately, we are unable to offer admission at this time. We will keep your application on file for future consideration.';
          break;
        default:
          statusMessage = `📋 *Application Update*\n\nYour application status has been updated to: ${status}`;
      }

      const message = `🎓 *Alpha Model's International School*

${statusMessage}

📋 *Reference Number:* ${referenceNumber}

${additionalInfo ? `\n📝 *Additional Information:*\n${additionalInfo}\n` : ''}

📞 *Contact Information:*
• Admissions: 9949128732
• Email: admissions@alphamodels.in

Best regards,
Admissions Team
Alpha Model's International School`;

      const result = await this.client.messages.create({
        from: this.whatsappFrom,
        to: `whatsapp:${sanitizedPhone}`,
        body: message
      });

      console.log(`✅ WhatsApp status update sent to ${sanitizedPhone}: ${result.sid}`);
      return { success: true, messageId: result.sid };

    } catch (error) {
      console.error('❌ WhatsApp status update error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send WhatsApp status update' 
      };
    }
  }

  // Test WhatsApp connection
  async testConnection() {
    if (!this.client || !this.whatsappFrom) {
      return { success: false, error: 'WhatsApp not configured' };
    }

    try {
      // Try to get account info to test connection
      const account = await this.client.api.accounts(this.accountSid).fetch();
      return { 
        success: true, 
        accountName: account.friendlyName,
        status: account.status 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to connect to Twilio' 
      };
    }
  }
}

module.exports = new WhatsAppService();
