# 项目结构

这个项目采用前后端分离架构，支持通过Cloudflare Git集成自动部署。

## 📁 目录结构

```
deepseek-chat-app/
├── 📁 src/                          # React 前端应用
│   ├── 📁 components/               # React 组件
│   │   └── ChatInterface.tsx        # 主聊天界面组件
│   ├── 📁 graphql/                  # GraphQL 相关
│   │   └── queries.ts               # GraphQL 查询和变更
│   ├── 📁 apollo/                   # Apollo Client 配置
│   │   └── client.ts                # Apollo 客户端设置
│   ├── App.tsx                      # 主应用组件
│   ├── App.css                      # 应用样式
│   ├── index.tsx                    # 应用入口点
│   └── index.css                    # 全局样式
├── 📁 public/                       # 静态资源和 Pages 配置
│   ├── index.html                   # HTML 模板
│   ├── _headers                     # Cloudflare Pages 头部配置
│   └── _redirects                   # SPA 路由重定向规则
├── 📁 worker/                       # Cloudflare Worker 后端
│   ├── 📁 src/                      # Worker 源代码
│   │   ├── index.ts                 # Worker 入口点
│   │   ├── schema.ts                # GraphQL Schema
│   │   ├── resolvers.ts             # GraphQL Resolvers
│   │   ├── context.ts               # GraphQL Context
│   │   └── utils.ts                 # 工具函数
│   ├── package.json                 # Worker 依赖
│   ├── tsconfig.json                # Worker TypeScript 配置
│   ├── wrangler.toml                # Cloudflare Worker 配置
│   └── .env.example                 # Worker 环境变量示例
├── 📁 functions/                    # Cloudflare Pages Functions (预留)
│   └── package.json                 # Pages Functions 依赖
├── 📄 package.json                  # 前端依赖和脚本
├── 📄 tsconfig.json                 # 前端 TypeScript 配置
├── 📄 yarn.lock                     # Yarn 锁定文件
├── 📄 .gitignore                    # Git 忽略文件
├── 📄 .env.development              # 开发环境变量
├── 📄 .env.production               # 生产环境变量
├── 📄 .env.example                  # 环境变量示例
├── 📄 deploy.sh                     # 本地部署脚本
├── 📄 build-pages.sh                # Pages 构建脚本
└── 📄 README.md                     # 项目文档
```

## 🚀 部署架构

### Cloudflare Workers (后端 API)
- **路径**: `/worker/`
- **部署**: 通过 Git 集成自动部署
- **域名**: `https://api.zhimahu.work`
- **功能**: GraphQL API + DeepSeek AI 集成

### Cloudflare Pages (前端)
- **路径**: `/` (根目录)
- **构建命令**: `yarn build`
- **输出目录**: `build`
- **域名**: `https://chat.zhimahu.work`
- **功能**: React SPA 聊天界面

## 🔧 环境配置

### 开发环境
```bash
# 前端 (http://localhost:3000)
yarn start

# 后端 (http://localhost:8787)
cd worker && yarn dev
```

### 生产环境
- **前端**: Cloudflare Pages 自动构建
- **后端**: Cloudflare Workers 自动部署
- **存储**: Cloudflare KV (聊天历史)

## 📋 Git 工作流

1. **推送到 GitHub**: 代码推送触发自动部署
2. **Workers 部署**: 检测到 `/worker/` 变更自动部署
3. **Pages 部署**: 检测到前端变更自动构建和部署
4. **环境隔离**: 使用不同分支进行开发/生产环境管理