import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  debug: true,
  logger: true
});

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log('SMTP Error:', error);
  } else {
    console.log('SMTP Server is ready to take our messages');
  }
});

// Common email styling
const emailStyles = `
  <style>
    .email-container {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9f9;
    }
    .header {
      background-color: #4A90E2;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background-color: white;
      padding: 20px;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .info-list {
      list-style: none;
      padding: 0;
    }
    .info-list li {
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #666;
      font-size: 12px;
    }
    .alert {
      padding: 10px;
      border-radius: 4px;
      margin: 10px 0;
    }
    .alert-warning {
      background-color: #fff3cd;
      border: 1px solid #ffeeba;
      color: #856404;
    }
    .alert-danger {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
    }
  </style>
`;

export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Health & Fitness App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `
        ${emailStyles}
        <div class="email-container">
          ${html}
          <div class="footer">
            <p>This is an automated message from your Health & Fitness App.</p>
            <p>If you have any questions, please contact support.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', to);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Email templates
export const createMedicationReminderEmail = (medication) => {
  return {
    subject: `Medication Reminder: Time to take ${medication.name}`,
    html: `
      <div class="header">
        <h2>🔔 Medication Reminder</h2>
      </div>
      <div class="content">
        <p>Hello! This is a reminder that it's time to take your medication:</p>
        <ul class="info-list">
          <li><strong>Medication:</strong> ${medication.name}</li>
          <li><strong>Dosage:</strong> ${medication.dosage}</li>
          <li><strong>Time:</strong> ${medication.time}</li>
          <li><strong>Frequency:</strong> ${medication.frequency}</li>
        </ul>
        <div class="alert alert-warning">
          <p>⚠️ Please make sure to take your medication as prescribed.</p>
        </div>
      </div>
    `
  };
};

export const createMedicationExpiryEmail = (medication, daysUntilExpiry) => {
  const isExpired = daysUntilExpiry <= 0;
  return {
    subject: `${isExpired ? '⚠️ ' : ''}Medication Expiry Alert: ${medication.name}`,
    html: `
      <div class="header">
        <h2>🏥 Medication Expiry Alert</h2>
      </div>
      <div class="content">
        <div class="alert ${isExpired ? 'alert-danger' : 'alert-warning'}">
          <p>${
            isExpired
              ? `⚠️ Your medication has expired!`
              : `⚠️ Your medication will expire in ${daysUntilExpiry} days.`
          }</p>
        </div>
        <ul class="info-list">
          <li><strong>Medication:</strong> ${medication.name}</li>
          <li><strong>Dosage:</strong> ${medication.dosage}</li>
          <li><strong>Expiry Date:</strong> ${new Date(medication.endDate).toLocaleDateString()}</li>
        </ul>
        <p><strong>Action Required:</strong></p>
        <p>${
          isExpired
            ? '❗ Please consult your healthcare provider for a new prescription. Do not take expired medications.'
            : '📋 Please plan to refill your prescription soon to ensure continuous treatment.'
        }</p>
      </div>
    `
  };
};

export const createMealPlanReminderEmail = (mealName, mealContent) => {
  return {
    subject: `🍽️ Meal Time Reminder: ${mealName}`,
    html: `
      <div class="header">
        <h2>🍽️ Meal Time Reminder</h2>
      </div>
      <div class="content">
        <p>Hello! It's time for your ${mealName}!</p>
        <div style="background-color: #e8f4fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h3>📝 Your Planned Meal:</h3>
          <p style="font-size: 16px;">${mealContent}</p>
        </div>
        <p>Remember to:</p>
        <ul>
          <li>Take your time and eat mindfully</li>
          <li>Drink plenty of water</li>
          <li>Enjoy your meal!</li>
        </ul>
        <p>🌟 Stay on track with your health goals!</p>
      </div>
    `
  };
}; 