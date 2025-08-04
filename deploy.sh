#!/bin/bash

echo "🚀 TaskFlow Pro - Vercel Deployment Script"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "Please log in to Vercel:"
    vercel login
fi

# Build the project locally to check for errors
echo "🔨 Building project locally..."
if npm run build; then
    echo "✅ Local build successful!"
else
    echo "❌ Local build failed. Please fix build errors before deploying."
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "🎉 Deployment initiated!"
echo ""
echo "📋 Next steps:"
echo "1. Set up MongoDB Atlas database"
echo "2. Configure environment variables in Vercel dashboard"
echo "3. Update CLIENT_URL with your Vercel app URL"
echo "4. Test your deployment"
echo ""
echo "📖 See MANUAL_DEPLOYMENT_GUIDE.md for detailed instructions"
