/**
 * 管理端类型定义
 */

// 商品类型
export interface Product {
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

// 分类类型
export interface Category {
    id: string;
    name: string;
    icon: string | null;
}

// 用户类型
export interface User {
    id: string;
    auth_id: string | null;
    name: string;
    avatar: string | null;
    level: string;
    points: number;
    created_at: string;
    updated_at: string;
}

// 订单类型
export interface Order {
    id: string;
    user_id: string;
    status: 'placed' | 'completed';
    total_price: number;
    discount_amount: number;
    final_price: number;
    created_at: string;
    updated_at: string;
    // 关联数据
    user?: User;
    order_items?: OrderItem[];
}

// 订单项类型
export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    size: string;
    price: number;
    product_name: string | null;
    product_image: string | null;
}

// 优惠券类型
export interface Coupon {
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
export interface UserCoupon {
    id: string;
    user_id: string;
    coupon_id: string;
    is_used: boolean;
    used_at: string | null;
    created_at: string;
    // 关联数据
    coupon?: Coupon;
    user?: User;
}

// 积分交易类型
export interface PointsTransaction {
    id: string;
    user_id: string;
    amount: number;
    type: 'earn' | 'spend';
    description: string | null;
    order_id: string | null;
    created_at: string;
}

// 仪表盘统计类型
export interface DashboardStats {
    todayOrders: number;
    todayRevenue: number;
    totalUsers: number;
    totalProducts: number;
    activeProducts: number;
    pendingOrders: number;
}

// 表格分页类型
export interface Pagination {
    page: number;
    pageSize: number;
    total: number;
}
