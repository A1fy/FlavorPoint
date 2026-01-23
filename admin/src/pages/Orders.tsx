/**
 * 订单管理页面
 * 支持订单查看和状态更新
 */
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/types';

// 订单详情弹窗
interface OrderDetailProps {
    order: Order;
    onClose: () => void;
    onStatusChange: () => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order, onClose, onStatusChange }) => {
    const [updating, setUpdating] = useState(false);

    const handleStatusChange = async (status: 'placed' | 'completed') => {
        setUpdating(true);
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status })
                .eq('id', order.id);
            if (error) throw error;
            onStatusChange();
        } catch (error) {
            console.error('更新订单状态失败:', error);
            alert('更新失败，请重试');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fadeIn">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800">订单详情</h2>
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
                            <span className="material-icons text-gray-500">close</span>
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    {/* 订单信息 */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-gray-500">订单号：</span>
                                <span className="font-mono text-gray-800">{order.id.slice(0, 8)}...</span>
                            </div>
                            <div>
                                <span className="text-gray-500">状态：</span>
                                <span className={`badge ml-1 ${order.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                                    {order.status === 'completed' ? '已完成' : '待处理'}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500">下单时间：</span>
                                <span className="text-gray-800">{new Date(order.created_at).toLocaleString('zh-CN')}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">用户ID：</span>
                                <span className="font-mono text-gray-800">{order.user_id.slice(0, 8)}...</span>
                            </div>
                        </div>
                    </div>

                    {/* 订单项 */}
                    <div>
                        <h4 className="font-medium text-gray-800 mb-3">订单商品</h4>
                        <div className="space-y-2">
                            {(order.order_items || []).map((item) => (
                                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <img
                                        src={item.product_image || ''}
                                        alt={item.product_name || ''}
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{item.product_name}</p>
                                        <p className="text-sm text-gray-500">
                                            {item.size === 'large' ? '大份' : '标准'} × {item.quantity}
                                        </p>
                                    </div>
                                    <span className="font-medium text-gray-800">¥{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 价格明细 */}
                    <div className="border-t border-gray-100 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">商品总价</span>
                            <span className="text-gray-800">¥{order.total_price}</span>
                        </div>
                        {order.discount_amount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">优惠金额</span>
                                <span className="text-green-600">-¥{order.discount_amount}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-100">
                            <span className="text-gray-800">实付金额</span>
                            <span className="text-primary">¥{order.final_price}</span>
                        </div>
                    </div>

                    {/* 操作按钮 */}
                    {order.status === 'placed' && (
                        <div className="pt-4">
                            <button
                                onClick={() => handleStatusChange('completed')}
                                disabled={updating}
                                className="btn btn-primary w-full justify-center"
                            >
                                <span className="material-icons">check_circle</span>
                                {updating ? '处理中...' : '标记为已完成'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Orders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*, order_items(*)')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('加载订单失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDetailClose = () => {
        setSelectedOrder(null);
    };

    const handleStatusChange = () => {
        handleDetailClose();
        loadOrders();
    };

    // 过滤订单
    const filteredOrders = orders.filter((o) => {
        if (!filterStatus) return true;
        return o.status === filterStatus;
    });

    // 统计数据
    const pendingCount = orders.filter((o) => o.status === 'placed').length;
    const completedCount = orders.filter((o) => o.status === 'completed').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* 统计卡片 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="card !p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStatus('')}>
                    <p className="text-sm text-gray-500">全部订单</p>
                    <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
                </div>
                <div className="card !p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStatus('placed')}>
                    <p className="text-sm text-gray-500">待处理</p>
                    <p className="text-2xl font-bold text-orange-500">{pendingCount}</p>
                </div>
                <div className="card !p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStatus('completed')}>
                    <p className="text-sm text-gray-500">已完成</p>
                    <p className="text-2xl font-bold text-green-500">{completedCount}</p>
                </div>
                <div className="card !p-4">
                    <p className="text-sm text-gray-500">总收入</p>
                    <p className="text-2xl font-bold text-primary">
                        ¥{orders.reduce((acc, o) => acc + o.final_price, 0)}
                    </p>
                </div>
            </div>

            {/* 筛选栏 */}
            <div className="flex gap-2">
                {[
                    { value: '', label: '全部' },
                    { value: 'placed', label: '待处理' },
                    { value: 'completed', label: '已完成' },
                ].map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => setFilterStatus(opt.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === opt.value
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* 订单列表 - 桌面端表格 */}
            <div className="hidden md:block table-container">
                <table className="w-full">
                    <thead className="table-header">
                        <tr>
                            <th className="table-cell text-left">订单号</th>
                            <th className="table-cell text-left">下单时间</th>
                            <th className="table-cell text-left">商品数</th>
                            <th className="table-cell text-left">金额</th>
                            <th className="table-cell text-left">状态</th>
                            <th className="table-cell text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="table-row">
                                <td className="table-cell font-mono text-gray-800">
                                    #{order.id.slice(0, 8)}
                                </td>
                                <td className="table-cell text-gray-600">
                                    {new Date(order.created_at).toLocaleString('zh-CN')}
                                </td>
                                <td className="table-cell">
                                    {(order.order_items || []).reduce((acc, item) => acc + item.quantity, 0)} 件
                                </td>
                                <td className="table-cell font-medium text-gray-800">
                                    ¥{order.final_price}
                                </td>
                                <td className="table-cell">
                                    <span className={`badge ${order.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                                        {order.status === 'completed' ? '已完成' : '待处理'}
                                    </span>
                                </td>
                                <td className="table-cell text-right">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="btn btn-secondary !py-1.5 !px-3 text-sm"
                                    >
                                        查看详情
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredOrders.length === 0 && (
                    <div className="text-center py-8 text-gray-500">暂无订单</div>
                )}
            </div>

            {/* 订单列表 - 移动端卡片 */}
            <div className="md:hidden space-y-3">
                {filteredOrders.map((order) => (
                    <div
                        key={order.id}
                        className="card !p-4 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedOrder(order)}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <p className="font-mono font-medium text-gray-800">#{order.id.slice(0, 8)}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(order.created_at).toLocaleString('zh-CN')}
                                </p>
                            </div>
                            <span className={`badge ${order.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                                {order.status === 'completed' ? '已完成' : '待处理'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                {(order.order_items || []).reduce((acc, item) => acc + item.quantity, 0)} 件商品
                            </span>
                            <span className="font-semibold text-primary">¥{order.final_price}</span>
                        </div>
                    </div>
                ))}
                {filteredOrders.length === 0 && (
                    <div className="text-center py-8 text-gray-500">暂无订单</div>
                )}
            </div>

            {/* 订单详情弹窗 */}
            {selectedOrder && (
                <OrderDetail
                    order={selectedOrder}
                    onClose={handleDetailClose}
                    onStatusChange={handleStatusChange}
                />
            )}
        </div>
    );
};

export default Orders;
