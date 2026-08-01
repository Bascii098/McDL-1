# McDL — 快餐点餐系统

Vue 3 + Vite 前端 + Express 后端 + MySQL 数据库，仿麦当劳自助点餐大屏。

## 技术栈

| 端 | 技术 |
|---|------|
| 前端 | Vue 3 (Composition API), Vite, Pinia, Vue Router, Element Plus, Lucide Icons |
| 后端 | Express, JWT 鉴权, bcryptjs 加密 |
| 数据库 | MySQL 8（端口 3307），mysql2 驱动 |

## 前置要求

- Node.js ≥ 18
- MySQL 8（或更高版本）
- 确保 3307 端口未被占用

## 快速启动

### 1. 数据库

MySQL 实例需运行在 **3307** 端口，root 无密码：

```bash
# 初始化数据库
mysql -u root -P 3307 < api-server/db/mcdl_v2.sql
```

数据库名 `mcdl_v2`，包含 5 张表：`ev_users`, `food_category`, `foods`, `cart`, `orders`。

### 2. 后端

```bash
cd api-server
npm install
node app.js
# → api server running at http://127.0.0.1:3007
```

### 3. 前端

```bash
npm install
npm run dev
# → http://localhost:5173
```

## 目录结构

```
├── api-server/           # Express 后端
│   ├── app.js            # 入口，JWT / CORS / 路由挂载
│   ├── config.js         # JWT 密钥
│   ├── db/               # 数据库连接 + SQL 脚本
│   ├── router/           # 路由 (user, foods, cart, order)
│   └── router_handler/   # 路由处理函数
├── src/
│   ├── apis/             # 前端 API 封装
│   ├── router/           # Vue Router 路由定义
│   ├── stores/           # Pinia 状态管理 (user, cart)
│   ├── styles/           # 全局样式 + 设计令牌
│   ├── utils/            # Axios 实例 (拦截器)
│   └── views/            # 页面组件
│       ├── Home/         # 首页 (Banner + 分类卡片)
│       ├── Layout/       # 布局 (Header, Footer)
│       ├── Login/        # 登录/注册
│       ├── FoodsDetail/  # 商品详情
│       ├── cart/         # 购物车
│       ├── menu/         # 菜单 (侧边导航 + 商品网格)
│       └── order/        # 订单列表
└── public/img/           # 商品图片 + Banner 图片
```

## API 接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/user/register` | 注册 | — |
| POST | `/api/user/login` | 登录 | — |
| GET | `/api/foods/category` | 分类列表 | — |
| GET | `/api/foods/list/:categoryId` | 商品列表 | — |
| GET | `/api/foods/detail/:id` | 商品详情 | — |
| POST | `/api/cart/add` | 加入购物车 | JWT |
| GET | `/api/cart/list` | 购物车列表 | JWT |
| POST | `/api/cart/update` | 更新数量 | JWT |
| POST | `/api/cart/delete` | 删除单品 | JWT |
| POST | `/api/cart/clear` | 清空购物车 | JWT |
| POST | `/api/order/add` | 下单 | JWT |
| GET | `/api/order/list` | 订单列表 | JWT |
