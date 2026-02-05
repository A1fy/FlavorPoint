# 🍜 FlavorPoint 积分商城

<div align="center">

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel)

**一个精美的移动端积分商城应用，支持商品浏览、购物车、积分兑换、优惠券等功能**

[🌐 在线演示](https://www.flavorpoint.top) · [📱 管理后台](https://flavorpoint-admin.vercel.app)

</div>

---

## ✨ 功能特性

### 用户端
- 🏠 **首页展示** - 热门商品推荐、分类浏览
- 🍔 **商品菜单** - 按分类浏览商品，支持大份/标准份选择
- 🛒 **购物车** - 添加商品、修改数量、应用优惠券
- 💰 **积分支付** - 使用积分兑换商品
- 🎫 **优惠券中心** - 领取和使用优惠券
- ⭐ **收藏功能** - 收藏喜爱的商品
- 📋 **订单历史** - 查看历史订单记录
- ✅ **每日签到** - 签到获取积分奖励

### 管理后台
- 📊 **数据仪表盘** - 查看销售统计和用户数据
- 🍕 **商品管理** - 添加、编辑、删除商品
- 📂 **分类管理** - 管理商品分类
- 🎟️ **优惠券管理** - 创建和管理优惠券
- 📦 **订单管理** - 查看和处理订单
- 👥 **用户管理** - 查看用户信息

---

## 🛠️ 技术栈

| 分类 | 技术 |
|------|------|
| **前端框架** | React 19 + TypeScript |
| **构建工具** | Vite 6 |
| **后端服务** | Supabase (PostgreSQL + Auth + Storage) |
| **图片存储** | Cloudflare R2 |
| **部署平台** | Vercel |
| **样式方案** | CSS + TailwindCSS (管理端) |

---

## 📁 项目结构

```
FlavorPoint/
├── App.tsx                 # 主应用组件
├── index.tsx               # 应用入口
├── types.ts                # TypeScript 类型定义
├── screens/                # 页面组件
│   ├── Home.tsx            # 首页
│   ├── Menu.tsx            # 菜单页
│   ├── Cart.tsx            # 购物车
│   ├── Profile.tsx         # 个人中心
│   ├── ProductDetail.tsx   # 商品详情
│   └── OrderHistory.tsx    # 订单历史
├── components/             # 公共组件
│   └── BottomNav.tsx       # 底部导航
├── src/
│   ├── lib/                # 工具库
│   │   ├── supabase.ts     # Supabase 客户端
│   │   └── database.types.ts # 数据库类型
│   ├── services/           # API 服务层
│   │   ├── productService.ts
│   │   ├── userService.ts
│   │   ├── cartService.ts
│   │   ├── orderService.ts
│   │   ├── couponService.ts
│   │   └── pointsService.ts
│   └── hooks/              # React Hooks
│       └── useAppData.ts   # 全局数据管理
├── admin/                  # 管理后台 (独立项目)
│   ├── src/
│   │   ├── pages/          # 管理页面
│   │   ├── components/     # 管理组件
│   │   └── lib/            # 工具库
│   └── package.json
└── package.json
```

---

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn
- Supabase 账户

### 1. 克隆仓库

```bash
git clone https://github.com/A1fy/FlavorPoint.git
cd FlavorPoint
```

### 2. 安装依赖

```bash
# 用户端
npm install

# 管理后台
cd admin && npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件：

```env
VITE_SUPABASE_URL=你的_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=你的_SUPABASE_ANON_KEY

# 可选：图片上传 (Cloudflare R2)
VITE_R2_ACCOUNT_ID=你的_R2_ACCOUNT_ID
VITE_R2_ACCESS_KEY_ID=你的_R2_ACCESS_KEY
VITE_R2_SECRET_ACCESS_KEY=你的_R2_SECRET_KEY
VITE_R2_BUCKET_NAME=你的_BUCKET_NAME
VITE_R2_PUBLIC_URL=你的_R2_PUBLIC_URL
```

### 4. 初始化数据库

在 Supabase SQL Editor 中执行数据库初始化脚本（可在 `supabase/` 目录找到或联系开发者获取）。

### 5. 启动开发服务器

```bash
# 用户端 (端口 5173)
npm run dev

# 管理后台 (端口 5174)
cd admin && npm run dev
```

---

## 📱 截图预览

| 首页 | 菜单 | 购物车 | 个人中心 |
|:----:|:----:|:------:|:--------:|
| 热门推荐 | 分类浏览 | 结算功能 | 积分管理 |

---

## 🌐 部署

项目已部署在 Vercel 上：

- **用户端**: [www.flavorpoint.top](https://www.flavorpoint.top)
- **管理后台**: 独立部署

### Vercel 部署配置

用户端：
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

管理后台：
- Root Directory: `admin`
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

---

## 📄 开源协议

本项目仅供学习交流使用。

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

<div align="center">

**Made with ❤️ by A1fy**

</div>
