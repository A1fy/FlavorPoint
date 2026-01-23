/**
 * 顶部导航栏组件
 * 包含菜单按钮、页面标题、搜索和用户信息
 */
import React from 'react';

interface HeaderProps {
    title: string;
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
            {/* 左侧：菜单按钮和标题 */}
            <div className="flex items-center gap-4">
                {/* 移动端菜单按钮 */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="打开菜单"
                >
                    <span className="material-icons text-gray-600">menu</span>
                </button>

                {/* 页面标题 */}
                <h1 className="text-lg lg:text-xl font-semibold text-gray-800">
                    {title}
                </h1>
            </div>

            {/* 右侧：搜索和用户 */}
            <div className="flex items-center gap-3">
                {/* 搜索框 - 仅在大屏幕显示 */}
                <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
                    <span className="material-icons text-gray-400 text-lg">search</span>
                    <input
                        type="text"
                        placeholder="搜索..."
                        className="bg-transparent border-none outline-none ml-2 text-sm w-40 lg:w-56"
                    />
                </div>

                {/* 通知按钮 */}
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                    <span className="material-icons text-gray-600">notifications</span>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* 用户头像 */}
                <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">管</span>
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">管理员</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
