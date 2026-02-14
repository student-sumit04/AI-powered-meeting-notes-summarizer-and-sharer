const { sendEmail } = require('../utils/emailService');

const shareSummary = async (req, res) => {
  try {
    const { summary, recipients, subject } = req.body;

    const emailContent = `
      <h2>Meeting Summary</h2>
      <div style="white-space: pre-wrap; font-family: Arial, sans-serif; line-height: 1.6;">
        ${summary}
      </div>
      <br>
      <p><em>This summary was generated using AI Meeting Summarizer.</em></p>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipients.join(', '),
      subject: subject || 'Meeting Summary',
      html: emailContent
    };

    await sendEmail(mailOptions);

    res.json({ message: 'Summary shared successfully' });

  } catch (error) {
    console.error('Email sending error:', error);
    
    if (error.code === 'EAUTH') {
      return res.status(500).json({ error: 'Email authentication failed. Please check your email credentials.' });
    }
    
    if (error.code === 'ECONNECTION') {
      return res.status(500).json({ error: 'Failed to connect to email server. Please try again later.' });
    }
    
    res.status(500).json({ error: 'Failed to send email' });
  }
};

module.exports = {
  shareSummary
}; 