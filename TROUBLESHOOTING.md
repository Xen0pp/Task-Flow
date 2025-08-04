# 🔧 Troubleshooting Guide - Vercel Deployment Issues

## Common Issues and Solutions

### 1. White Screen Issue 🔍

**Symptoms:**
- Vercel deployment shows only a white screen
- No content loads, just blank page

**Causes & Solutions:**

#### A. Build Issues
```bash
# Test build locally first
npm run build

# If build fails, check for:
# - Missing dependencies
# - TypeScript/ESLint errors
# - Import path issues
```

#### B. API Connection Issues
The app might be failing to connect to API routes. Check:

1. **Environment Variables in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add these variables:
   ```
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-secure-jwt-secret
   NODE_ENV=production
   CLIENT_URL=https://your-app.vercel.app
   ```

2. **API Route Configuration:**
   - Ensure `vercel.json` is properly configured
   - API routes should be accessible at `/api/*`

#### C. React Router Issues
- Vercel might not be handling client-side routing properly
- The `vercel.json` should redirect all routes to `index.html`

### 2. Login/Signup Not Working 🔐

**Symptoms:**
- Login/signup forms don't respond
- Network errors in browser console
- Authentication fails

**Solutions:**

#### A. Check API Endpoints
1. **Test API Health:**
   ```
   https://your-app.vercel.app/api/health
   ```
   Should return: `{"status":"Server is running","timestamp":"..."}`

2. **Check Network Tab:**
   - Open browser DevTools → Network tab
   - Try to login/signup
   - Look for failed requests to `/api/auth/*`

#### B. CORS Issues
If you see CORS errors:

1. **Update CLIENT_URL:**
   - In Vercel environment variables
   - Set `CLIENT_URL` to your exact Vercel URL
   - Redeploy after changing

2. **Check Server CORS Configuration:**
   - Server should accept requests from your Vercel domain
   - Credentials should be enabled

#### C. MongoDB Connection Issues
1. **MongoDB Atlas Setup:**
   - Whitelist all IPs: `0.0.0.0/0`
   - Check connection string format
   - Ensure database user has read/write permissions

2. **Test Connection String:**
   ```bash
   # Test locally with production connection string
   MONGODB_URI="your-production-uri" npm run dev
   ```

### 3. Environment Variables Issues 🌍

**Common Problems:**

#### A. Missing Variables
Check Vercel Dashboard → Settings → Environment Variables:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Secure random string (32+ characters)
- `NODE_ENV` - Set to `production`
- `CLIENT_URL` - Your Vercel app URL

#### B. Incorrect Values
- **MONGODB_URI:** Must include username, password, and database name
- **CLIENT_URL:** Must match your Vercel domain exactly (with https://)
- **JWT_SECRET:** Should be a long, random string

### 4. Serverless Function Issues ⚡

**Symptoms:**
- API routes return 500 errors
- Timeout errors
- Function not found errors

**Solutions:**

#### A. Check Function Logs
1. Go to Vercel Dashboard → Your Project → Functions
2. Click on your function to see logs
3. Look for error messages

#### B. Cold Start Issues
- First request might be slow (cold start)
- Subsequent requests should be faster
- Consider implementing health check warming

#### C. Memory/Timeout Issues
- Serverless functions have memory and time limits
- Optimize database queries
- Consider connection pooling for MongoDB

### 5. Static Asset Issues 📁

**Symptoms:**
- CSS not loading
- Images not displaying
- JavaScript files not found

**Solutions:**

#### A. Check Build Output
```bash
npm run build
# Check if build/static folder contains all assets
```

#### B. Verify vercel.json Routes
Ensure static assets are properly routed:
```json
{
  "src": "/static/(.*)",
  "dest": "/build/static/$1"
}
```

## Debugging Steps 🕵️

### Step 1: Check Build
```bash
# Local build test
npm run build
npm install -g serve
serve -s build
# Visit http://localhost:3000
```

### Step 2: Check API Locally
```bash
# Test with production environment
cp .env.example .env
# Edit .env with production values
npm run dev
```

### Step 3: Check Vercel Logs
1. Go to Vercel Dashboard
2. Click on your project
3. Go to "Functions" or "Deployments"
4. Check logs for errors

### Step 4: Browser DevTools
1. Open DevTools (F12)
2. Check Console for JavaScript errors
3. Check Network tab for failed requests
4. Check Application tab for localStorage issues

### Step 5: Test API Endpoints
```bash
# Test these URLs in browser:
https://your-app.vercel.app/api/health
https://your-app.vercel.app/api/auth/me
```

## Quick Fixes 🚀

### Fix 1: Redeploy with Environment Variables
1. Set all required environment variables in Vercel
2. Go to Deployments → Latest Deployment → "Redeploy"

### Fix 2: Clear Browser Cache
```bash
# Hard refresh
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

### Fix 3: Check MongoDB Atlas
1. Ensure IP whitelist includes `0.0.0.0/0`
2. Test connection string in MongoDB Compass
3. Verify database user permissions

### Fix 4: Update vercel.json
If routing issues persist, try this simpler configuration:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build"
    },
    {
      "src": "server/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## Getting Help 💬

If issues persist:

1. **Check Vercel Status:** [status.vercel.com](https://status.vercel.com)
2. **MongoDB Atlas Status:** [status.mongodb.com](https://status.mongodb.com)
3. **Review Deployment Logs:** Vercel Dashboard → Functions/Deployments
4. **Test Locally:** Ensure everything works in development
5. **Check Browser Console:** Look for JavaScript errors

## Contact Information 📞

For additional support:
- Check the deployment logs in Vercel dashboard
- Review MongoDB Atlas connection logs
- Test API endpoints individually
- Verify all environment variables are set correctly

Remember: Most deployment issues are related to environment variables or API connectivity. Double-check these first!
