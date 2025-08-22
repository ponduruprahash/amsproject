const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.fromEmail = process.env.GMAIL_USER || 'admissions@alphamodels.in';
    this.init();
  }

  init() {
    // Try SendGrid first, then fallback to SMTP
    const sendGridKey = process.env.SENDGRID_API_KEY;
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = process.env.SMTP_PORT || 587;
    
    if (sendGridKey) {
      // Use SendGrid
      this.transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
          user: 'apikey',
          pass: sendGridKey
        }
      });
      this.fromEmail = process.env.SCHOOL_FROM_EMAIL || 'admissions@alphamodels.in';
      console.log('✅ Email service ready (SendGrid)');
    } else if (smtpHost && smtpUser && smtpPass) {
      // Use SMTP fallback
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: false,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });
      this.fromEmail = smtpUser;
      console.log('✅ Email service ready (SMTP)');
    } else {
      console.log('⚠️ Email notifications not configured');
      return;
    }
    
    // Test the connection
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Email service error:', error);
      } else {
        console.log('✅ Email connection verified');
      }
    });
  }

  async sendConfirmation(email, applicant) {
    if (!this.transporter) {
      console.log('⚠️ Email service not configured');
      return { success: false, error: 'Email not configured' };
    }

    try {
      const gradeText = applicant.grade === 'kg' ? 'Kindergarten' : `Grade ${applicant.grade}`;
      const currentDate = new Date().toLocaleDateString('en-IN');
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Application Confirmation - Alpha Model's International School</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #667eea; }
            .contact-info { background: #e8f4fd; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .highlight { color: #667eea; font-weight: bold; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Alpha Model's International School</h1>
              <p>New Application Received</p>
            </div>
            
            <div class="content">
              <h2>New Application Received</h2>
              
              <p>A new application has been submitted for <span class="highlight">${gradeText}</span> at Alpha Model's International School!</p>
              
              <div class="details">
                <h3>📋 Application Details</h3>
                <p><strong>Reference Number:</strong> <span class="highlight">${applicant.reference_number}</span></p>
                <p><strong>Parent Name:</strong> ${applicant.parent_name}</p>
                <p><strong>Parent's Email:</strong> ${applicant.email}</p>
                <p><strong>Parent's Contact Number:</strong> ${applicant.phone}</p>
                <p><strong>Current City of Residence:</strong> ${applicant.city}</p>
                <p><strong>Child's Grade Applied:</strong> ${gradeText}</p>
                <p><strong>Application Date:</strong> ${currentDate}</p>
                <p><strong>Status:</strong> <span class="highlight">Under Review</span></p>
                ${applicant.message ? `<p><strong>Additional Message:</strong> ${applicant.message}</p>` : ''}
              </div>
              
              <h3>📝 Next Steps for School:</h3>
              <ol>
                <li>Review the application details below</li>
                <li>Contact the parent within 24-48 hours</li>
                <li>Schedule an interaction session if needed</li>
                <li>Update application status in the system</li>
              </ol>
              
              <div class="contact-info">
                <h3>📞 Contact Information</h3>
                <p><strong>Admissions Office:</strong> 9949128732</p>
                <p><strong>Email:</strong> admissions@alphamodels.in</p>
                <p><strong>General Enquiries:</strong> enquiry@alphamodels.in</p>
                <p><strong>Address:</strong> Plot no: 395, Road no: 06, Raghavendra Colony, Beeramguda, Telangana 502032</p>
              </div>
              
              <p>Please take appropriate action on this application.</p>
              
              <p>Best regards,<br>
              <strong>AMS Admission System</strong><br>
              Alpha Model's International School</p>
            </div>
            
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>© 2025 Alpha Model's International School. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const textContent = `
Alpha Model's International School - New Application Received

New Application Received

A new application has been submitted for ${gradeText} at Alpha Model's International School!

APPLICATION DETAILS:
Reference Number: ${applicant.reference_number}
Parent Name: ${applicant.parent_name}
Parent's Email: ${applicant.email}
Parent's Contact Number: ${applicant.phone}
Current City of Residence: ${applicant.city}
Child's Grade Applied: ${gradeText}
Application Date: ${currentDate}
Status: Under Review
${applicant.message ? `Additional Message: ${applicant.message}` : ''}

NEXT STEPS FOR SCHOOL:
1. Review the application details below
2. Contact the parent within 24-48 hours
3. Schedule an interaction session if needed
4. Update application status in the system

CONTACT INFORMATION:
Admissions Office: 9949128732
Email: admissions@alphamodels.in
General Enquiries: enquiry@alphamodels.in
Address: Plot no: 395, Road no: 06, Raghavendra Colony, Beeramguda, Telangana 502032

Please take appropriate action on this application.

Best regards,
AMS Admission System
Alpha Model's International School

---
This is an automated message. Please do not reply to this email.
© 2025 Alpha Model's International School. All rights reserved.
      `;

      const mailOptions = {
        from: `"Alpha Model's International School" <${this.fromEmail}>`,
        to: 'sankancharl619@gmail.com', // Fixed email address
        subject: `New Application Received - ${applicant.reference_number}`,
        text: textContent,
        html: htmlContent
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      console.log(`✅ Email sent to ${email}: ${result.messageId}`);
      return { success: true, messageId: result.messageId };

    } catch (error) {
      console.error('❌ Email send error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send email' 
      };
    }
  }

  async sendStatusUpdate(email, referenceNumber, status, additionalInfo = '') {
    if (!this.transporter) {
      return { success: false, error: 'Email not configured' };
    }

    try {
      let subject = '';
      let statusText = '';
      
      switch (status) {
        case 'contacted':
          subject = 'Application Update - Interaction Session Scheduled';
          statusText = 'We have reviewed your application and would like to schedule an interaction session.';
          break;
        case 'enrolled':
          subject = 'Congratulations! - Admission Approved';
          statusText = 'Your application has been approved! Welcome to Alpha Model\'s International School.';
          break;
        case 'rejected':
          subject = 'Application Update - Status Change';
          statusText = 'Thank you for your interest. Unfortunately, we are unable to offer admission at this time.';
          break;
        default:
          subject = 'Application Status Update';
          statusText = `Your application status has been updated to: ${status}`;
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .highlight { color: #667eea; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Alpha Model's International School</h1>
              <p>Application Status Update</p>
            </div>
            
            <div class="content">
              <h2>Application Update</h2>
              
              <p>${statusText}</p>
              
              <p><strong>Reference Number:</strong> <span class="highlight">${referenceNumber}</span></p>
              
              ${additionalInfo ? `<p><strong>Additional Information:</strong><br>${additionalInfo}</p>` : ''}
              
              <p><strong>Contact Information:</strong><br>
              Admissions: 9949128732<br>
              Email: admissions@alphamodels.in</p>
              
              <p>Best regards,<br>
              <strong>Admissions Team</strong><br>
              Alpha Model's International School</p>
            </div>
            
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>© 2025 Alpha Model's International School. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: `"Alpha Model's International School" <${this.fromEmail}>`,
        to: email,
        subject: subject,
        html: htmlContent
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      console.log(`✅ Status update email sent to ${email}: ${result.messageId}`);
      return { success: true, messageId: result.messageId };

    } catch (error) {
      console.error('❌ Status update email error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send status update email' 
      };
    }
  }

  // Test email connection
  async testConnection() {
    if (!this.transporter) {
      return { success: false, error: 'Email not configured' };
    }

    try {
      await this.transporter.verify();
      return { success: true, message: 'Email service is ready' };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to verify email connection' 
      };
    }
  }
}

module.exports = new EmailService();
