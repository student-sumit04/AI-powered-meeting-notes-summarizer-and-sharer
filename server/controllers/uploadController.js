const pdfParse = require('pdf-parse');

const processFileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let transcript = '';
    
    if (req.file.mimetype === 'text/plain') {
      transcript = req.file.buffer.toString('utf-8');
    } else if (req.file.mimetype === 'application/pdf') {
      try {
        const pdfData = await pdfParse(req.file.buffer);
        transcript = pdfData.text;
        
        if (!transcript.trim()) {
          return res.status(400).json({ error: 'Could not extract text from the PDF. The file may be encrypted, scanned, or contain only images.' });
        }
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
        return res.status(400).json({ error: 'Failed to parse PDF file. Please ensure it is a valid PDF document.' });
      }
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Please upload a .txt or .pdf file.' });
    }

    // Validate transcript content
    if (!transcript.trim()) {
      return res.status(400).json({ error: 'The uploaded file appears to be empty or contains no readable text.' });
    }

    if (transcript.length > 50000) {
      return res.status(400).json({ error: 'File content is too long. Maximum 50,000 characters allowed.' });
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