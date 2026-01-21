/**
 * 数据库类型定义
 * 与 Supabase 表结构对应的 TypeScript 类型
 */

// 商品表类型
export interface DbProduct {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
    category: string;
    rating: number | null;
    calories: number | null;
    tag_type: 'hot' | 'new' | 'sold-out' | null;
    created_at: string;
    updated_at: string;
}

// 分类表类型
export interface DbCategory {
    id: string;
    name: string;
    icon: string | null;
}

// 用户表类型
export interface DbUser {
    id: string;
    auth_id: string | null;
    name: string;
    avatar: string | null;
    level: string;
    points: number;
    created_at: string;
    updated_at: string;
}

// 购物车项类型
export interface DbCartItem {
    id: string;
    user_id: string;
    product_id: string;
    quantity: number;
    size: 'standard' | 'large';
    current_price: number;
    created_at: string;
    // 关联查询时的商品信息
    products?: DbProduct;
}

// 订单表类型
export interface DbOrder {
    id: string;
    user_id: string;
    status: 'placed' | 'completed';
    total_price: number;
    discount_amount: number;
    final_price: number;
    created_at: string;
    updated_at: string;
    // 关联查询时的订单项
    order_items?: DbOrderItem[];
}

// 订单项类型
export interface DbOrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    size: 'standard' | 'large';
    price: number;
    product_name: string | null;
    product_image: string | null;
    // 关联查询时的商品信息
    products?: DbProduct;
}

// 优惠券定义类型
export interface DbCoupon {
    id: string;
    title: string;
    amount: number;
    type: 'discount' | 'deduction';
    min_spend: number;
    description: string | null;
    is_active: boolean;
    created_at: string;
}

// 用户优惠券类型
export interface DbUserCoupon {
    id: string;
    user_id: string;
    coupon_id: string;
    is_used: boolean;
    used_at: string | null;
    created_at: string;
    // 关联查询时的优惠券信息
    coupons?: DbCoupon;
}

// 收藏类型
export interface DbFavorite {
    id: string;
    user_id: string;
    product_id: string;
    created_at: string;
}

// 积分交易类型
export interface DbPointsTransaction {
    id: string;
    user_id: string;
    amount: number;
    type: 'earn' | 'spend';
    description: string | null;
    order_id: string | null;
    created_at: string;
}
