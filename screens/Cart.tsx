import React, { useState } from 'react';
import { Screen, Product, CartItem, Coupon } from '../types';

interface CartProps {
    onNavigate: (screen: Screen) => void;
    cart: CartItem[];
    onAddToCart: (product: Product, size: 'standard' | 'large') => void;
    onUpdateCartQuantity: (productId: string, size: 'standard' | 'large', delta: number) => void;
    userPoints: number;
    myCoupons: Coupon[];
    onCheckout: (finalPrice: number, coupon?: Coupon) => void;
}

const Cart: React.FC<CartProps> = ({ onNavigate, cart, onAddToCart, onUpdateCartQuantity, userPoints, myCoupons, onCheckout }) => {
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
  const [showCouponModal, setShowCouponModal] = useState(false);

  const totalPrice = cart.reduce((total, item) => total + (item.currentPrice * item.quantity), 0);
  
  const selectedCoupon = myCoupons.find(c => c.id === selectedCouponId);
  
  // Calculate Discount
  let discountAmount = 0;
  if (selectedCoupon) {
      if (selectedCoupon.type === 'deduction') {
          // Check min spend
          if (!selectedCoupon.minSpend || totalPrice >= selectedCoupon.minSpend) {
              discountAmount = selectedCoupon.amount;
          }
      } else if (selectedCoupon.type === 'discount') {
           discountAmount = Math.round(totalPrice * (1 - selectedCoupon.amount));
      }
  }
  
  const finalPrice = Math.max(0, totalPrice - discountAmount);
  const canAfford = userPoints >= finalPrice;

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 font-display min-h-screen flex flex-col pb-safe">
      <div className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <button onClick={() => onNavigate(Screen.Menu)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span className="material-symbols-outlined text-slate-800 dark:text-slate-100">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold tracking-tight">购物车结算</h1>
        <button className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
          管理
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-40">
        <div className="px-4 mt-4 mb-2">
            <div className="relative overflow-hidden bg-gray-900 dark:bg-gray-800 rounded-2xl p-5 text-white shadow-soft">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
            <div className="relative z-10 flex justify-between items-end">
                <div>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">当前可用积分</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{userPoints}</span>
                    <span className="text-sm font-medium text-gray-400">分</span>
                </div>
                </div>
                <div className={`flex items-center gap-1 backdrop-blur-sm px-3 py-1.5 rounded-lg border ${canAfford ? 'bg-white/10 border-white/10' : 'bg-red-500/20 border-red-500/30'}`}>
                <span className={`material-symbols-outlined text-[18px] ${canAfford ? 'text-primary' : 'text-red-400'}`}>{canAfford ? 'verified' : 'error'}</span>
                <span className={`text-xs font-medium ${canAfford ? 'text-white' : 'text-red-200'}`}>{canAfford ? '积分充足' : '积分不足'}</span>
                </div>
            </div>
            </div>
        </div>

        <div className="flex flex-col gap-4 px-4 py-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">订单清单</h2>
            
            {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 opacity-50">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-2">remove_shopping_cart</span>
                    <p className="text-sm font-medium">购物车是空的</p>
                    <button onClick={() => onNavigate(Screen.Menu)} className="mt-4 text-primary font-bold text-sm">去逛逛</button>
                </div>
            ) : (
                cart.map((item, idx) => (
                    <div key={`${item.product.id}-${item.size}-${idx}`} className="group relative flex gap-4 p-3 bg-card-light dark:bg-surface-dark rounded-2xl shadow-sm border border-transparent hover:border-primary/20 transition-all">
                    <div className="shrink-0 relative">
                        <div 
                            className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-700 bg-cover bg-center" 
                            style={{backgroundImage: `url("${item.product.image}")`}}
                        >
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 justify-between py-0.5">
                        <div>
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-base line-clamp-1 pr-4">{item.product.name}</h3>
                            <button onClick={() => onUpdateCartQuantity(item.product.id, item.size, -100)} className="text-gray-300 hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                            {item.size === 'standard' ? '标准份' : '大份'} 
                            {item.product.description && ` · ${item.product.description.substring(0, 10)}...`}
                        </p>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                        <div className="flex items-center gap-1 text-primary font-bold">
                            <span className="material-symbols-outlined text-[18px]">stars</span>
                            <span>{item.currentPrice * item.quantity}</span>
                        </div>
                        <div className="flex items-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-1 border border-gray-100 dark:border-gray-600">
                            <button onClick={() => onUpdateCartQuantity(item.product.id, item.size, -1)} className="w-7 h-7 flex items-center justify-center rounded-md bg-white dark:bg-gray-600 shadow-sm text-gray-600 dark:text-gray-200 hover:text-primary disabled:opacity-50 transition-colors">
                            <span className="material-symbols-outlined text-[16px]">remove</span>
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                            <button onClick={() => onUpdateCartQuantity(item.product.id, item.size, 1)} className="w-7 h-7 flex items-center justify-center rounded-md bg-primary text-white shadow-sm shadow-primary/30 hover:bg-primary-dark transition-colors">
                            <span className="material-symbols-outlined text-[16px]">add</span>
                            </button>
                        </div>
                        </div>
                    </div>
                    </div>
                ))
            )}
        </div>

        {/* Coupon Selector */}
        {cart.length > 0 && (
            <div className="px-4 py-2">
                <button 
                    onClick={() => setShowCouponModal(true)}
                    className="w-full flex justify-between items-center p-4 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                >
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-orange-500">confirmation_number</span>
                        <span className="font-bold text-sm">优惠券</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {selectedCoupon ? (
                            <span className="text-primary font-bold text-sm">
                                {selectedCoupon.type === 'deduction' ? `-${selectedCoupon.amount}积分` : `享${selectedCoupon.amount*10}折`}
                            </span>
                        ) : (
                            <span className="text-gray-400 text-sm">{myCoupons.length > 0 ? `${myCoupons.length} 张可用` : '无可用优惠券'}</span>
                        )}
                        <span className="material-symbols-outlined text-gray-400 text-sm">chevron_right</span>
                    </div>
                </button>
            </div>
        )}

        <div className="px-6 py-4 bg-background-light dark:bg-background-dark border-t border-dashed border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-gray-500">商品小计</span>
            <span className="font-medium">{totalPrice} 积分</span>
            </div>
            {discountAmount > 0 && (
                <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-500">优惠券折扣</span>
                <span className="font-medium text-primary">-{discountAmount} 积分</span>
                </div>
            )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pb-safe z-40">
        <div className="p-4 max-w-md mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-col">
                <span className="text-xs text-gray-400">实付积分</span>
                <div className="flex items-center gap-1">
                <span className={`text-2xl font-bold ${canAfford ? 'text-red-500' : 'text-gray-400'}`}>{finalPrice}</span>
                <span className="text-sm font-bold text-primary">分</span>
                </div>
            </div>
            <button 
                onClick={() => canAfford && cart.length > 0 ? onCheckout(finalPrice, selectedCoupon || undefined) : null}
                disabled={!canAfford || cart.length === 0}
                className={`flex-1 rounded-full h-12 font-bold text-base flex items-center justify-center gap-2 shadow-lg transition-all ${canAfford && cart.length > 0 ? 'bg-primary hover:bg-primary-dark text-white shadow-primary/30 active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
                <span>{cart.length === 0 ? '请选购' : canAfford ? '立即兑换' : '积分不足'}</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
        </div>
      </div>

      {/* Coupon Modal */}
      {showCouponModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCouponModal(false)}></div>
              <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 relative z-10 max-h-[80vh] overflow-hidden flex flex-col">
                  <div className="flex justify-between items-center mb-4 shrink-0">
                      <h3 className="font-bold text-lg">选择优惠券</h3>
                      <button onClick={() => setShowCouponModal(false)}><span className="material-symbols-outlined">close</span></button>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-3 pb-4">
                      {myCoupons.length === 0 && <p className="text-center text-gray-400 py-10">暂无可用优惠券</p>}
                      {myCoupons.map(coupon => {
                          const disabled = coupon.minSpend && totalPrice < coupon.minSpend;
                          return (
                            <div 
                                key={coupon.id} 
                                onClick={() => {
                                    if (!disabled) {
                                        setSelectedCouponId(selectedCouponId === coupon.id ? null : coupon.id);
                                        setShowCouponModal(false);
                                    }
                                }}
                                className={`rounded-xl p-4 border-l-4 relative cursor-pointer transition-all ${
                                    selectedCouponId === coupon.id 
                                        ? 'bg-primary/5 border-primary ring-1 ring-primary' 
                                        : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                                } ${disabled ? 'opacity-50 grayscale' : ''}`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold">{coupon.title}</h4>
                                        <p className="text-xs text-gray-500">{coupon.description}</p>
                                    </div>
                                    <div className="text-primary font-bold">
                                        {coupon.type === 'deduction' ? `-${coupon.amount}` : `${coupon.amount * 10}折`}
                                    </div>
                                </div>
                                {disabled && <p className="text-[10px] text-red-400 mt-1">未满足使用条件</p>}
                                {selectedCouponId === coupon.id && (
                                    <div className="absolute top-2 right-2 text-primary"><span className="material-symbols-outlined filled">check_circle</span></div>
                                )}
                            </div>
                          );
                      })}
                  </div>
                  <button 
                    onClick={() => { setSelectedCouponId(null); setShowCouponModal(false); }}
                    className="w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 font-bold shrink-0"
                  >
                      不使用优惠券
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default Cart;