const axios = require('axios');
const {
  GROQ_API_KEY,
  GROQ_API_URL,
  AI_MODEL,
  AI_TEMPERATURE,
  AI_MAX_TOKENS
} = require('../config/constants');

const MODEL_CONTEXT_LIMITS = {
  'llama3-8b-8192': 8192,
  'llama3-70b-8192': 8192
};

const estimateTokens = (text) => Math.ceil(text.length / 4);

const generateSummary = async (req, res) => {
  try {
    const { transcript, customPrompt } = req.body;

    const prompt = customPrompt
      ? `${customPrompt}

Formatting: Use Markdown with headings, bullet points, and **bold** highlights for key items, decisions, and action items.`
      : 'Please provide a comprehensive summary of this meeting transcript, highlighting key points, action items, and important decisions.';

    if (!GROQ_API_KEY || GROQ_API_KEY === 'your-groq-api-key') {
      return res.status(500).json({ error: 'Groq API key is missing or invalid. Please set GROQ_API_KEY in server/.env.' });
    }

    const systemMessage = 'You are a professional meeting summarizer. Create clear, structured summaries that are easy to read and actionable.';
    const userMessage = `${prompt}\n\nTranscript:\n${transcript}`;

    const contextLimit = MODEL_CONTEXT_LIMITS[AI_MODEL] || 8192;
    const safetyBuffer = 200;
    const inputTokens = estimateTokens(`${systemMessage}\n${userMessage}`);
    let maxTokens = Math.min(AI_MAX_TOKENS, Math.max(256, contextLimit - inputTokens - safetyBuffer));

    let finalUserMessage = userMessage;
    if (maxTokens <= 0) {
      const minResponseTokens = 256;
      const promptTokens = estimateTokens(`${systemMessage}\n${prompt}\n\nTranscript:\n`);
      const availableTranscriptTokens = contextLimit - safetyBuffer - promptTokens - minResponseTokens;

      if (availableTranscriptTokens <= 0) {
        return res.status(400).json({ error: 'Transcript is too long for the selected model. Please shorten it and try again.' });
      }

      const allowedChars = Math.max(0, availableTranscriptTokens * 4);
      const truncatedTranscript = transcript.slice(0, allowedChars);
      finalUserMessage = `${prompt}\n\nTranscript (truncated):\n${truncatedTranscript}`;
      maxTokens = minResponseTokens;
    }

    const requestBody = {
      model: AI_MODEL,
      messages: [
        {
          role: 'system',
          content: systemMessage
        },
        {
          role: 'user',
          content: finalUserMessage
        }
      ],
      temperature: AI_TEMPERATURE,
      max_tokens: maxTokens
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
    console.error('Summarization error:', error.response?.data || error);
    
    if (error.response?.status === 401) {
      return res.status(500).json({ error: 'Invalid API key. Please check your Groq API configuration.' });
    }
    
    if (error.response?.status === 429) {
      return res.status(500).json({ error: 'API rate limit exceeded. Please try again later.' });
    }
    
    res.status(500).json({
      error: 'Failed to generate summary',
      details: process.env.NODE_ENV === 'development'
        ? (error.response?.data || error.message)
        : 'AI service temporarily unavailable'
    });
  }
};

module.exports = {
  generateSummary
}; 