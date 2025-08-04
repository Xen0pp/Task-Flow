# Vercel Deployment Guide

This guide will help you deploy your Advanced Todo App to Vercel.

## Prerequisites

1. **MongoDB Atlas Account**: You'll need a MongoDB Atlas cluster for your database
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **GitHub Repository**: Your code should be in a GitHub repository

## Step 1: Prepare MongoDB Atlas

1. Create a MongoDB Atlas cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a database user with read/write permissions
3. Whitelist all IP addresses (0.0.0.0/0) for Vercel's serverless functions
4. Get your connection string

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a React app

### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from your project root
vercel

# Follow the prompts
```

## Step 3: Configure Environment Variables

In your Vercel project dashboard, go to Settings → Environment Variables and add:

| Variable | Value | Description |
|----------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | `your-secret-key` | A secure random string for JWT tokens |
| `NODE_ENV` | `production` | Environment setting |
| `CLIENT_URL` | `https://your-app.vercel.app` | Your Vercel app URL (for CORS) |

## Step 4: Redeploy

After adding environment variables, trigger a new deployment:
- Push a new commit to your repository, or
- Go to Deployments tab and click "Redeploy"

## Project Structure

The project is configured with:
- **Frontend**: React app served from the root
- **Backend**: Express API served from `/api/*` routes
- **Database**: MongoDB Atlas
- **Real-time**: Socket.io for live updates

## API Endpoints

All API endpoints are prefixed with `/api/`:
- `/api/auth/*` - Authentication routes
- `/api/tasks/*` - Task management
- `/api/hackathons/*` - Hackathon features
- `/api/organizations/*` - Organization management
- `/api/health` - Health check

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Verify your MONGODB_URI is correct
   - Ensure IP whitelist includes 0.0.0.0/0

2. **CORS Issues**
   - Make sure CLIENT_URL matches your Vercel domain
   - Check that credentials are properly configured

3. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in package.json

4. **Socket.io Issues**
   - Socket.io works with Vercel but may have limitations
   - Consider using Vercel's Edge Functions for real-time features

### Getting Help

- Check Vercel deployment logs
- Review MongoDB Atlas logs
- Use the health check endpoint: `https://your-app.vercel.app/api/health`

## Local Development

To run locally after Vercel setup:
```bash
npm run dev
```

This runs both frontend and backend concurrently.
