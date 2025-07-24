#!/bin/bash

echo "🚀 Campus Bites - Deployment Script"
echo "=================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🚀 Deploying to Vercel..."
    vercel --prod
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Deployment complete!"
echo "📱 Your app should be live at the URL provided above" 