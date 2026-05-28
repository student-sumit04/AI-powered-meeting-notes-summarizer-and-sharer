const pdfParse = require('pdf-parse');
const { MAX_TRANSCRIPT_LENGTH } = require('../config/constants');

const PDF_PARSE_TIMEOUT_MS = 15000;

const parsePdfWithTimeout = (buffer) => {
  return Promise.race([
    pdfParse(buffer),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('PDF_PARSE_TIMEOUT')), PDF_PARSE_TIMEOUT_MS);
    })
  ]);
};

const processFileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let transcript = '';
    
    if (req.file.mimetype === 'text/plain') {
      transcript = req.file.buffer.toString('utf-8');
    } else if (
      req.file.mimetype === 'application/pdf'
      || (req.file.mimetype === 'application/octet-stream'
        && req.file.originalname?.toLowerCase().endsWith('.pdf'))
    ) {
      try {
        const pdfData = await parsePdfWithTimeout(req.file.buffer);
        transcript = pdfData.text;
        
        if (!transcript.trim()) {
          return res.status(400).json({ error: 'Could not extract text from the PDF. The file may be encrypted, scanned, or contain only images.' });
        }
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
        if (pdfError?.message === 'PDF_PARSE_TIMEOUT') {
          return res.status(408).json({ error: 'PDF parsing timed out. Please try a smaller or text-based PDF.' });
        }
        return res.status(400).json({ error: 'Failed to parse PDF file. Please ensure it is a valid PDF document.' });
      }
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Please upload a .txt or .pdf file.' });
    }

    // Validate transcript content
    if (!transcript.trim()) {
      return res.status(400).json({ error: 'The uploaded file appears to be empty or contains no readable text.' });
    }

    if (transcript.length > MAX_TRANSCRIPT_LENGTH) {
      return res.status(400).json({ error: 'File content is too long. Please keep it under about 50,000 characters.' });
    }

    res.json({ transcript });

  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Failed to process file' });
  }
};

module.exports = {
  processFileUpload
}; 