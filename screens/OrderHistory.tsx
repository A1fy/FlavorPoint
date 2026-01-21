import React, { useState, useMemo } from 'react';
import { Screen, Order, CartItem } from '../types';

interface OrderHistoryProps {
    onNavigate: (screen: Screen) => void;
    orders: Order[];
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ onNavigate, orders }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'placed' | 'completed'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return orders;
    return orders.filter(o => o.status === activeTab);
  }, [activeTab, orders]);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-gray-100 transition-colors duration-200 antialiased selection:bg-primary selection:text-white pb-32 min-h-screen relative">
      <div className="sticky top-0 z-40 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 transition-colors">
        <div className="flex items-center justify-between px-4 h-16 max-w-md mx-auto w-full">
          <button onClick={() => onNavigate(Screen.Home)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
            <span className="material-symbols-outlined text-gray-600 dark:text-gray-300 group-hover:text-primary">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold tracking-tight text-center flex-1 pr-8">点餐记录</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto w-full overflow-hidden pt-4 pb-2">
        <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar pb-2">
          <button 
            onClick={() => setActiveTab('all')}
            className={`flex h-9 shrink-0 items-center justify-center rounded-full px-5 transition-transform active:scale-95 ${activeTab === 'all' ? 'bg-primary shadow-lg shadow-primary/20 text-white' : 'bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
          >
            <p className="text-sm font-semibold">全部</p>
          </button>
          <button 
            onClick={() => setActiveTab('placed')}
            className={`flex h-9 shrink-0 items-center justify-center rounded-full px-5 transition-transform active:scale-95 ${activeTab === 'placed' ? 'bg-primary shadow-lg shadow-primary/20 text-white' : 'bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
          >
            <p className="text-sm font-medium">已下单</p>
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`flex h-9 shrink-0 items-center justify-center rounded-full px-5 transition-transform active:scale-95 ${activeTab === 'completed' ? 'bg-primary shadow-lg shadow-primary/20 text-white' : 'bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
          >
            <p className="text-sm font-medium">已完成</p>
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto w-full px-4 flex flex-col gap-5 py-4">
        {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <span className="material-symbols-outlined text-4xl mb-2">receipt_long</span>
                <p>暂无订单</p>
            </div>
        ) : (
            filteredOrders.map(order => (
                <div key={order.id} className="group relative bg-surface-light dark:bg-surface-dark rounded-2xl p-4 shadow-soft hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                            {order.status === 'placed' ? (
                                <>
                                    <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                                    <span className="text-primary text-xs font-bold uppercase tracking-wider">已下单</span>
                                </>
                            ) : (
                                <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">已完成</span>
                            )}
                        </div>
                        <span className="text-gray-400 dark:text-gray-500 text-xs font-medium">{order.date}</span>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="w-20 h-20 shrink-0 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative shadow-inner-light">
                            <div 
                                className="absolute inset-0 bg-cover bg-center" 
                                style={{backgroundImage: `url("${order.items[0].product.image}")`}}
                            ></div>
                        </div>
                        <div className="flex flex-col justify-between flex-1 py-0.5">
                            <div>
                                <h3 className="text-gray-900 dark:text-white text-base font-bold leading-tight mb-1">{order.items[0].product.name}</h3>
                                {order.items.length > 1 && (
                                    <p className="text-gray-500 dark:text-gray-400 text-xs">等 {order.items.reduce((acc, item) => acc + item.quantity, 0)} 件商品</p>
                                )}
                            </div>
                            <div className="flex items-end justify-between mt-2">
                                <div className="flex items-center gap-1 text-[#d97706] dark:text-amber-400">
                                    <span className="material-symbols-outlined text-[18px]">monetization_on</span>
                                    <span className="text-sm font-bold">{order.totalPrice} 积分</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50 flex justify-end gap-2">
                         <button 
                            onClick={() => setSelectedOrder(order)}
                            className="flex items-center justify-center gap-1.5 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-xs font-semibold h-8 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            查看详情
                        </button>
                        {order.status === 'completed' && (
                            <button className="flex items-center justify-center gap-1.5 bg-primary text-white text-xs font-semibold h-8 px-4 rounded-lg hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-[16px]">replay</span>
                                再来一单
                            </button>
                        )}
                    </div>
                </div>
            ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
              <div className="bg-white dark:bg-surface-dark w-full max-w-sm rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-[scale_0.2s_ease-out]">
                  <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                      <h3 className="text-lg font-bold">订单详情</h3>
                      <button onClick={() => setSelectedOrder(null)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                          <span className="material-symbols-outlined">close</span>
                      </button>
                  </div>
                  <div className="p-5 max-h-[60vh] overflow-y-auto">
                      <div className="space-y-4">
                          {selectedOrder.items.map((item, idx) => (
                              <div key={idx} className="flex gap-3">
                                  <div className="w-16 h-16 rounded-lg bg-gray-100 bg-cover bg-center shrink-0" style={{backgroundImage: `url("${item.product.image}")`}}></div>
                                  <div className="flex-1">
                                      <div className="flex justify-between items-start">
                                          <h4 className="font-bold text-sm text-gray-900 dark:text-white">{item.product.name}</h4>
                                          <span className="font-bold text-sm text-gray-900 dark:text-white">x{item.quantity}</span>
                                      </div>
                                      <p className="text-xs text-primary font-bold mt-1">{item.currentPrice * item.quantity} 积分</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                      <div className="mt-6 pt-4 border-t border-dashed border-gray-200 dark:border-gray-700 flex justify-between items-center">
                          <span className="text-sm font-bold text-gray-500">总计</span>
                          <span className="text-xl font-bold text-primary">{selectedOrder.totalPrice} 积分</span>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default OrderHistory;