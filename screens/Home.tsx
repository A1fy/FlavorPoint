import React from 'react';
import { Screen, Product, UserProfile } from '../types';

interface HomeProps {
  onNavigate: (screen: Screen) => void;
  onProductSelect: (product: Product) => void;
  favorites: string[];
  onToggleFavorite: (product: Product) => void;
  userProfile: UserProfile;
  products: Product[];
}

const Home: React.FC<HomeProps> = ({ onNavigate, onProductSelect, favorites, onToggleFavorite, userProfile, products }) => {
  const handleProductClick = (product: Product) => {
    onProductSelect(product);
    onNavigate(Screen.ProductDetail);
  };

  const hotProducts = products.filter(p => p.tagType === 'hot' || p.tagType === 'new').slice(0, 2);
  const recommendProducts = products.filter(p => p.category !== 'hot').slice(0, 6);

  return (
    <div className="relative min-h-screen w-full flex flex-col pb-28 overflow-hidden bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-40 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-5 pt-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-white dark:ring-gray-700 shadow-sm"
                style={{ backgroundImage: `url("${userProfile.avatar}")` }}
              >
              </div>
              <div className="absolute bottom-0 right-0 size-3 bg-primary rounded-full border-2 border-background-light dark:border-background-dark"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">欢迎回来</span>
              <h2 className="text-text-primary dark:text-white text-lg font-bold leading-none">{userProfile.name}</h2>
            </div>
          </div>
          <button className="relative flex items-center justify-center size-10 rounded-full bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 shadow-sm text-text-primary dark:text-white transition-transform active:scale-95">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-2 right-2.5 size-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-6 px-5">
        <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#F5E6C4] via-[#E8D4A8] to-[#D4BC85] dark:from-[#3D3524] dark:via-[#4A402B] dark:to-[#2A2418] shadow-soft p-6 group">
          <div className="absolute -right-6 -top-6 size-32 rounded-full border-[16px] border-white/20 dark:border-white/5 blur-sm"></div>
          <div className="absolute -left-6 -bottom-6 size-24 rounded-full bg-white/20 dark:bg-white/5 blur-md"></div>
          <div className="relative z-10 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[#7A6331] dark:text-[#D4BC85] font-semibold text-sm tracking-wide uppercase">我的钱包</span>
              <div className="bg-white/30 dark:bg-black/20 backdrop-blur-sm rounded-full px-2 py-0.5">
                <span className="material-symbols-outlined text-[#7A6331] dark:text-[#D4BC85] text-[18px]">workspace_premium</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-[#42361B] dark:text-white text-4xl font-extrabold tracking-tight">{userProfile.points}</span>
              <span className="text-[#7A6331] dark:text-[#D4BC85] font-bold text-lg">当前积分</span>
            </div>
            <div className="mt-4 flex gap-3">
              <button className="flex-1 bg-[#42361B] dark:bg-[#D4BC85] text-[#E8D4A8] dark:text-[#2A2418] rounded-xl py-2.5 text-sm font-bold shadow-md active:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">add_card</span>
                充值
              </button>
              <button onClick={() => onNavigate(Screen.Orders)} className="flex-1 bg-white/40 dark:bg-white/10 hover:bg-white/50 text-[#42361B] dark:text-white rounded-xl py-2.5 text-sm font-bold backdrop-blur-sm transition-colors flex items-center justify-center gap-2">
                记录
                <span className="material-symbols-outlined text-[18px]">history</span>
              </button>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-gray-400 text-[24px]">search</span>
          </div>
          <input className="w-full h-14 pl-12 pr-12 rounded-2xl bg-white dark:bg-surface-dark border-none shadow-soft text-text-primary dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/50 text-base" placeholder="搜索美味..." type="text" />
          <div className="absolute inset-y-0 right-4 flex items-center">
            <button className="flex items-center justify-center p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </button>
          </div>
        </div>

        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-xl font-bold text-text-primary dark:text-white">今日特惠</h3>
            <button onClick={() => onNavigate(Screen.Menu)} className="text-primary text-sm font-semibold hover:opacity-80">查看全部</button>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 -mx-5 px-5 hide-scrollbar snap-x snap-mandatory">
            {hotProducts.map(product => (
              <div key={product.id} onClick={() => handleProductClick(product)} className="snap-center shrink-0 w-[80%] relative h-48 rounded-2xl overflow-hidden group shadow-card cursor-pointer">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url("${product.image}")` }}
                >
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <div className="flex items-center gap-2 mb-1">
                    {product.tagType === 'hot' && <span className="px-2 py-0.5 rounded-md bg-accent-gold text-[#42361B] text-xs font-bold uppercase tracking-wider">热门</span>}
                    {product.tagType === 'new' && <span className="px-2 py-0.5 rounded-md bg-primary text-white text-xs font-bold uppercase tracking-wider">新品</span>}
                    <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-xs font-medium">主厨精选</span>
                  </div>
                  <h4 className="text-white text-lg font-bold">{product.name}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-gray-200 text-sm line-clamp-1 opacity-80">{product.description}</p>
                    <span className="text-accent-gold font-bold text-lg whitespace-nowrap ml-2">{product.price} 积分</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-xl font-bold text-text-primary dark:text-white">热门推荐</h3>
            <button className="p-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              <span className="material-symbols-outlined text-[20px]">sort</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {recommendProducts.map(product => (
              <div key={product.id} onClick={() => handleProductClick(product)} className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-card hover:shadow-lg transition-shadow group flex flex-col cursor-pointer">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url("${product.image}")` }}
                  >
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(product); }}
                    className="absolute top-2 right-2 size-8 bg-white/90 dark:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <span className={`material-symbols-outlined text-[18px] ${favorites.includes(product.id) ? 'filled text-red-500' : ''}`}>favorite</span>
                  </button>
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <h4 className="text-text-primary dark:text-white font-bold text-base leading-tight mb-1">{product.name}</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 line-clamp-2">{product.description}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-accent-gold-dark dark:text-accent-gold font-bold text-sm">{product.price} 积分</span>
                    <button className="size-8 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-full flex items-center justify-center transition-all">
                      <span className="material-symbols-outlined text-[20px]">add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <div className="h-6"></div>
      </main>
    </div>
  );
};

export default Home;
