#!/bin/bash

echo "🔧 Building for Cloudflare Pages with Yarn 4..."

# Remove any existing lockfile to avoid conflicts
if [ -f "yarn.lock" ]; then
    echo "🗑️ Removing existing yarn.lock"
    rm yarn.lock
fi

# Install dependencies (Yarn 4 will create new lockfile)
echo "📦 Installing dependencies..."
yarn install

# Build the React app
echo "🚀 Building React application..."
yarn build

echo "✅ Cloudflare Pages build complete!"