/**
 * 仪表盘页面
 * 展示统计数据概览和图表
 */
import React, { useEffect, useState } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from 'recharts';
import { supabase } from '@/lib/supabase';
import type { DashboardStats, Order, Product } from '@/types';

// 模拟的趋势数据
const weeklyData = [
    { day: '周一', orders: 12, revenue: 2400 },
    { day: '周二', orders: 19, revenue: 3800 },
    { day: '周三', orders: 15, revenue: 3000 },
    { day: '周四', orders: 22, revenue: 4400 },
    { day: '周五', orders: 28, revenue: 5600 },
    { day: '周六', orders: 35, revenue: 7000 },
    { day: '周日', orders: 32, revenue: 6400 },
];

// 统计卡片组件
interface StatCardProps {
    title: string;
    value: string | number;
    icon: string;
    trend?: string;
    trendUp?: boolean;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendUp, color }) => (
    <div className="card">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm text-gray-500 mb-1">{title}</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-800">{value}</p>
                {trend && (
                    <p className={`text-sm mt-1 flex items-center gap-1 ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
                        <span className="material-icons text-sm">
                            {trendUp ? 'trending_up' : 'trending_down'}
                        </span>
                        {trend}
                    </p>
                )}
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <span className="material-icons text-white text-2xl">{icon}</span>
            </div>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        todayOrders: 0,
        todayRevenue: 0,
        totalUsers: 0,
        totalProducts: 0,
        activeProducts: 0,
        pendingOrders: 0,
    });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [topProducts, setTopProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            // 获取今日日期范围
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            // 并行请求所有数据
            const [
                { data: todayOrders },
                { count: totalUsers },
                { data: products },
                { count: pendingOrders },
                { data: recent },
            ] = await Promise.all([
                supabase
                    .from('orders')
                    .select('*')
                    .gte('created_at', today.toISOString())
                    .lt('created_at', tomorrow.toISOString()),
                supabase.from('users').select('*', { count: 'exact', head: true }),
                supabase.from('products').select('*'),
                supabase
                    .from('orders')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'placed'),
                supabase
                    .from('orders')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(5),
            ]);

            // 计算统计数据
            const todayRevenue = (todayOrders || []).reduce((acc, o) => acc + o.final_price, 0);
            const activeProducts = (products || []).filter(p => p.tag_type !== 'sold-out').length;

            setStats({
                todayOrders: todayOrders?.length || 0,
                todayRevenue,
                totalUsers: totalUsers || 0,
                totalProducts: products?.length || 0,
                activeProducts,
                pendingOrders: pendingOrders || 0,
            });

            setRecentOrders(recent || []);
            setTopProducts((products || []).slice(0, 5));
        } catch (error) {
            console.error('加载仪表盘数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 统计卡片区域 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="今日订单"
                    value={stats.todayOrders}
                    icon="receipt_long"
                    trend="+12%"
                    trendUp={true}
                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <StatCard
                    title="今日收入"
                    value={`¥${stats.todayRevenue}`}
                    icon="payments"
                    trend="+8.5%"
                    trendUp={true}
                    color="bg-gradient-to-br from-green-500 to-green-600"
                />
                <StatCard
                    title="用户总数"
                    value={stats.totalUsers}
                    icon="people"
                    color="bg-gradient-to-br from-purple-500 to-purple-600"
                />
                <StatCard
                    title="待处理订单"
                    value={stats.pendingOrders}
                    icon="pending_actions"
                    color="bg-gradient-to-br from-orange-500 to-orange-600"
                />
            </div>

            {/* 图表区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 销售趋势图 */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">本周销售趋势</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                                <YAxis stroke="#9ca3af" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    }}
                                    formatter={(value: number) => [`¥${value}`, '收入']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 订单数量图 */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">本周订单数量</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                                <YAxis stroke="#9ca3af" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    }}
                                    formatter={(value: number) => [value, '订单数']}
                                />
                                <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 下方信息区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 最近订单 */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">最近订单</h3>
                        <a href="/orders" className="text-sm text-primary hover:text-primary-600">
                            查看全部
                        </a>
                    </div>
                    <div className="space-y-3">
                        {recentOrders.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">暂无订单</p>
                        ) : (
                            recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-800">订单 #{order.id.slice(0, 8)}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleString('zh-CN')}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-800">¥{order.final_price}</p>
                                        <span className={`badge ${order.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                                            {order.status === 'completed' ? '已完成' : '待处理'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 热门商品 */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">热门商品</h3>
                        <a href="/products" className="text-sm text-primary hover:text-primary-600">
                            查看全部
                        </a>
                    </div>
                    <div className="space-y-3">
                        {topProducts.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">暂无商品</p>
                        ) : (
                            topProducts.map((product, index) => (
                                <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-semibold">
                                        {index + 1}
                                    </span>
                                    <img
                                        src={product.image || ''}
                                        alt={product.name}
                                        className="w-10 h-10 rounded-lg object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-800 truncate">{product.name}</p>
                                        <p className="text-sm text-gray-500">¥{product.price}</p>
                                    </div>
                                    {product.tag_type && (
                                        <span className={`badge ${product.tag_type === 'hot' ? 'badge-danger' :
                                                product.tag_type === 'new' ? 'badge-info' : 'badge-warning'
                                            }`}>
                                            {product.tag_type === 'hot' ? '热门' :
                                                product.tag_type === 'new' ? '新品' : '售罄'}
                                        </span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
