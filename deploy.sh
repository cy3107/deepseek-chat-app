#!/bin/bash

echo "🚀 Deploying DeepSeek Chat App to zhimahu.work..."

# Build frontend
echo "📦 Building frontend..."
yarn build

# Deploy Cloudflare Worker
echo "🔧 Deploying Cloudflare Worker..."
cd worker
yarn deploy

echo "✅ Deployment complete!"
echo ""
echo "🌐 Your application will be available at:"
echo "   API: https://api.zhimahu.work/graphql"
echo "   Frontend: https://chat.zhimahu.work"
echo ""
echo "📋 Next steps:"
echo "1. Set your DEEPSEEK_API_KEY in Cloudflare Worker secrets:"
echo "   wrangler secret put DEEPSEEK_API_KEY"
echo ""
echo "2. Create KV namespace and update wrangler.toml:"
echo "   wrangler kv:namespace create \"CHAT_HISTORY\""
echo ""
echo "3. Configure DNS in Cloudflare dashboard for zhimahu.work:"
echo "   - Add CNAME: api.zhimahu.work → deepseek-chat-worker.your-subdomain.workers.dev"
echo ""
echo "4. Deploy frontend build folder to:"
echo "   - https://chat.zhimahu.work"
echo "   - or https://zhimahu.work"