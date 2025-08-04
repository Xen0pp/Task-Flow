# ✅ Vercel Deployment Checklist

## Pre-Deployment Requirements

### 1. MongoDB Atlas Setup
- [ ] MongoDB Atlas account created
- [ ] Cluster created (free M0 tier is fine)
- [ ] Database user created with read/write permissions
- [ ] Network access configured (whitelist `0.0.0.0/0` for Vercel)
- [ ] Connection string obtained and tested

### 2. GitHub Repository
- [ ] Code pushed to GitHub repository
- [ ] All changes committed and pushed
- [ ] Repository is public or accessible to Vercel

## Vercel Deployment Steps

### 1. Import Project to Vercel
- [ ] Go to [vercel.com/dashboard](https://vercel.com/dashboard)
- [ ] Click "New Project"
- [ ] Import your GitHub repository (`Xen0pp/Task-Flow`)
- [ ] Vercel auto-detects React configuration

### 2. Configure Environment Variables
Go to Project Settings → Environment Variables and add:

- [ ] `MONGODB_URI` = `mongodb+srv://username:password@cluster.mongodb.net/database`
- [ ] `JWT_SECRET` = `your-secure-random-string-32-chars-minimum`
- [ ] `NODE_ENV` = `production`
- [ ] `CLIENT_URL` = `https://your-app-name.vercel.app` (update after first deploy)

### 3. Deploy and Test
- [ ] Click "Deploy" in Vercel dashboard
- [ ] Wait for build to complete
- [ ] Note your Vercel app URL

### 4. Update CLIENT_URL
- [ ] Copy your Vercel app URL
- [ ] Update `CLIENT_URL` environment variable with the exact URL
- [ ] Redeploy the application

## Post-Deployment Testing

### 1. Basic Functionality
- [ ] Visit your Vercel app URL
- [ ] Should see loading screen, then login page (not white screen)
- [ ] Test page loads: `https://your-app.vercel.app/test`

### 2. API Health Check
- [ ] Visit: `https://your-app.vercel.app/api/health`
- [ ] Should return: `{"status":"Server is running","timestamp":"..."}`

### 3. Authentication Testing
- [ ] Try registering a new account
- [ ] Try logging in with the account
- [ ] Check if dashboard loads after login

### 4. Browser Console Check
- [ ] Open browser DevTools (F12)
- [ ] Check Console tab for errors
- [ ] Check Network tab for failed requests

## Troubleshooting

### If you see a white screen:
1. [ ] Check browser console for JavaScript errors
2. [ ] Verify all environment variables are set in Vercel
3. [ ] Test the `/test` route: `https://your-app.vercel.app/test`
4. [ ] Check Vercel function logs in dashboard

### If login/signup doesn't work:
1. [ ] Test API health endpoint
2. [ ] Check MongoDB Atlas connection
3. [ ] Verify CORS settings (CLIENT_URL)
4. [ ] Check browser network tab for API errors

### If API returns errors:
1. [ ] Check Vercel function logs
2. [ ] Verify MongoDB Atlas IP whitelist
3. [ ] Test MongoDB connection string
4. [ ] Check environment variables

## Environment Variables Reference

```bash
# Required for production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-random-string-at-least-32-characters-long
NODE_ENV=production
CLIENT_URL=https://your-exact-vercel-app-url.vercel.app
```

## Useful URLs After Deployment

- **App URL:** `https://your-app.vercel.app`
- **Test Page:** `https://your-app.vercel.app/test`
- **API Health:** `https://your-app.vercel.app/api/health`
- **Login:** `https://your-app.vercel.app/login`
- **Register:** `https://your-app.vercel.app/register`

## Support Resources

- **Troubleshooting Guide:** `TROUBLESHOOTING.md`
- **Manual Deployment Guide:** `MANUAL_DEPLOYMENT_GUIDE.md`
- **Vercel Documentation:** [vercel.com/docs](https://vercel.com/docs)
- **MongoDB Atlas Docs:** [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)

## Success Indicators ✅

Your deployment is successful when:
- [ ] App loads without white screen
- [ ] `/api/health` returns success response
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard loads after authentication
- [ ] No console errors in browser
- [ ] All features work as expected

## Common Issues Fixed

This deployment includes fixes for:
- ✅ White screen issues
- ✅ API connectivity problems
- ✅ CORS errors
- ✅ Static asset routing
- ✅ Authentication failures
- ✅ Build configuration issues
- ✅ Environment variable problems

If you encounter any issues not covered here, check the `TROUBLESHOOTING.md` file for detailed solutions.
