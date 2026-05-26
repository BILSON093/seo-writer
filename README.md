# SEO Writer - AI 智能 SEO 内容生成器

一键生成 SEO 优化文章、Meta 标签和标题创意。支持中英文，按次付费。

## 功能

- **SEO 文章生成** - 输入关键词，AI 自动生成高质量 SEO 文章
- **Meta 标签生成** - 生成标题标签和 Meta 描述，提高点击率
- **标题创意** - 生成 20+ 个 SEO 优化的标题方案
- **多语言支持** - 中文、英文、日文、韩文等 7 种语言
- **按次付费** - 支持信用卡、支付宝、微信支付
- **每天免费 3 次** - 无需注册即可体验

## 技术栈

- **前端：** Next.js 16 + React + Tailwind CSS + shadcn/ui
- **后端：** Next.js API Routes
- **AI：** Mimo API（兼容 OpenAI 格式）
- **支付：** Stripe（支持信用卡、支付宝、微信支付）
- **认证：** NextAuth.js
- **部署：** Vercel
- **国际化：** next-intl（中文/英文）

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/BILSON093/seo-writer.git
cd seo-writer
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件，填入以下配置：

```env
# Mimo AI API
MIMO_API_KEY=你的Mimo API Key
MIMO_API_BASE=https://token-plan-cn.xiaomimimo.com/v1

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=随机生成的密钥

# Stripe（可选，不配置则只有免费功能）
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_STARTER=price_xxx
STRIPE_PRICE_PRO=price_xxx
STRIPE_PRICE_BUSINESS=price_xxx
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 部署到 Vercel

### 1. 推送到 GitHub

```bash
git add -A
git commit -m "init: 项目初始化"
git push
```

### 2. 在 Vercel 导入项目

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 导入 GitHub 仓库
4. 配置环境变量
5. 部署

### 3. 配置 Stripe Webhook

1. 在 Stripe Dashboard → Developers → Webhooks
2. 添加端点：`https://你的域名.vercel.app/api/webhooks/stripe`
3. 选择事件：`checkout.session.completed`
4. 复制 Webhook Secret 到环境变量

## Stripe 支付配置

### 创建产品和价格

在 Stripe Dashboard → Products 中创建 3 个产品：

| 产品 | 价格 | 说明 |
|------|------|------|
| 入门包 | $4.99 | 10 次生成额度 |
| 专业包 | $19.99 | 50 次生成额度 |
| 商业包 | $29.99 | 100 次生成额度 |

每个产品创建后，复制 Price ID（格式：`price_xxx`）到环境变量。

### 支持的支付方式

- 信用卡（全球）
- 支付宝（中国用户）
- 微信支付（中国用户）

## 项目结构

```
seo-writer/
├── app/
│   ├── [locale]/          # 多语言页面
│   │   ├── page.tsx       # 首页
│   │   ├── dashboard/     # 控制台
│   │   └── pricing/       # 定价页
│   └── api/               # API 路由
│       ├── auth/          # 认证
│       ├── generate/      # AI 生成
│       ├── checkout/      # 支付
│       ├── usage/         # 使用量
│       └── webhooks/      # Stripe Webhook
├── components/            # 组件
├── lib/                   # 工具库
│   ├── auth.ts            # 认证配置
│   ├── mimo.ts            # AI API
│   ├── stripe.ts          # 支付配置
│   └── usage.ts           # 使用量管理
├── messages/              # 翻译文件
│   ├── en.json            # 英文
│   └── zh.json            # 中文
└── middleware.ts           # 中间件
```

## 许可证

MIT
