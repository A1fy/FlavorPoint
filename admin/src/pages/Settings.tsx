/**
 * 系统设置页面
 * 管理店铺信息和系统配置
 */
import React, { useState } from 'react';

const Settings: React.FC = () => {
    const [shopInfo, setShopInfo] = useState({
        name: 'FlavorPoint',
        slogan: '健康美味，每日新鲜',
        address: '北京市朝阳区某某路123号',
        phone: '400-888-8888',
        email: 'contact@flavorpoint.com',
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        // 模拟保存
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSaving(false);
        alert('设置已保存');
    };

    return (
        <div className="max-w-2xl space-y-6">
            {/* 店铺信息 */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">店铺信息</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">店铺名称</label>
                        <input
                            type="text"
                            className="input"
                            value={shopInfo.name}
                            onChange={(e) => setShopInfo({ ...shopInfo, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">店铺标语</label>
                        <input
                            type="text"
                            className="input"
                            value={shopInfo.slogan}
                            onChange={(e) => setShopInfo({ ...shopInfo, slogan: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">店铺地址</label>
                        <input
                            type="text"
                            className="input"
                            value={shopInfo.address}
                            onChange={(e) => setShopInfo({ ...shopInfo, address: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                            <input
                                type="tel"
                                className="input"
                                value={shopInfo.phone}
                                onChange={(e) => setShopInfo({ ...shopInfo, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">邮箱地址</label>
                            <input
                                type="email"
                                className="input"
                                value={shopInfo.email}
                                onChange={(e) => setShopInfo({ ...shopInfo, email: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 积分系统设置 */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">积分系统</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-800">每日签到奖励</p>
                            <p className="text-sm text-gray-500">用户每日签到可获得的积分</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                className="input w-24 text-center"
                                defaultValue={50}
                                min="0"
                            />
                            <span className="text-gray-500">积分</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-800">大份加价</p>
                            <p className="text-sm text-gray-500">选择大份时额外增加的积分</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                className="input w-24 text-center"
                                defaultValue={100}
                                min="0"
                            />
                            <span className="text-gray-500">积分</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 会员等级设置 */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">会员等级</h3>
                <div className="space-y-3">
                    {[
                        { level: '普通会员', points: 0, color: 'bg-gray-400' },
                        { level: '银卡会员', points: 1000, color: 'bg-gray-500' },
                        { level: '黄金会员', points: 5000, color: 'bg-yellow-500' },
                        { level: '钻石会员', points: 20000, color: 'bg-blue-500' },
                    ].map((item) => (
                        <div key={item.level} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">{item.level}</p>
                            </div>
                            <div className="text-sm text-gray-500">
                                {item.points === 0 ? '默认等级' : `累计 ${item.points} 积分`}
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                    * 会员等级根据用户历史消费积分自动升级
                </p>
            </div>

            {/* 数据库信息 */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">数据库信息</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">数据库类型</span>
                        <span className="text-gray-800">PostgreSQL (Supabase)</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">连接状态</span>
                        <span className="text-green-600 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            已连接
                        </span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-gray-500">环境</span>
                        <span className="text-gray-800">开发环境</span>
                    </div>
                </div>
            </div>

            {/* 保存按钮 */}
            <div className="flex justify-end">
                <button onClick={handleSave} disabled={saving} className="btn btn-primary">
                    <span className="material-icons">save</span>
                    {saving ? '保存中...' : '保存设置'}
                </button>
            </div>
        </div>
    );
};

export default Settings;
