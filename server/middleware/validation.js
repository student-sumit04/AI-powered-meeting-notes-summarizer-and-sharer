const validateSummarizeRequest = (req, res, next) => {
  const { transcript, customPrompt } = req.body;

  if (!transcript || transcript.trim().length === 0) {
    return res.status(400).json({ error: 'Transcript is required' });
  }

  if (transcript.length > 50000) {
    return res.status(400).json({ error: 'Transcript is too long. Maximum 50,000 characters.' });
  }

  next();
};

const validateShareRequest = (req, res, next) => {
  const { summary, recipients, subject } = req.body;

  if (!summary || summary.trim().length === 0) {
    return res.status(400).json({ error: 'Summary is required' });
  }

  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ error: 'At least one recipient email is required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  for (const email of recipients) {
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: `Invalid email format: ${email}` });
    }
  }

  next();
};

module.exports = {
  validateSummarizeRequest,
  validateShareRequest
}; 