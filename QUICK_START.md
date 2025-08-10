# 🚀 快速开始指南

## 📋 准备工作

1. ✅ GitHub账户
2. ✅ Cloudflare账户  
3. ✅ 域名 `zhimahu.work` (已购买)
4. ✅ DeepSeek API Key: `sk-f001d77b94ba42b09d1dbab0d2ba1bc6`

## ⚡ 一键部署

```bash
# 1. 初始化并推送到GitHub
./init-repo.sh

# 2. 添加GitHub远程仓库
git remote add origin https://github.com/YOUR_USERNAME/deepseek-chat-app.git
git push -u origin main
```

## 🔧 Cloudflare配置

### Workers (API后端)
1. **Cloudflare Dashboard** → **Workers & Pages** → **Create**
2. **Connect to Git** → 选择你的GitHub仓库
3. **配置**:
   - 根目录: `worker/`
   - 构建命令: `yarn install && yarn build`

### Pages (前端)
1. **Cloudflare Dashboard** → **Workers & Pages** → **Create**
2. **Connect to Git** → 选择你的GitHub仓库  
3. **配置**:
   - 根目录: `/`
   - 构建命令: `yarn build`
   - 构建输出: `build`
   - 环境变量: `REACT_APP_WORKER_URL=https://api.zhimahu.work/graphql`

## 🌐 域名设置

在Cloudflare DNS中添加记录:
```
api.zhimahu.work   → CNAME → your-worker.workers.dev
chat.zhimahu.work  → CNAME → your-pages.pages.dev
```

## 🔐 环境配置

### Worker Secrets
```bash
cd worker
wrangler secret put DEEPSEEK_API_KEY
wrangler kv:namespace create "CHAT_HISTORY"
```

### GitHub Secrets
在GitHub仓库设置中添加:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## ✅ 验证部署

1. **API**: https://api.zhimahu.work/graphql
2. **前端**: https://chat.zhimahu.work  
3. **GitHub Actions**: 查看自动部署状态

## 🎉 完成！

你的AI聊天应用已经部署完成，支持：
- ✅ 自动Git部署
- ✅ 自定义域名  
- ✅ GraphQL API
- ✅ 聊天会话管理
- ✅ Markdown渲染
- ✅ 响应式设计

有问题？查看 [完整文档](README.md) 或 [故障排除指南](README.md#故障排除)。