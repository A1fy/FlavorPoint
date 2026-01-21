import React, { useState, useMemo } from 'react';
import { Screen, Product, CartItem } from '../types';
import { CATEGORIES } from '../data';

interface MenuProps {
  onNavigate: (screen: Screen) => void;
  cart: CartItem[];
  onAddToCart: (product: Product, size?: 'standard' | 'large') => void;
  onUpdateCartQuantity: (productId: string, size: 'standard' | 'large', delta: number) => void;
  onProductSelect: (product: Product) => void;
  favorites: string[];
  onToggleFavorite: (product: Product) => void;
  userPoints: number;
  products: Product[];
}

const Menu: React.FC<MenuProps> = ({ onNavigate, cart, onAddToCart, onUpdateCartQuantity, onProductSelect, favorites, onToggleFavorite, userPoints, products }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('hot');
  const [showMiniCart, setShowMiniCart] = useState(false);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'hot') {
      return products.filter(p => p.tagType === 'hot' || p.tagType === 'new');
    }
    return products.filter(p => p.category === selectedCategory);
  }, [selectedCategory, products]);

  const totalItems = cart.reduce((a, b) => a + b.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + (item.currentPrice * item.quantity), 0);

  // Helper to get total qty of a specific product regardless of size
  const getProductQty = (productId: string) => {
    return cart.filter(item => item.product.id === productId).reduce((acc, item) => acc + item.quantity, 0);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-100 font-display h-screen flex flex-col overflow-hidden selection:bg-primary/30 relative">
      <header className="flex-none bg-background-light dark:bg-background-dark z-20 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">美味菜单</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">积分商城</p>
          </div>
          <div className="flex items-center gap-2 bg-gold-bg dark:bg-yellow-900/20 px-3 py-1.5 rounded-full border border-[#E8D4A8] dark:border-yellow-700/30">
            <span className="material-symbols-outlined text-gold-accent text-lg filled">monetization_on</span>
            <span className="text-sm font-bold text-gray-800 dark:text-yellow-100">{userPoints}</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative z-10">
        <aside className="w-[88px] flex-none bg-white dark:bg-surface-dark overflow-y-auto no-scrollbar border-r border-gray-100 dark:border-gray-700 flex flex-col gap-2 py-4 pb-28">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`group flex flex-col items-center justify-center gap-1.5 p-2 mx-2 rounded-xl transition-all duration-200 ${selectedCategory === category.id ? 'bg-primary/10' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors ${selectedCategory === category.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-300 group-hover:text-primary'}`}>
                <span className="material-symbols-outlined text-[20px]">{category.icon}</span>
              </div>
              <span className={`text-[10px] font-bold text-center leading-tight ${selectedCategory === category.id ? 'text-primary' : 'text-gray-500 dark:text-gray-400 group-hover:text-primary'}`}>{category.name}</span>
            </button>
          ))}
        </aside>

        <main className="flex-1 overflow-y-auto pb-32 pt-2 px-4 scroll-smooth custom-scrollbar">
          <div className="sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm z-10 py-3 mb-2 flex items-end justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {CATEGORIES.find(c => c.id === selectedCategory)?.name || '推荐'}
            </h2>
            <span className="text-xs text-primary font-medium cursor-pointer">共 {filteredProducts.length} 款美味</span>
          </div>

          <div className="flex flex-col gap-4">
            {filteredProducts.map(product => {
              const totalQty = getProductQty(product.id);
              return (
                <div key={product.id} className={`group bg-white dark:bg-surface-dark rounded-2xl p-3 shadow-soft flex gap-3 items-stretch hover:shadow-lg transition-shadow duration-300 ${product.tagType === 'sold-out' ? 'opacity-60' : ''}`}>
                  <div
                    onClick={() => {
                      onProductSelect(product);
                      onNavigate(Screen.ProductDetail);
                    }}
                    className="w-24 h-24 flex-none bg-gray-100 rounded-xl bg-center bg-cover relative overflow-hidden cursor-pointer"
                    style={{ backgroundImage: `url("${product.image}")` }}
                  >
                    {product.tagType === 'sold-out' && (
                      <div className="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center">
                        <span className="bg-black/70 text-white text-[10px] px-2 py-1 rounded-full font-bold">已售罄</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 justify-between py-0.5">
                    <div onClick={() => { onProductSelect(product); onNavigate(Screen.ProductDetail); }} className="cursor-pointer">
                      <h3 className="font-bold text-gray-900 dark:text-white leading-tight mb-1">{product.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{product.description}</p>
                    </div>
                    <div className="flex items-end justify-between mt-2">
                      <span className="text-gold-accent font-bold text-sm">{product.price} <span className="text-[10px] font-normal text-gray-400">积分起</span></span>

                      {product.tagType !== 'sold-out' ? (
                        totalQty > 0 ? (
                          <div className="flex items-center gap-2">
                            {/* Note: In Menu list, we just show Add because removing requires size selection logic which is complex for a list view. User can click image to edit details */}
                            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-md">已选 {totalQty}</span>
                            <button onClick={() => onAddToCart(product)} className="w-8 h-8 rounded-full bg-primary text-white shadow-sm flex items-center justify-center active:scale-95 transition-transform">
                              <span className="material-symbols-outlined text-[20px]">add</span>
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => onAddToCart(product)} className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md active:scale-95 transition-transform hover:bg-primary-dark">
                            <span className="material-symbols-outlined text-[20px]">add</span>
                          </button>
                        )
                      ) : (
                        <button className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-400 flex items-center justify-center cursor-not-allowed" disabled>
                          <span className="material-symbols-outlined text-[20px]">add</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="h-6"></div>
          </div>
        </main>
      </div>

      {/* Mini Cart Modal Overlay - Fixed Z-60 to sit above BottomNav (Z-50) */}
      {showMiniCart && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex flex-col justify-end" onClick={() => setShowMiniCart(false)}>
          <div className="bg-white dark:bg-surface-dark rounded-t-2xl shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease-out] mb-20 mx-3 max-h-[60vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0">
              <h3 className="font-bold text-sm text-gray-500">已选商品</h3>
              <button className="text-xs text-gray-400 flex items-center gap-1" onClick={() => { /* clear cart logic could go here */ }}>
                <span className="material-symbols-outlined text-[14px]">delete</span>
                清空
              </button>
            </div>
            <div className="overflow-y-auto p-4 space-y-4">
              {cart.map((item, idx) => (
                <div key={`${item.product.id}-${item.size}-${idx}`} className="flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white">{item.product.name}</h4>
                    <p className="text-xs text-gray-500">{item.size === 'standard' ? '标准份' : '大份'} · {item.currentPrice} 积分</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => onUpdateCartQuantity(item.product.id, item.size, -1)} className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-500">
                      <span className="material-symbols-outlined text-[14px]">remove</span>
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => onUpdateCartQuantity(item.product.id, item.size, 1)} className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">add</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cart Summary Bar - Floats above the Bottom Navigation */}
      {totalItems > 0 && (
        <div className="fixed bottom-24 left-0 w-full p-4 z-[40] pointer-events-none">
          <div className="pointer-events-auto max-w-md mx-auto bg-surface-light dark:bg-surface-dark rounded-2xl p-4 shadow-float border border-gray-100 dark:border-gray-700 flex items-center justify-between gap-4 ring-1 ring-black/5">
            <div className="flex items-center gap-3" onClick={() => setShowMiniCart(!showMiniCart)}>
              <div className="relative cursor-pointer transition-transform active:scale-95">
                <div className="w-12 h-12 bg-background-light dark:bg-gray-800 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-600">
                  <span className="material-symbols-outlined text-primary text-2xl filled">shopping_bag</span>
                </div>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white dark:ring-surface-dark">{totalItems}</span>
              </div>
              <div className="flex flex-col cursor-pointer" onClick={() => setShowMiniCart(!showMiniCart)}>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">已选 {totalItems} 件</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-gray-900 dark:text-white">总计：</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{totalPrice}</span>
                  <span className="text-xs font-medium text-gray-400 mb-0.5">积分</span>
                </div>
              </div>
            </div>
            <button onClick={() => onNavigate(Screen.Cart)} className="bg-primary hover:bg-primary-dark text-white font-bold text-sm py-3 px-6 rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-95 flex items-center gap-2">
              <span>去结算</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;