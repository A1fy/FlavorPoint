-- =====================================================
-- FlavorPoint 数据库架构
-- 在 Supabase SQL Editor 中执行此脚本
-- =====================================================

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. 商品表 (products)
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL DEFAULT 0,
    image TEXT,
    category VARCHAR(50) NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0,
    calories INTEGER DEFAULT 0,
    tag_type VARCHAR(20), -- 'hot', 'new', 'sold-out'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_tag_type ON products(tag_type);

-- =====================================================
-- 2. 分类表 (categories)
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(50)
);

-- =====================================================
-- 3. 用户表 (users)
-- NOTE: 此表与 Supabase auth.users 关联，但独立存储业务数据
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID UNIQUE, -- 关联 Supabase Auth (可选)
    name VARCHAR(50) NOT NULL,
    avatar TEXT,
    level VARCHAR(20) DEFAULT '普通会员',
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id);

-- =====================================================
-- 4. 购物车表 (cart_items)
-- =====================================================
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    size VARCHAR(20) NOT NULL DEFAULT 'standard', -- 'standard' or 'large'
    current_price INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id, size)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);

-- =====================================================
-- 5. 订单表 (orders)
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'placed', -- 'placed', 'completed'
    total_price INTEGER NOT NULL DEFAULT 0,
    discount_amount INTEGER DEFAULT 0,
    final_price INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- =====================================================
-- 6. 订单项表 (order_items)
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    size VARCHAR(20) NOT NULL DEFAULT 'standard',
    price INTEGER NOT NULL,
    -- 冗余存储商品信息，防止商品删除后订单数据丢失
    product_name VARCHAR(100),
    product_image TEXT
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- =====================================================
-- 7. 优惠券定义表 (coupons)
-- =====================================================
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(50) NOT NULL,
    amount DECIMAL(5,2) NOT NULL, -- 抵扣金额或折扣比例
    type VARCHAR(20) NOT NULL, -- 'discount' or 'deduction'
    min_spend INTEGER DEFAULT 0,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. 用户优惠券表 (user_coupons)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, coupon_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_coupons_user_id ON user_coupons(user_id);

-- =====================================================
-- 9. 收藏表 (favorites)
-- =====================================================
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);

-- =====================================================
-- 10. 积分交易表 (points_transactions)
-- =====================================================
CREATE TABLE IF NOT EXISTS points_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- 正数为获取，负数为消费
    type VARCHAR(20) NOT NULL, -- 'earn' or 'spend'
    description TEXT,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_points_transactions_user_id ON points_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_created_at ON points_transactions(created_at DESC);

-- =====================================================
-- 触发器：自动更新 updated_at 字段
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为需要的表创建触发器
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Row Level Security (RLS) 策略
-- NOTE: 由于无需登录功能，暂时禁用 RLS
-- 如果后续需要启用，请取消以下注释
-- =====================================================

-- 禁用 RLS（开发阶段）
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;

-- 创建公开读取策略（所有人可读）
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Coupons are viewable by everyone" ON coupons
    FOR SELECT USING (true);

-- 创建允许匿名访问的策略（使用 anon key 访问）
CREATE POLICY "Allow anonymous read users" ON users
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous update users" ON users
    FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous read cart_items" ON cart_items
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert cart_items" ON cart_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update cart_items" ON cart_items
    FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous delete cart_items" ON cart_items
    FOR DELETE USING (true);

CREATE POLICY "Allow anonymous read orders" ON orders
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert orders" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update orders" ON orders
    FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous read order_items" ON order_items
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert order_items" ON order_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous read user_coupons" ON user_coupons
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert user_coupons" ON user_coupons
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update user_coupons" ON user_coupons
    FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous read favorites" ON favorites
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert favorites" ON favorites
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous delete favorites" ON favorites
    FOR DELETE USING (true);

CREATE POLICY "Allow anonymous read points_transactions" ON points_transactions
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert points_transactions" ON points_transactions
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- 完成提示
-- =====================================================
-- 执行完成后，请继续执行 seed.sql 脚本导入初始数据
