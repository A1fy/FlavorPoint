/**
 * 侧边栏组件
 * 响应式设计：移动端可折叠，桌面端固定显示
 */
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface NavItem {
    path: string;
    label: string;
    icon: string;
}

const navItems: NavItem[] = [
    { path: '/', label: '仪表盘', icon: 'dashboard' },
    { path: '/products', label: '商品管理', icon: 'inventory_2' },
    { path: '/categories', label: '分类管理', icon: 'category' },
    { path: '/orders', label: '订单管理', icon: 'receipt_long' },
    { path: '/users', label: '用户管理', icon: 'people' },
    { path: '/coupons', label: '优惠券管理', icon: 'local_offer' },
    { path: '/settings', label: '系统设置', icon: 'settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const location = useLocation();
    const [stats, setStats] = useState({
        totalProducts: 0,
        pendingOrders: 0,
        totalUsers: 0,
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [
                { count: productsCount },
                { count: ordersCount },
                { count: usersCount },
            ] = await Promise.all([
                supabase.from('products').select('*', { count: 'exact', head: true }),
                supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'placed'),
                supabase.from('users').select('*', { count: 'exact', head: true }),
            ]);
            setStats({
                totalProducts: productsCount || 0,
                pendingOrders: ordersCount || 0,
                totalUsers: usersCount || 0,
            });
        } catch (error) {
            console.error('加载统计数据失败:', error);
        }
    };

    return (
        <>
            {/* 移动端遮罩层 */}
            {isOpen && (
                <div
                    className="sidebar-overlay animate-fadeIn"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* 侧边栏 */}
            <aside
                className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out flex flex-col
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                {/* Logo 区域 */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-600 rounded-lg flex items-center justify-center">
                            <span className="material-icons text-white text-lg">restaurant</span>
                        </div>
                        <span className="font-bold text-lg text-gray-800">FlavorPoint</span>
                    </div>
                    {/* 移动端关闭按钮 */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="关闭菜单"
                    >
                        <span className="material-icons text-gray-500">close</span>
                    </button>
                </div>

                {/* 导航菜单 */}
                <nav className="p-4 space-y-1 flex-shrink-0">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200
                  ${isActive
                                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }
                `}
                            >
                                <span className="material-icons text-xl">{item.icon}</span>
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* 统计信息区域 */}
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-3">
                        {/* 统计卡片标题 */}
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
                            数据概览
                        </h3>

                        {/* 商品统计 */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-blue-600 font-medium">商品总数</p>
                                    <p className="text-2xl font-bold text-blue-700 mt-1">{stats.totalProducts}</p>
                                </div>
                                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <span className="material-icons text-white">inventory_2</span>
                                </div>
                            </div>
                        </div>

                        {/* 待处理订单 */}
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-orange-600 font-medium">待处理订单</p>
                                    <p className="text-2xl font-bold text-orange-700 mt-1">{stats.pendingOrders}</p>
                                </div>
                                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                                    <span className="material-icons text-white">pending_actions</span>
                                </div>
                            </div>
                        </div>

                        {/* 用户总数 */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-purple-600 font-medium">用户总数</p>
                                    <p className="text-2xl font-bold text-purple-700 mt-1">{stats.totalUsers}</p>
                                </div>
                                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                    <span className="material-icons text-white">people</span>
                                </div>
                            </div>
                        </div>

                        {/* 快捷操作 */}
                        <div className="pt-3 border-t border-gray-100">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-3">
                                快捷操作
                            </h3>
                            <div className="space-y-2">
                                <NavLink
                                    to="/products"
                                    onClick={onClose}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <span className="material-icons text-sm">add_circle</span>
                                    <span>新增商品</span>
                                </NavLink>
                                <NavLink
                                    to="/orders"
                                    onClick={onClose}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <span className="material-icons text-sm">list_alt</span>
                                    <span>查看订单</span>
                                </NavLink>
                                <NavLink
                                    to="/coupons"
                                    onClick={onClose}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <span className="material-icons text-sm">local_offer</span>
                                    <span>创建优惠券</span>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 底部版本信息 */}
                <div className="p-4 border-t border-gray-100 flex-shrink-0">
                    <div className="text-xs text-gray-400 text-center">
                        管理后台 v1.0.0
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
