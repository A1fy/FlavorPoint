import React, { useState } from 'react';
import { Screen, Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onNavigate: (screen: Screen) => void;
  onAddToCart: (product: Product, size: 'standard' | 'large') => void;
  cartQuantity: number;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
  backScreen?: Screen;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onNavigate, onAddToCart, cartQuantity, isFavorite, onToggleFavorite, backScreen }) => {
  const [selectedSize, setSelectedSize] = useState<'standard' | 'large'>('standard');

  const currentPrice = selectedSize === 'large' ? product.price + 200 : product.price;

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col relative pb-safe">
      {/* Header Image Area */}
      <div className="relative w-full h-[45vh] bg-gray-200">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${product.image}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background-light dark:to-background-dark" />
        
        <button 
          onClick={() => onNavigate(backScreen || Screen.Home)}
          className="absolute top-6 left-5 size-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors z-20"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        
        <button 
            onClick={() => onToggleFavorite(product)}
            className="absolute top-6 right-5 size-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors z-20"
        >
          <span className={`material-symbols-outlined ${isFavorite ? 'filled text-red-500' : ''}`}>favorite</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 -mt-10 relative z-10">
        <div className="flex items-center justify-between mb-2">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                {product.category === 'hot' ? '热门推荐' : product.category === 'main' ? '招牌主食' : '美味餐点'}
            </span>
            <div className="flex items-center gap-1 text-amber-500">
                <span className="material-symbols-outlined filled text-[18px]">star</span>
                <span className="text-sm font-bold">{product.rating || 4.5}</span>
                <span className="text-xs text-gray-400">(128条评价)</span>
            </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">{product.name}</h1>
        
        <div className="flex items-center gap-4 mb-6">
            <div className="flex items-end gap-1">
                <span className="text-3xl font-extrabold text-primary animate-[pulse_0.3s_ease-in-out]" key={currentPrice}>{currentPrice}</span>
                <span className="text-sm font-bold text-gray-400 mb-1.5">积分</span>
            </div>
            {product.calories && (
                <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                    <span>{selectedSize === 'large' ? Math.round(product.calories * 1.2) : product.calories} kcal</span>
                </div>
            )}
        </div>

        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm mb-6">
            {product.description}
        </p>

        <div className="mb-8">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">规格选择</h3>
            <div className="flex flex-wrap gap-3">
                <button 
                    onClick={() => setSelectedSize('standard')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all ${selectedSize === 'standard' ? 'bg-primary text-white shadow-primary/20 ring-2 ring-primary/50' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                    标准份
                </button>
                <button 
                    onClick={() => setSelectedSize('large')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all ${selectedSize === 'large' ? 'bg-primary text-white shadow-primary/20 ring-2 ring-primary/50' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                    大份 (+200积分)
                </button>
            </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="sticky bottom-0 left-0 right-0 p-5 bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-700/50 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-20 pb-safe">
        <div className="flex items-center gap-4">
            <div className="flex flex-col items-center px-2">
                <span className="text-xs text-gray-400 font-medium">购物车</span>
                <div className="relative">
                    <span className="material-symbols-outlined text-gray-800 dark:text-white text-2xl">shopping_cart</span>
                    {cartQuantity > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white dark:border-surface-dark">
                            {cartQuantity}
                        </span>
                    )}
                </div>
            </div>
            <button 
                onClick={() => onAddToCart(product, selectedSize)}
                className="flex-1 h-12 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-primary/30 active:scale-95 transition-all"
            >
                <span className="material-symbols-outlined">add</span>
                加入购物车 - {selectedSize === 'standard' ? '标准' : '大份'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;