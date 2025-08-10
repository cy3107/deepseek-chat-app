# 🤖 DeepSeek Chat App

一个基于React + TypeScript + Cloudflare Workers的AI聊天应用，使用DeepSeek API和GraphQL进行通信。

[![Deploy Worker](https://github.com/cy3107/deepseek-chat-app/actions/workflows/deploy-worker.yml/badge.svg)](https://github.com/cy3107/deepseek-chat-app/actions/workflows/deploy-worker.yml)
[![Deploy Pages](https://github.com/cy3107/deepseek-chat-app/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/cy3107/deepseek-chat-app/actions/workflows/deploy-pages.yml)

🌐 **在线体验**: [https://chat.zhimahu.work](https://chat.zhimahu.work)

## ✨ 功能特性

- 🤖 集成DeepSeek AI API
- 💬 实时聊天界面
- 📝 支持Markdown渲染
- 🗂️ 会话管理（多对话支持）
- 🚀 Cloudflare Workers后端
- 📱 响应式设计
- 🔄 自动Git部署
- 🌍 自定义域名支持

## 项目结构

```
├── src/                    # React前端
│   ├── components/         # React组件
│   ├── graphql/           # GraphQL查询
│   └── apollo/            # Apollo Client配置
├── worker/                # Cloudflare Worker后端
│   └── src/              # Worker源码
└── public/               # 静态资源
```

## 开发环境设置

### 1. 安装依赖

```bash
# 安装前端依赖
yarn install

# 安装Worker依赖
cd worker
yarn install
cd ..
```

### 2. 配置环境变量

复制环境变量模板：

```bash
cp .env.example .env.development
cp worker/.env.example worker/.env
```

在`worker/.env`中设置你的DeepSeek API Key：

```
DEEPSEEK_API_KEY=sk-your-deepseek-api-key-here
```

### 3. 启动开发服务器

启动Cloudflare Worker（后端）：

```bash
cd worker
yarn dev
```

启动React应用（前端）：

```bash
# 新终端窗口
yarn start
```

现在你可以访问 http://localhost:3000 使用应用。

## 🚀 Git部署

### 方式1: 一键初始化和部署

```bash
# 1. 初始化Git仓库并提交
./init-repo.sh

# 2. 创建GitHub仓库并推送
git remote add origin https://github.com/cy3107/deepseek-chat-app.git
git branch -M main
git push -u origin main
```

### 方式2: 手动Git部署

#### 1. 📋 GitHub仓库设置

```bash
# 初始化仓库
git init
git add .
git commit -m "🎉 Initial commit: DeepSeek Chat App"

# 添加远程仓库
git remote add origin https://github.com/cy3107/deepseek-chat-app.git
git branch -M main
git push -u origin main
```

#### 2. 🔧 Cloudflare配置

##### Workers部署 (后端API)

1. **连接GitHub**: 在Cloudflare Dashboard → Workers → 连接到Git
2. **仓库配置**:
   - Repository: `cy3107/deepseek-chat-app`
   - 生产分支: `main`
   - 根目录: `worker/`
3. **环境变量**: 
   ```bash
   # 在Cloudflare设置secrets
   wrangler secret put DEEPSEEK_API_KEY
   ```
4. **KV存储**:
   ```bash
   # 创建KV命名空间并更新wrangler.toml
   wrangler kv:namespace create "CHAT_HISTORY"
   ```

##### Pages部署 (前端应用)

1. **连接GitHub**: 在Cloudflare Dashboard → Pages → 连接到Git
2. **项目配置**:
   - Repository: `cy3107/deepseek-chat-app`  
   - 生产分支: `main`
   - 构建命令: `yarn build`
   - 构建输出目录: `build`
   - 根目录: `/` (根目录)
3. **环境变量**:
   ```
   REACT_APP_WORKER_URL=https://api.zhimahu.work/graphql
   NODE_VERSION=18
   ```

#### 3. 🌐 域名配置

**DNS记录设置** (在Cloudflare DNS):
```
api.zhimahu.work   → CNAME → deepseek-chat-worker.your-subdomain.workers.dev
chat.zhimahu.work  → CNAME → deepseek-chat-app.pages.dev
```

**自定义域名** (在各服务中添加):
- Workers: 添加 `api.zhimahu.work`
- Pages: 添加 `chat.zhimahu.work`

#### 4. 🔐 GitHub Secrets配置

在GitHub仓库 → Settings → Secrets and variables → Actions 中添加：

```
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id  
```

#### 5. 🤖 自动部署

推送代码到main分支后自动触发部署：

```bash
# 前端变更自动部署Pages
git add src/
git commit -m "✨ 更新前端功能"
git push

# 后端变更自动部署Worker  
git add worker/
git commit -m "🚀 更新API功能"
git push
```

### 方式3: 本地部署脚本

```bash
./deploy.sh
```

## 📊 部署监控

### GitHub Actions状态

访问 `https://github.com/cy3107/deepseek-chat-app/actions` 查看：
- ✅ CI/CD Pipeline: 代码质量检查
- 🚀 Deploy Worker: Worker自动部署
- 📄 Deploy Pages: Pages自动部署

### Cloudflare Dashboard

#### Workers监控
- **URL**: `https://dash.cloudflare.com/YOUR_ACCOUNT_ID/workers/services/view/deepseek-chat-worker`
- **指标**: 请求数、错误率、执行时间
- **日志**: 实时查看Worker执行日志

#### Pages监控  
- **URL**: `https://dash.cloudflare.com/YOUR_ACCOUNT_ID/pages/view/deepseek-chat-app`
- **指标**: 页面访问、构建状态、部署历史
- **Analytics**: 访问统计和性能数据

### 🔧 故障排除

#### Worker部署失败
```bash
# 检查wrangler配置
cd worker
wrangler whoami
wrangler deploy --dry-run

# 查看详细错误
wrangler tail
```

#### Pages构建失败
```bash
# 本地测试构建
yarn install
yarn build

# 检查环境变量
echo $REACT_APP_WORKER_URL
```

#### 网络连接问题
```bash
# 测试API连接
curl https://api.zhimahu.work/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}'

# 检查CORS配置
curl -H "Origin: https://chat.zhimahu.work" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS https://api.zhimahu.work/graphql
```

## 🔄 开发工作流

### 功能开发
```bash
# 1. 创建功能分支
git checkout -b feature/new-chat-feature

# 2. 开发和测试
yarn start              # 前端
cd worker && yarn dev   # 后端

# 3. 提交和推送
git add .
git commit -m "✨ 添加新聊天功能"
git push origin feature/new-chat-feature

# 4. 创建Pull Request到main分支
```

### 热修复
```bash
# 1. 创建hotfix分支
git checkout -b hotfix/fix-critical-bug

# 2. 修复并测试
# 3. 直接合并到main触发部署
git checkout main
git merge hotfix/fix-critical-bug
git push origin main
```

## 📋 API 文档

### GraphQL Schema

#### 查询 (Queries)

- `getChatHistory(sessionId: String)`: 获取指定会话的聊天历史
- `getChatSessions`: 获取所有聊天会话

#### 变更 (Mutations)

- `sendMessage(message: String!, sessionId: String)`: 发送消息
- `createChatSession`: 创建新的聊天会话
- `deleteChatSession(sessionId: String!)`: 删除聊天会话

## 技术栈

- **前端**: React 18, TypeScript, Apollo Client, react-markdown
- **后端**: Cloudflare Workers, GraphQL Yoga
- **AI API**: DeepSeek API
- **存储**: Cloudflare KV
- **部署**: Cloudflare Workers, 静态网站托管

## 许可证

MIT License