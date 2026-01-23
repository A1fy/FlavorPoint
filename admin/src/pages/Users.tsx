/**
 * 用户管理页面
 * 支持用户查看和积分调整
 */
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, PointsTransaction } from '@/types';

// 会员等级配置（与系统设置页面保持一致）
const MEMBER_LEVELS = [
    { level: '普通会员', minPoints: 0, color: 'bg-gray-400' },
    { level: '银卡会员', minPoints: 1000, color: 'bg-gray-500' },
    { level: '黄金会员', minPoints: 5000, color: 'bg-yellow-500' },
    { level: '钻石会员', minPoints: 20000, color: 'bg-blue-500' },
];

// 根据积分计算会员等级
function calculateMemberLevel(points: number): string {
    for (let i = MEMBER_LEVELS.length - 1; i >= 0; i--) {
        if (points >= MEMBER_LEVELS[i].minPoints) {
            return MEMBER_LEVELS[i].level;
        }
    }
    return '普通会员';
}

// 会员等级编辑弹窗
interface LevelEditProps {
    user: User;
    onClose: () => void;
    onSave: () => void;
}

const LevelEdit: React.FC<LevelEditProps> = ({ user, onClose, onSave }) => {
    const [selectedLevel, setSelectedLevel] = useState(user.level);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { error } = await supabase
                .from('users')
                .update({ level: selectedLevel })
                .eq('id', user.id);
            if (error) throw error;
            onSave();
        } catch (error) {
            console.error('更新会员等级失败:', error);
            alert('更新失败，请重试');
        } finally {
            setSaving(false);
        }
    };

    const autoLevel = calculateMemberLevel(user.points);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-fadeIn">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800">编辑会员等级</h2>
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
                            <span className="material-icons text-gray-500">close</span>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* 用户信息 */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <img
                            src={user.avatar || ''}
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <p className="font-medium text-gray-800">{user.name}</p>
                            <p className="text-sm text-gray-500">当前积分: {user.points}</p>
                        </div>
                    </div>

                    {/* 自动等级提示 */}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                            <span className="material-icons text-blue-600 text-sm mt-0.5">info</span>
                            <div className="text-sm">
                                <p className="text-blue-800 font-medium">根据积分自动计算的等级</p>
                                <p className="text-blue-600 mt-1">建议等级：{autoLevel}</p>
                            </div>
                        </div>
                    </div>

                    {/* 等级选择 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">选择会员等级</label>
                        <div className="space-y-2">
                            {MEMBER_LEVELS.map((item) => (
                                <button
                                    key={item.level}
                                    type="button"
                                    onClick={() => setSelectedLevel(item.level)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${selectedLevel === item.level
                                            ? 'border-primary bg-primary/5'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                    <div className="flex-1 text-left">
                                        <p className="font-medium text-gray-800">{item.level}</p>
                                        <p className="text-xs text-gray-500">
                                            {item.minPoints === 0 ? '默认等级' : `累计 ${item.minPoints} 积分`}
                                        </p>
                                    </div>
                                    {selectedLevel === item.level && (
                                        <span className="material-icons text-primary">check_circle</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
                            取消
                        </button>
                        <button type="submit" disabled={saving} className="btn btn-primary flex-1">
                            {saving ? '保存中...' : '保存'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// 积分调整弹窗
interface PointsAdjustProps {
    user: User;
    onClose: () => void;
    onSave: () => void;
}

const PointsAdjust: React.FC<PointsAdjustProps> = ({ user, onClose, onSave }) => {
    const [amount, setAmount] = useState<number>(0);
    const [type, setType] = useState<'earn' | 'spend'>('earn');
    const [description, setDescription] = useState('管理员调整');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (amount <= 0) {
            alert('请输入有效的积分数量');
            return;
        }

        setSaving(true);
        try {
            // 计算新积分
            const newPoints = type === 'earn'
                ? user.points + amount
                : Math.max(0, user.points - amount);

            // 计算新的会员等级（基于积分自动升级）
            const newLevel = calculateMemberLevel(newPoints);

            // 更新用户积分和会员等级
            const { error: userError } = await supabase
                .from('users')
                .update({
                    points: newPoints,
                    level: newLevel  // 自动更新会员等级
                })
                .eq('id', user.id);
            if (userError) throw userError;

            // 记录积分交易
            const { error: txError } = await supabase
                .from('points_transactions')
                .insert({
                    user_id: user.id,
                    amount: type === 'earn' ? amount : -amount,
                    type,
                    description,
                });
            if (txError) throw txError;

            onSave();
        } catch (error) {
            console.error('调整积分失败:', error);
            alert('调整失败，请重试');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-fadeIn">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800">调整积分</h2>
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
                            <span className="material-icons text-gray-500">close</span>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* 用户信息 */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <img
                            src={user.avatar || ''}
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <p className="font-medium text-gray-800">{user.name}</p>
                            <p className="text-sm text-gray-500">当前积分: {user.points}</p>
                        </div>
                    </div>

                    {/* 调整类型 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">调整类型</label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setType('earn')}
                                className={`flex-1 py-2 rounded-lg font-medium transition-all ${type === 'earn'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                增加积分
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('spend')}
                                className={`flex-1 py-2 rounded-lg font-medium transition-all ${type === 'spend'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                扣除积分
                            </button>
                        </div>
                    </div>

                    {/* 积分数量 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">积分数量 *</label>
                        <input
                            type="number"
                            className="input"
                            value={amount || ''}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            min="1"
                            required
                        />
                    </div>

                    {/* 调整原因 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">调整原因 *</label>
                        <input
                            type="text"
                            className="input"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    {/* 预览 */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">
                            调整后积分：
                            <span className={`font-semibold ml-1 ${type === 'earn' ? 'text-green-600' : 'text-red-500'}`}>
                                {type === 'earn' ? user.points + amount : Math.max(0, user.points - amount)}
                            </span>
                        </p>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
                            取消
                        </button>
                        <button type="submit" disabled={saving} className="btn btn-primary flex-1">
                            {saving ? '处理中...' : '确认调整'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// 用户详情弹窗
interface UserDetailProps {
    user: User;
    onClose: () => void;
    onAdjustPoints: () => void;
    setShowLevelEdit: (show: boolean) => void;
}

const UserDetail: React.FC<UserDetailProps> = ({ user, onClose, onAdjustPoints, setShowLevelEdit }) => {
    const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTransactions();
    }, [user.id]);

    const loadTransactions = async () => {
        try {
            const { data, error } = await supabase
                .from('points_transactions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(10);
            if (error) throw error;
            setTransactions(data || []);
        } catch (error) {
            console.error('加载积分记录失败:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fadeIn">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800">用户详情</h2>
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
                            <span className="material-icons text-gray-500">close</span>
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    {/* 用户信息卡片 */}
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
                        <img
                            src={user.avatar || ''}
                            alt={user.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                        />
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 text-lg">{user.name}</h3>
                            <p className="text-sm text-gray-500">{user.level}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-primary">{user.points}</p>
                            <p className="text-xs text-gray-500">积分</p>
                        </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={onAdjustPoints} className="btn btn-primary justify-center">
                            <span className="material-icons">edit</span>
                            调整积分
                        </button>
                        <button onClick={() => { onClose(); setShowLevelEdit(true); }} className="btn btn-secondary justify-center">
                            <span className="material-icons">workspace_premium</span>
                            修改等级
                        </button>
                    </div>

                    {/* 积分记录 */}
                    <div>
                        <h4 className="font-medium text-gray-800 mb-3">最近积分记录</h4>
                        {loading ? (
                            <div className="text-center py-4">
                                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                            </div>
                        ) : transactions.length === 0 ? (
                            <p className="text-center py-4 text-gray-500">暂无积分记录</p>
                        ) : (
                            <div className="space-y-2">
                                {transactions.map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{tx.description}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(tx.created_at).toLocaleString('zh-CN')}
                                            </p>
                                        </div>
                                        <span className={`font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                            {tx.amount > 0 ? '+' : ''}{tx.amount}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 其他信息 */}
                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                        <p>用户 ID: {user.id}</p>
                        <p>注册时间: {new Date(user.created_at).toLocaleString('zh-CN')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showPointsAdjust, setShowPointsAdjust] = useState(false);
    const [showLevelEdit, setShowLevelEdit] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('加载用户失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserClick = (user: User) => {
        setSelectedUser(user);
        setShowPointsAdjust(false);
    };

    const handleDetailClose = () => {
        setSelectedUser(null);
        setShowPointsAdjust(false);
        setShowLevelEdit(false);
    };

    const handleAdjustPoints = () => {
        setShowPointsAdjust(true);
    };

    const handlePointsSave = () => {
        setShowPointsAdjust(false);
        setSelectedUser(null);
        loadUsers();
    };

    const handleLevelSave = () => {
        setShowLevelEdit(false);
        setSelectedUser(null);
        loadUsers();
    };

    // 过滤用户
    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* 搜索栏 */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative w-full sm:w-64">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="搜索用户..."
                        className="input pl-10 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <p className="text-gray-600">共 {users.length} 个用户</p>
            </div>

            {/* 用户列表 - 桌面端表格 */}
            <div className="hidden md:block table-container">
                <table className="w-full">
                    <thead className="table-header">
                        <tr>
                            <th className="table-cell text-left">用户</th>
                            <th className="table-cell text-left">会员等级</th>
                            <th className="table-cell text-left">积分</th>
                            <th className="table-cell text-left">注册时间</th>
                            <th className="table-cell text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="table-row">
                                <td className="table-cell">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.avatar || ''}
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-800">{user.name}</p>
                                            <p className="text-xs text-gray-500 font-mono">{user.id.slice(0, 8)}...</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="table-cell">
                                    <span className="badge badge-info">{user.level}</span>
                                </td>
                                <td className="table-cell font-semibold text-primary">
                                    {user.points}
                                </td>
                                <td className="table-cell text-gray-600">
                                    {new Date(user.created_at).toLocaleDateString('zh-CN')}
                                </td>
                                <td className="table-cell text-right">
                                    <button
                                        onClick={() => handleUserClick(user)}
                                        className="btn btn-secondary !py-1.5 !px-3 text-sm"
                                    >
                                        查看详情
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">暂无用户</div>
                )}
            </div>

            {/* 用户列表 - 移动端卡片 */}
            <div className="md:hidden space-y-3">
                {filteredUsers.map((user) => (
                    <div
                        key={user.id}
                        className="card !p-4 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleUserClick(user)}
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={user.avatar || ''}
                                alt={user.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-gray-800">{user.name}</p>
                                    <span className="badge badge-info text-xs">{user.level}</span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    注册于 {new Date(user.created_at).toLocaleDateString('zh-CN')}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-primary">{user.points}</p>
                                <p className="text-xs text-gray-500">积分</p>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">暂无用户</div>
                )}
            </div>

            {/* 用户详情弹窗 */}
            {selectedUser && !showPointsAdjust && !showLevelEdit && (
                <UserDetail
                    user={selectedUser}
                    onClose={handleDetailClose}
                    onAdjustPoints={handleAdjustPoints}
                    setShowLevelEdit={setShowLevelEdit}
                />
            )}

            {/* 积分调整弹窗 */}
            {selectedUser && showPointsAdjust && (
                <PointsAdjust
                    user={selectedUser}
                    onClose={handleDetailClose}
                    onSave={handlePointsSave}
                />
            )}

            {/* 会员等级编辑弹窗 */}
            {selectedUser && showLevelEdit && (
                <LevelEdit
                    user={selectedUser}
                    onClose={handleDetailClose}
                    onSave={handleLevelSave}
                />
            )}
        </div>
    );
};

export default Users;
