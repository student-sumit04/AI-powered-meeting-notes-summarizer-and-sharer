const axios = require('axios');
const { GROQ_API_KEY, GROQ_API_URL } = require('../config/constants');

const generateSummary = async (req, res) => {
  try {
    const { transcript, customPrompt } = req.body;

    const prompt = customPrompt || 'Please provide a comprehensive summary of this meeting transcript, highlighting key points, action items, and important decisions.';

    const requestBody = {
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content: 'You are a professional meeting summarizer. Create clear, structured summaries that are easy to read and actionable.'
        },
        {
          role: 'user',
          content: `${prompt}\n\nTranscript:\n${transcript}`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    };

    const response = await axios.post(GROQ_API_URL, requestBody, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const summary = response.data.choices[0].message.content;
    res.json({ summary });

  } catch (error) {
    console.error('Summarization error:', error);
    
    if (error.response?.status === 401) {
      return res.status(500).json({ error: 'Invalid API key. Please check your Groq API configuration.' });
    }
    
    if (error.response?.status === 429) {
      return res.status(500).json({ error: 'API rate limit exceeded. Please try again later.' });
    }
    
    res.status(500).json({ 
      error: 'Failed to generate summary',
      details: process.env.NODE_ENV === 'development' ? error.message : 'AI service temporarily unavailable'
    });
  }
};

module.exports = {
  generateSummary
}; 