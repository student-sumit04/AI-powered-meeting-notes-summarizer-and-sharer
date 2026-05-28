const multer = require('multer');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const isText = file.mimetype === 'text/plain';
    const isPdf = file.mimetype === 'application/pdf';
    const isOctetPdf = file.mimetype === 'application/octet-stream'
      && typeof file.originalname === 'string'
      && file.originalname.toLowerCase().endsWith('.pdf');

    if (isText || isPdf || isOctetPdf) {
      cb(null, true);
    } else {
      cb(new Error('Only .txt and .pdf files are allowed'), false);
    }
  }
});

module.exports = upload; 