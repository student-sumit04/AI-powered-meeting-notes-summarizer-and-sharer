# Deployment Guide

This guide provides step-by-step instructions for deploying the AI Meeting Summarizer application to various platforms.

## Prerequisites

Before deploying, ensure you have:
- A Groq API key
- A Gmail account with app password
- Git repository with your code
- Node.js knowledge

## Option 1: Vercel (Frontend) + Railway (Backend)

### Frontend Deployment on Vercel

1. **Prepare Your Repository**
   ```bash
   # Ensure your code is pushed to GitHub
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com) and sign up/login
   - Click "New Project"
   - Import your GitHub repository
   - Configure the project:
     - **Framework Preset**: Vite
     - **Root Directory**: `client`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

3. **Environment Variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-railway-backend-url.railway.app`

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your frontend

### Backend Deployment on Railway

1. **Deploy to Railway**
   - Go to [Railway](https://railway.app) and sign up/login
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Set **Root Directory** to `server`

2. **Environment Variables in Railway**
   - Go to Variables tab
   - Add the following variables:
     ```
     GROQ_API_KEY=your-groq-api-key
     EMAIL_USER=your-gmail@gmail.com
     EMAIL_PASS=your-gmail-app-password
     NODE_ENV=production
     ```

3. **Deploy**
   - Railway will automatically deploy your backend
   - Copy the generated URL (e.g., `https://your-app.railway.app`)

4. **Update Frontend API URL**
   - Go back to Vercel
   - Update `VITE_API_URL` with your Railway backend URL

## Option 2: Vercel (Frontend) + Render (Backend)

### Frontend Deployment on Vercel
Follow the same steps as above for Vercel deployment.

### Backend Deployment on Render

1. **Deploy to Render**
   - Go to [Render](https://render.com) and sign up/login
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: `ai-summarizer-backend`
     - **Root Directory**: `server`
     - **Runtime**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

2. **Environment Variables in Render**
   - Go to Environment tab
   - Add the same variables as Railway:
     ```
     GROQ_API_KEY=your-groq-api-key
     EMAIL_USER=your-gmail@gmail.com
     EMAIL_PASS=your-gmail-app-password
     NODE_ENV=production
     ```

3. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your backend

## Option 3: Netlify (Frontend) + Heroku (Backend)

### Frontend Deployment on Netlify

1. **Build Locally**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Drag and drop the `client/dist` folder
   - Or connect your GitHub repository and set:
     - **Build command**: `cd client && npm install && npm run build`
     - **Publish directory**: `client/dist`

3. **Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-heroku-backend-url.herokuapp.com`

### Backend Deployment on Heroku

1. **Prepare for Heroku**
   ```bash
   cd server
   # Create Procfile
   echo "web: npm start" > Procfile
   ```

2. **Deploy to Heroku**
   ```bash
   # Install Heroku CLI
   heroku create your-app-name
   heroku config:set GROQ_API_KEY=your-groq-api-key
   heroku config:set EMAIL_USER=your-gmail@gmail.com
   heroku config:set EMAIL_PASS=your-gmail-app-password
   heroku config:set NODE_ENV=production
   git push heroku main
   ```

## Option 4: Full Stack on Railway

You can deploy both frontend and backend on Railway:

1. **Create Two Services**
   - **Frontend Service**:
     - Root Directory: `client`
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - **Backend Service**:
     - Root Directory: `server`
     - Build Command: `npm install`
     - Start Command: `npm start`

2. **Environment Variables**
   - Set backend environment variables in the backend service
   - Set `VITE_API_URL` in the frontend service pointing to the backend URL

## Environment Variables Reference

### Backend Variables
```env
GROQ_API_KEY=your-groq-api-key
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
NODE_ENV=production
PORT=5000
```

### Frontend Variables
```env
VITE_API_URL=https://your-backend-url.com
```

## Post-Deployment Checklist

1. **Test API Endpoints**
   - Test `/api/health` endpoint
   - Test `/api/summarize` with sample data
   - Test `/api/share` functionality

2. **Test Frontend**
   - Verify file upload works
   - Test AI summarization
   - Test email sharing
   - Check responsive design

3. **Monitor Logs**
   - Check for any errors in deployment logs
   - Monitor API usage and costs
   - Set up error tracking if needed

4. **Security Considerations**
   - Ensure environment variables are secure
   - Verify CORS settings
   - Check API rate limits

## Troubleshooting Deployment Issues

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check for TypeScript compilation errors

2. **API Connection Issues**
   - Verify CORS settings in backend
   - Check environment variables are set correctly
   - Ensure backend URL is accessible

3. **Email Sending Issues**
   - Verify Gmail app password is correct
   - Check 2-factor authentication is enabled
   - Test email credentials locally first

4. **File Upload Issues**
   - Check file size limits
   - Verify file type restrictions
   - Test with different file formats

### Getting Help

- Check platform-specific documentation
- Review deployment logs for error messages
- Test locally before deploying
- Use platform support channels

## Cost Considerations

- **Vercel**: Free tier available, paid plans start at $20/month
- **Railway**: Free tier available, paid plans start at $5/month
- **Render**: Free tier available, paid plans start at $7/month
- **Groq API**: Pay-per-use pricing
- **Gmail**: Free for personal use

## Performance Optimization

1. **Frontend**
   - Enable Vite build optimization
   - Use CDN for static assets
   - Implement lazy loading

2. **Backend**
   - Enable compression
   - Implement caching
   - Monitor API response times

3. **Database** (if added later)
   - Use connection pooling
   - Implement query optimization
   - Consider read replicas for scaling

---

**Note**: Always test your deployment thoroughly before sharing the link. Monitor your application's performance and costs regularly. 