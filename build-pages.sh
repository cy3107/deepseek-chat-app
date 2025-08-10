#!/bin/bash

echo "🔧 Building for Cloudflare Pages deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
yarn install

# Build the React app
echo "🚀 Building React application..."
yarn build

echo "✅ Pages build complete!"
echo "📋 Build artifacts ready in ./build directory"