#!/bin/bash

echo "🚀 Initializing DeepSeek Chat App GitHub Repository..."

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "🎉 Initial commit: DeepSeek Chat App with Cloudflare deployment

✨ Features:
- React + TypeScript frontend
- Cloudflare Worker GraphQL backend
- DeepSeek AI integration
- Session management
- Markdown support
- Custom domain (zhimahu.work)

🚀 Deployment:
- Frontend: Cloudflare Pages
- Backend: Cloudflare Workers
- Storage: Cloudflare KV

🤖 Generated with Claude Code
https://claude.ai/code"

echo ""
echo "✅ Repository initialized!"
echo ""
echo "📋 Next steps:"
echo "1. Create a new repository on GitHub named 'deepseek-chat-app'"
echo "2. Add the remote origin:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/deepseek-chat-app.git"
echo "3. Push to GitHub:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "🔧 Configure Cloudflare:"
echo "1. Connect Workers to your GitHub repository"
echo "2. Connect Pages to your GitHub repository" 
echo "3. Set up domain routing in Cloudflare DNS"
echo "4. Add required secrets to GitHub repository settings:"
echo "   - CLOUDFLARE_API_TOKEN"
echo "   - CLOUDFLARE_ACCOUNT_ID"
echo ""
echo "🌐 Your app will be available at:"
echo "   - Frontend: https://chat.zhimahu.work"
echo "   - API: https://api.zhimahu.work/graphql"