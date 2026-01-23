/**
 * 主布局组件
 * 响应式布局：包含侧边栏、顶部导航和内容区域
 */
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

// 页面标题映射
const pageTitles: Record<string, string> = {
    '/': '仪表盘',
    '/products': '商品管理',
    '/categories': '分类管理',
    '/orders': '订单管理',
    '/users': '用户管理',
    '/coupons': '优惠券管理',
    '/settings': '系统设置',
};

const Layout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // 获取当前页面标题
    const currentTitle = pageTitles[location.pathname] || '管理后台';

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* 侧边栏 */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* 主内容区域 */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* 顶部导航 */}
                <Header
                    title={currentTitle}
                    onMenuClick={() => setSidebarOpen(true)}
                />

                {/* 页面内容 */}
                <main className="flex-1 p-4 lg:p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
