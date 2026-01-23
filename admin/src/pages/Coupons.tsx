/**
 * 优惠券管理页面
 * 支持优惠券的 CRUD 操作和使用情况查看
 */
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Coupon, UserCoupon } from '@/types';

// 优惠券表单弹窗
interface CouponFormProps {
    coupon: Coupon | null;
    onClose: () => void;
    onSave: () => void;
}

const CouponForm: React.FC<CouponFormProps> = ({ coupon, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: coupon?.title || '',
        amount: coupon?.amount || 0,
        type: coupon?.type || 'deduction',
        min_spend: coupon?.min_spend || 0,
        description: coupon?.description || '',
        is_active: coupon?.is_active ?? true,
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (coupon) {
                const { error } = await supabase
                    .from('coupons')
                    .update(formData)
                    .eq('id', coupon.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('coupons').insert(formData);
                if (error) throw error;
            }
            onSave();
        } catch (error) {
            console.error('保存优惠券失败:', error);
            alert('保存失败，请重试');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-fadeIn">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {coupon ? '编辑优惠券' : '新增优惠券'}
                        </h2>
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
                            <span className="material-icons text-gray-500">close</span>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* 优惠券名称 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">优惠券名称 *</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="如: 新人专享"
                            required
                        />
                    </div>

                    {/* 优惠类型 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">优惠类型 *</label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'deduction' })}
                                className={`flex-1 py-2 rounded-lg font-medium transition-all ${formData.type === 'deduction'
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                积分抵扣
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'discount' })}
                                className={`flex-1 py-2 rounded-lg font-medium transition-all ${formData.type === 'discount'
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                折扣优惠
                            </button>
                        </div>
                    </div>

                    {/* 优惠金额/折扣 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {formData.type === 'deduction' ? '抵扣积分 *' : '折扣比例 *'}
                        </label>
                        <input
                            type="number"
                            className="input"
                            value={formData.amount || ''}
                            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                            placeholder={formData.type === 'deduction' ? '如: 50' : '如: 0.8 表示8折'}
                            step={formData.type === 'discount' ? '0.01' : '1'}
                            min="0"
                            max={formData.type === 'discount' ? '1' : undefined}
                            required
                        />
                        {formData.type === 'discount' && (
                            <p className="text-xs text-gray-500 mt-1">请输入 0-1 之间的数字，如 0.8 表示 8 折</p>
                        )}
                    </div>

                    {/* 最低消费 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">最低消费积分</label>
                        <input
                            type="number"
                            className="input"
                            value={formData.min_spend || ''}
                            onChange={(e) => setFormData({ ...formData, min_spend: Number(e.target.value) })}
                            placeholder="0 表示无门槛"
                            min="0"
                        />
                    </div>

                    {/* 描述 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">优惠券描述</label>
                        <textarea
                            className="input min-h-[60px] resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="使用说明..."
                        />
                    </div>

                    {/* 是否启用 */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="w-4 h-4 text-primary rounded"
                        />
                        <label htmlFor="is_active" className="text-sm text-gray-700">
                            启用优惠券（用户可见并可领取）
                        </label>
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

const Coupons: React.FC = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [{ data: couponsData }, { data: userCouponsData }] = await Promise.all([
                supabase.from('coupons').select('*').order('created_at', { ascending: false }),
                supabase.from('user_coupons').select('*'),
            ]);
            setCoupons(couponsData || []);
            setUserCoupons(userCouponsData || []);
        } catch (error) {
            console.error('加载优惠券数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('确定要删除这个优惠券吗？已领取的用户将失去该优惠券。')) return;

        try {
            const { error } = await supabase.from('coupons').delete().eq('id', id);
            if (error) throw error;
            loadData();
        } catch (error) {
            console.error('删除优惠券失败:', error);
            alert('删除失败，请重试');
        }
    };

    const handleToggleActive = async (coupon: Coupon) => {
        try {
            const { error } = await supabase
                .from('coupons')
                .update({ is_active: !coupon.is_active })
                .eq('id', coupon.id);
            if (error) throw error;
            loadData();
        } catch (error) {
            console.error('更新优惠券状态失败:', error);
            alert('操作失败，请重试');
        }
    };

    const handleEdit = (coupon: Coupon) => {
        setEditingCoupon(coupon);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingCoupon(null);
    };

    const handleFormSave = () => {
        handleFormClose();
        loadData();
    };

    // 获取优惠券使用统计
    const getCouponStats = (couponId: string) => {
        const claimed = userCoupons.filter((uc) => uc.coupon_id === couponId);
        const used = claimed.filter((uc) => uc.is_used);
        return { claimed: claimed.length, used: used.length };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* 操作栏 */}
            <div className="flex justify-between items-center">
                <p className="text-gray-600">共 {coupons.length} 个优惠券</p>
                <button onClick={() => setShowForm(true)} className="btn btn-primary">
                    <span className="material-icons">add</span>
                    新增优惠券
                </button>
            </div>

            {/* 优惠券列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coupons.map((coupon) => {
                    const stats = getCouponStats(coupon.id);
                    return (
                        <div
                            key={coupon.id}
                            className={`card !p-0 overflow-hidden transition-all ${!coupon.is_active ? 'opacity-60' : ''
                                }`}
                        >
                            {/* 优惠券头部 */}
                            <div className={`p-4 ${coupon.type === 'deduction'
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-400'
                                    : 'bg-gradient-to-r from-purple-500 to-purple-400'
                                }`}>
                                <div className="flex items-start justify-between">
                                    <div className="text-white">
                                        <p className="text-2xl font-bold">
                                            {coupon.type === 'deduction' ? `${coupon.amount}积分` : `${coupon.amount * 10}折`}
                                        </p>
                                        <p className="text-sm opacity-90">
                                            {coupon.min_spend > 0 ? `满${coupon.min_spend}可用` : '无门槛'}
                                        </p>
                                    </div>
                                    {!coupon.is_active && (
                                        <span className="badge bg-white/20 text-white">已停用</span>
                                    )}
                                </div>
                            </div>

                            {/* 优惠券信息 */}
                            <div className="p-4">
                                <h4 className="font-semibold text-gray-800 mb-1">{coupon.title}</h4>
                                <p className="text-sm text-gray-500 mb-3">{coupon.description || '暂无描述'}</p>

                                {/* 使用统计 */}
                                <div className="flex gap-4 text-sm text-gray-600 mb-3 pb-3 border-b border-gray-100">
                                    <span>已领取 {stats.claimed}</span>
                                    <span>已使用 {stats.used}</span>
                                </div>

                                {/* 操作按钮 */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleToggleActive(coupon)}
                                        className={`btn flex-1 justify-center ${coupon.is_active ? 'btn-secondary' : 'btn-primary'
                                            }`}
                                    >
                                        {coupon.is_active ? '停用' : '启用'}
                                    </button>
                                    <button
                                        onClick={() => handleEdit(coupon)}
                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                        title="编辑"
                                    >
                                        <span className="material-icons text-gray-500">edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(coupon.id)}
                                        className="p-2 hover:bg-red-50 rounded-lg"
                                        title="删除"
                                    >
                                        <span className="material-icons text-red-500">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {coupons.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    暂无优惠券，点击上方按钮添加
                </div>
            )}

            {/* 优惠券表单弹窗 */}
            {showForm && (
                <CouponForm
                    coupon={editingCoupon}
                    onClose={handleFormClose}
                    onSave={handleFormSave}
                />
            )}
        </div>
    );
};

export default Coupons;
