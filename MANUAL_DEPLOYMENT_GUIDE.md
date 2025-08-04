# Manual Vercel Deployment Guide

## 🚨 Security Notice
GitHub detected a potential secret leak in your .env.example files. This was a false positive from template values, but I've updated them to be safer.

## Pre-Deployment Checklist

### ✅ Files Prepared
- [x] `vercel.json` - Vercel configuration
- [x] `server/server.js` - Modified for serverless deployment
- [x] `.env.example` - Safe template for environment variables
- [x] `VERCEL_DEPLOYMENT.md` - Detailed deployment guide

## Step 1: Set Up MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
   - Sign up or log in

2. **Create a Cluster**
   - Choose the free tier (M0)
   - Select a region close to your users
   - Create cluster

3. **Create Database User**
   - Go to Database Access
   - Add new database user
   - Choose password authentication
   - **Save your username and password securely**

4. **Configure Network Access**
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (Allow access from anywhere - required for Vercel)

5. **Get Connection String**
   - Go to Database → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

## Step 2: Deploy to Vercel (Manual)

### Option A: Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Deploy via Vercel Dashboard**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect React app settings

3. **Configure Build Settings** (if needed)
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

### Option B: Vercel CLI

```bash
# Make sure you're in the project root
cd /home/pixelx/Documents/Logs/advanced-todo-app

# Deploy to production
vercel --prod

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N (for new deployment)
# - Project name? (accept default or choose new name)
# - Directory? ./ (current directory)
```

## Step 3: Configure Environment Variables

**CRITICAL**: Add these environment variables in your Vercel project:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:

| Variable Name | Value | Notes |
|---------------|-------|-------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/database` | Your actual MongoDB connection string |
| `JWT_SECRET` | `your-secure-random-string` | Generate a strong 32+ character random string |
| `NODE_ENV` | `production` | Environment setting |
| `CLIENT_URL` | `https://your-app-name.vercel.app` | Your Vercel app URL (update after deployment) |

### Generate Secure JWT Secret
```bash
# Generate a secure random string (run this locally)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 4: Update CLIENT_URL

After your first deployment:
1. Copy your Vercel app URL (e.g., `https://advanced-todo-app-xyz.vercel.app`)
2. Update the `CLIENT_URL` environment variable with this URL
3. Redeploy (push new commit or use Vercel dashboard)

## Step 5: Test Your Deployment

1. **Health Check**
   - Visit: `https://your-app.vercel.app/api/health`
   - Should return: `{"status":"Server is running","timestamp":"..."}`

2. **Frontend**
   - Visit: `https://your-app.vercel.app`
   - Should load your React app

3. **Test Registration/Login**
   - Try creating an account
   - Check if authentication works

## Troubleshooting

### Common Issues:

1. **Build Failures**
   ```bash
   # Check build logs in Vercel dashboard
   # Common fixes:
   npm install  # Install missing dependencies
   npm run build  # Test build locally
   ```

2. **MongoDB Connection Issues**
   - Verify MONGODB_URI is correct
   - Check MongoDB Atlas network access (0.0.0.0/0)
   - Ensure database user has read/write permissions

3. **CORS Errors**
   - Update CLIENT_URL environment variable
   - Ensure it matches your Vercel domain exactly

4. **API Routes Not Working**
   - Check `vercel.json` configuration
   - Verify server routes start with `/api/`

### Environment Variable Issues
```bash
# Test locally with your production environment variables
cp .env.example .env
# Edit .env with your actual values
npm run dev
```

## Project Structure Summary

```
advanced-todo-app/
├── src/                 # React frontend
├── public/              # Static assets
├── server/              # Express backend
│   ├── server.js        # Main server file (modified for Vercel)
│   ├── routes/          # API routes
│   └── models/          # MongoDB models
├── vercel.json          # Vercel configuration
├── package.json         # Dependencies and scripts
└── .env.example         # Environment template
```

## API Endpoints

All backend routes are accessible via `/api/` prefix:
- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/tasks` - Get tasks
- `POST /api/tasks` - Create task
- And more...

## Security Notes

1. **Never commit real environment variables**
2. **Use strong JWT secrets**
3. **Regularly rotate secrets**
4. **Monitor MongoDB Atlas access logs**
5. **Use HTTPS only (Vercel provides this automatically)**

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check MongoDB Atlas logs
3. Test API endpoints individually
4. Verify environment variables are set correctly

Your app should now be live at your Vercel URL! 🎉
