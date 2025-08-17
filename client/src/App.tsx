import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Configure axios to use the API URL from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || ''
});

interface SummaryData {
  summary: string;
  isEditing: boolean;
}

function App() {
  const [transcript, setTranscript] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [summaryData, setSummaryData] = useState<SummaryData>({ summary: '', isEditing: false });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showShareForm, setShowShareForm] = useState(false);
  const [recipients, setRecipients] = useState('');
  const [emailSubject, setEmailSubject] = useState('Meeting Summary');
  const [isSharing, setIsSharing] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  
  // Log API URL on startup for debugging
  useEffect(() => {
    console.log('API URL:', import.meta.env.VITE_API_URL || 'Not defined');
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setTranscript(text);
        setError('');
      };
      reader.readAsText(file);
    } else if (file.type === 'application/pdf') {
      const formData = new FormData();
      formData.append('file', file);
      
      setIsLoading(true);
      api.post('/api/upload', formData)
        .then(response => {
          setTranscript(response.data.transcript);
          setError('');
        })
        .catch(err => {
          setError(err.response?.data?.error || 'Failed to process PDF file');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setError('Please upload a .txt or .pdf file');
      return;
    }
  };

  const generateSummary = async () => {
    if (!transcript.trim()) {
      setError('Please enter or upload a transcript');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/api/summarize', {
        transcript,
        customPrompt: customPrompt || undefined
      });

      setSummaryData({
        summary: response.data.summary,
        isEditing: false
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate summary');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummaryEdit = (newSummary: string) => {
    setSummaryData(prev => ({
      ...prev,
      summary: newSummary
    }));
  };

  const toggleEditMode = () => {
    setSummaryData(prev => ({
      ...prev,
      isEditing: !prev.isEditing
    }));
  };

  const shareSummary = async () => {
    if (!summaryData.summary.trim() || !recipients.trim()) {
      setError('Please provide both summary and recipient emails');
      return;
    }

    setIsSharing(true);
    setError('');

    try {
      const emailList = recipients.split(',').map(email => email.trim()).filter(email => email);
      
      await api.post('/api/share', {
        summary: summaryData.summary,
        recipients: emailList,
        subject: emailSubject
      });

      setShareMessage('Summary shared successfully!');
      setShowShareForm(false);
      setRecipients('');
      setEmailSubject('Meeting Summary');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to share summary');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Meeting Summarizer
          </h1>
          <p className="text-gray-600">
            Upload your meeting transcript and get AI-powered summaries
          </p>
        </header>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Success Message */}
        {shareMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {shareMessage}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Input Transcript</h2>
          
          {/* File Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Transcript File (.txt or .pdf)
            </label>
            <input
              type="file"
              accept=".txt,.pdf"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Manual Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or Paste Transcript Here
            </label>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste your meeting transcript here..."
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Custom Prompt */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Instructions (Optional)
            </label>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g., 'Summarize in bullet points for executives' or 'Highlight only action items'"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={generateSummary}
            disabled={isLoading || !transcript.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating Summary...' : 'Generate Summary'}
          </button>
        </div>

        {/* Summary Display */}
        {summaryData.summary && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Generated Summary</h2>
              <div className="space-x-2">
                <button
                  onClick={toggleEditMode}
                  className="bg-gray-600 text-white py-1 px-3 rounded text-sm hover:bg-gray-700"
                >
                  {summaryData.isEditing ? 'Save' : 'Edit'}
                </button>
                <button
                  onClick={() => setShowShareForm(true)}
                  className="bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700"
                >
                  Share
                </button>
              </div>
            </div>

            {summaryData.isEditing ? (
              <textarea
                value={summaryData.summary}
                onChange={(e) => handleSummaryEdit(e.target.value)}
                className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="bg-gray-50 p-4 rounded-md">
                <pre className="whitespace-pre-wrap font-sans text-gray-800">
                  {summaryData.summary}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Share Form */}
        {showShareForm && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Share Summary</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Emails (comma-separated)
              </label>
              <input
                type="text"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                placeholder="email1@example.com, email2@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Subject
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={shareSummary}
                disabled={isSharing}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                {isSharing ? 'Sending...' : 'Send Email'}
              </button>
              <button
                onClick={() => setShowShareForm(false)}
                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 