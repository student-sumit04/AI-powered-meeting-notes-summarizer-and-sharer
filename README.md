# AI Meeting Summarizer

A full-stack application that uses AI to summarize meeting transcripts and share them via email.

## Features

- **File Upload**: Upload `.txt` or `.pdf` files containing meeting transcripts
- **PDF Support**: Extract text from PDF documents
- **Manual Input**: Paste transcript text directly into the application
- **Custom Prompts**: Provide custom instructions for summarization (e.g., "Summarize in bullet points for executives")
- **AI Summarization**: Uses Groq API to generate intelligent summaries
- **Editable Summaries**: Edit generated summaries before sharing
- **Email Sharing**: Share summaries via email with multiple recipients
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Axios** for API communication

### Backend
- **Node.js** with Express
- **Groq API** for AI text summarization
- **Nodemailer** for email functionality
- **Multer** for file uploads
- **pdf-parse** for extracting text from PDF files
- **CORS** for cross-origin requests
- **Redis** for caching (optional)

## Project Structure

```
ai-meeting-summarizer/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.tsx        # Main application component
│   │   ├── main.tsx       # React entry point
│   │   └── index.css      # Global styles
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.ts     # Vite configuration
│   ├── tailwind.config.js # Tailwind CSS configuration
│   └── tsconfig.json      # TypeScript configuration
├── server/                 # Node.js backend
│   ├── index.js           # Express server
│   ├── package.json       # Backend dependencies
│   └── env.example        # Environment variables template
├── package.json           # Root package.json
└── README.md             # Project documentation
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Groq API key
- Gmail account for email functionality
- Redis (optional, for caching)

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install all dependencies (frontend + backend)
npm run install-all
```

### 2. Environment Configuration

Create a `.env` file in the `server/` directory:

```bash
cd server
cp env.example .env
```

Edit the `.env` file with your credentials:

```env
# Groq API Configuration
GROQ_API_KEY=your-groq-api-key-here

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### Getting API Keys

1. **Groq API Key**:
   - Visit [Groq Console](https://console.groq.com/)
   - Sign up and create an API key
   - Copy the key to your `.env` file

2. **Gmail App Password**:
   - Enable 2-factor authentication on your Gmail account
   - Generate an app password for this application
   - Use the app password in your `.env` file

### 3. Development

```bash
# Start both frontend and backend in development mode
npm run dev

# Or start them separately:
npm run server  # Backend on port 5000
npm run client  # Frontend on port 3000
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### POST `/api/summarize`
Generate AI summary from transcript.

**Request Body:**
```json
{
  "transcript": "Meeting transcript text...",
  "customPrompt": "Optional custom instructions"
}
```

**Response:**
```json
{
  "summary": "Generated summary text..."
}
```

### POST `/api/upload`
Upload transcript file (supports .txt and .pdf).

**Request:** Multipart form data with `file` field

**Response:**
```json
{
  "transcript": "Extracted text from file..."
}
```

### POST `/api/share`
Share summary via email.

**Request Body:**
```json
{
  "summary": "Summary text to share",
  "recipients": ["email1@example.com", "email2@example.com"],
  "subject": "Email subject"
}
```

**Response:**
```json
{
  "message": "Summary shared successfully"
}
```

## Deployment

### Frontend Deployment (Vercel)

1. **Build the frontend:**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Vercel:**
   - Connect your GitHub repository to Vercel
   - Set build command: `cd client && npm run build`
   - Set output directory: `client/dist`
   - Set root directory: `client`

3. **Environment Variables in Vercel:**
   - Add `VITE_API_URL` pointing to your backend URL

### Backend Deployment (Railway/Render)

1. **Deploy to Railway:**
   - Connect your GitHub repository
   - Set root directory to `server`
   - Add environment variables from your `.env` file

2. **Deploy to Render:**
   - Create a new Web Service
   - Connect your GitHub repository
   - Set root directory to `server`
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Add environment variables

### Environment Variables for Production

```env
GROQ_API_KEY=your-production-groq-api-key
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASS=your-production-app-password
PORT=5000
NODE_ENV=production
```

## Usage

1. **Upload or Paste Transcript**:
   - Upload a `.txt` file or paste transcript text directly
   - Ensure the text is clear and well-formatted for better results

2. **Add Custom Instructions** (Optional):
   - Provide specific instructions like "Summarize in bullet points for executives"
   - Leave empty for default comprehensive summary

3. **Generate Summary**:
   - Click "Generate Summary" to process with AI
   - Wait for the AI to process and generate the summary

4. **Edit Summary** (Optional):
   - Click "Edit" to modify the generated summary
   - Make any necessary adjustments
   - Click "Save" when done

5. **Share Summary**:
   - Click "Share" to open the email form
   - Enter recipient email addresses (comma-separated)
   - Customize email subject if needed
   - Click "Send Email" to share

## Troubleshooting

### Common Issues

1. **API Key Errors**:
   - Ensure your Groq API key is valid and has sufficient credits
   - Check that the key is correctly set in your `.env` file

2. **Email Sending Issues**:
   - Verify Gmail app password is correct
   - Ensure 2-factor authentication is enabled
   - Check that the email account allows "less secure app access"

3. **File Upload Issues**:
   - Ensure files are `.txt` or `.pdf` format
   - For PDFs, ensure they contain extractable text (not just scanned images)
   - Check file size (max 10MB)
   - Verify file encoding is UTF-8 for text files

4. **CORS Errors**:
   - Ensure backend is running on the correct port
   - Check that CORS is properly configured
   - Verify frontend is making requests to the correct backend URL

### Development Tips

- Use browser developer tools to check network requests
- Check server logs for detailed error messages
- Test API endpoints using tools like Postman
- Monitor Groq API usage and costs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check the troubleshooting section
- Review API documentation
- Create an issue in the repository

---

**Note**: This application requires valid API keys and email credentials to function properly. Make sure to set up all required environment variables before running the application. #
