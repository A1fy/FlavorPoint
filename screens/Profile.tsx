import React, { useState } from 'react';
import { Screen, UserProfile, Coupon, Product, PointsTransaction } from '../types';

interface ProfileProps {
  onNavigate: (screen: Screen) => void;
  userProfile: UserProfile;
  favorites: string[];
  myCoupons: Coupon[];
  availableCoupons: Coupon[];
  pointsHistory: PointsTransaction[];
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onAddCoupon: (coupon: Coupon) => void;
  onProductSelect: (product: Product) => void;
  onDailyCheckin: () => Promise<number>;
  products: Product[];
}

const Profile: React.FC<ProfileProps> = ({ onNavigate, userProfile, favorites, myCoupons, availableCoupons, pointsHistory, onUpdateProfile, onAddCoupon, onProductSelect, onDailyCheckin, products }) => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [activeView, setActiveView] = useState<'main' | 'favorites' | 'coupons' | 'couponCenter' | 'pointsHistory'>('main');
  const [newName, setNewName] = useState(userProfile.name);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const handleSaveProfile = () => {
    onUpdateProfile({ name: newName });
    setShowEditProfile(false);
  };

  const handleDailyCheckin = async () => {
    if (isCheckingIn) return;
    setIsCheckingIn(true);
    try {
      const points = await onDailyCheckin();
      alert(`签到成功！获得 ${points} 积分`);
    } catch (error) {
      alert('签到失败，请稍后再试');
    } finally {
      setIsCheckingIn(false);
    }
  };

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  const renderSubViewHeader = (title: string) => (
    <header className="relative px-4 py-3 flex items-center border-b border-gray-100 dark:border-gray-800">
      <button onClick={() => setActiveView('main')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <span className="material-symbols-outlined text-slate-700 dark:text-slate-200">arrow_back</span>
      </button>
      <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white ml-2">{title}</h1>
    </header>
  );

  if (activeView === 'pointsHistory') {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen pb-28">
        {renderSubViewHeader('积分明细')}
        <div className="p-4 bg-primary/10 mb-2">
          <p className="text-xs text-primary font-bold uppercase tracking-wide mb-1">当前剩余积分</p>
          <p className="text-4xl font-extrabold text-primary">{userProfile.points}</p>
        </div>
        <div className="px-4">
          {pointsHistory.map(transaction => (
            <div key={transaction.id} className="py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800 dark:text-white">{transaction.description}</p>
                <p className="text-xs text-gray-400 mt-1">{transaction.date}</p>
              </div>
              <span className={`font-bold text-lg ${transaction.type === 'earn' ? 'text-green-500' : 'text-slate-900 dark:text-white'}`}>
                {transaction.amount > 0 ? `+${transaction.amount}` : transaction.amount}
              </span>
            </div>
          ))}
          {pointsHistory.length === 0 && (
            <div className="text-center py-10 text-gray-400">暂无积分记录</div>
          )}
        </div>
      </div>
    );
  }

  if (activeView === 'favorites') {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen pb-28">
        {renderSubViewHeader('我的收藏')}
        <div className="p-4 grid grid-cols-2 gap-4">
          {favoriteProducts.map(product => (
            <div key={product.id} onClick={() => onProductSelect(product)} className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm cursor-pointer">
              <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url("${product.image}")` }}></div>
              <div className="p-3">
                <h4 className="font-bold text-sm truncate">{product.name}</h4>
                <p className="text-primary font-bold text-xs mt-1">{product.price} 积分</p>
              </div>
            </div>
          ))}
          {favoriteProducts.length === 0 && (
            <div className="col-span-2 text-center py-10 text-gray-400">
              <p>暂无收藏</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeView === 'coupons') {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen pb-28">
        {renderSubViewHeader('我的优惠券')}
        <div className="p-4 space-y-4">
          {myCoupons.map(coupon => (
            <div key={coupon.id} className="bg-white dark:bg-surface-dark rounded-xl p-4 shadow-sm flex items-center border-l-4 border-primary relative overflow-hidden">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{coupon.title}</h3>
                <p className="text-xs text-gray-500">{coupon.description}</p>
              </div>
              <div className="text-primary font-bold text-xl">
                {coupon.type === 'deduction' ? `-${coupon.amount}` : `${coupon.amount * 10}折`}
              </div>
              <div className="absolute -right-3 -bottom-3 text-primary/10">
                <span className="material-symbols-outlined text-6xl">confirmation_number</span>
              </div>
            </div>
          ))}
          {myCoupons.length === 0 && (
            <div className="text-center py-10 text-gray-400">暂无优惠券</div>
          )}
        </div>
      </div>
    );
  }

  if (activeView === 'couponCenter') {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen pb-28">
        {renderSubViewHeader('领券中心')}
        <div className="p-4 space-y-4">
          {availableCoupons.map(coupon => {
            const isOwned = myCoupons.some(c => c.id === coupon.id);
            return (
              <div key={coupon.id} className="bg-white dark:bg-surface-dark rounded-xl p-4 shadow-sm flex items-center justify-between border border-gray-100 dark:border-gray-800">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{coupon.title}</h3>
                  <p className="text-xs text-gray-500">{coupon.description}</p>
                  <span className="text-xs text-primary font-bold mt-1 block">
                    {coupon.type === 'deduction' ? `价值 ${coupon.amount} 积分` : `${coupon.amount * 10}折优惠`}
                  </span>
                </div>
                <button
                  onClick={() => onAddCoupon(coupon)}
                  disabled={isOwned}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold ${isOwned ? 'bg-gray-100 text-gray-400' : 'bg-primary text-white hover:bg-primary-dark'}`}
                >
                  {isOwned ? '已领取' : '领取'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-28 mx-auto max-w-md bg-background-light dark:bg-background-dark overflow-x-hidden shadow-2xl">
      <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[40%] bg-gradient-to-b from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <header className="relative px-6 pt-12 pb-4 flex items-center justify-between z-10">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">个人中心</h1>
        <button className="p-2 rounded-full bg-white/50 dark:bg-white/10 backdrop-blur-md hover:bg-white dark:hover:bg-white/20 transition-colors group">
          <span className="material-symbols-outlined text-slate-700 dark:text-slate-200 group-hover:rotate-45 transition-transform duration-300">settings</span>
        </button>
      </header>

      <div className="px-6 relative z-10">
        <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 shadow-soft relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-accent-gold/20 rounded-full blur-xl"></div>

          <div className="flex items-center gap-5 relative">
            <div className="relative">
              <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-primary to-accent-gold shadow-glow">
                <div className="w-full h-full rounded-full bg-slate-100 overflow-hidden border-2 border-white dark:border-slate-800">
                  <img alt="User Avatar" className="w-full h-full object-cover" src={userProfile.avatar} />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-surface-light dark:bg-surface-dark p-1 rounded-full">
                <div className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]">verified</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{userProfile.name}</h2>
                <button onClick={() => setShowEditProfile(true)} className="text-gray-400 hover:text-primary">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-900/20 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 border border-amber-200 dark:border-amber-700/50">
                  <span className="material-symbols-outlined text-[14px] filled text-amber-500">crown</span>
                  {userProfile.level}
                </span>
                <span className="text-xs text-slate-400 font-medium">ID: {userProfile.id.substring(0, 6)}...</span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-700/50">
            <div className="flex flex-col items-center gap-1 px-2 cursor-pointer hover:opacity-80 transition-opacity">
              <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-amber-600 dark:from-accent-gold dark:to-amber-300">{userProfile.points}</span>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">当前积分</span>
            </div>
            <div onClick={() => setActiveView('coupons')} className="flex flex-col items-center gap-1 px-2 cursor-pointer hover:opacity-80 transition-opacity">
              <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{myCoupons.length}</span>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">可用优惠券</span>
            </div>
            <div onClick={() => setActiveView('favorites')} className="flex flex-col items-center gap-1 px-2 cursor-pointer hover:opacity-80 transition-opacity">
              <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{favorites.length}</span>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">我的收藏</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 mt-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">常用功能</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setActiveView('pointsHistory')} className="flex flex-col gap-3 p-5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-slate-700/50 shadow-sm active:scale-[0.98] transition-transform text-left group">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">account_balance_wallet</span>
            </div>
            <div>
              <span className="block font-bold text-slate-800 dark:text-slate-200">我的积分</span>
              <span className="text-xs text-slate-400">查看积分明细</span>
            </div>
          </button>

          <button onClick={() => setActiveView('couponCenter')} className="flex flex-col gap-3 p-5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-slate-700/50 shadow-sm active:scale-[0.98] transition-transform text-left group">
            <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
              <span className="material-symbols-outlined text-orange-600 dark:text-orange-400">confirmation_number</span>
            </div>
            <div>
              <span className="block font-bold text-slate-800 dark:text-slate-200">领券中心</span>
              <span className="text-xs text-slate-400">超值优惠券</span>
            </div>
          </button>

          {/* Removed Address Management & Points Tasks buttons from grid as requested/redundant */}
        </div>
      </div>

      <div className="px-6 mt-8">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 px-1">积分任务</h3>
        <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 shadow-soft border border-slate-100 dark:border-slate-700/50">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="font-bold text-slate-800 dark:text-white text-lg">每日签到</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">已连续签到 <span className="text-primary font-bold">3</span> 天</p>
            </div>
            <button
              onClick={handleDailyCheckin}
              disabled={isCheckingIn}
              className="bg-primary hover:bg-primary-dark text-white text-sm font-bold py-2 px-5 rounded-full shadow-lg shadow-primary/30 active:scale-95 transition-all disabled:opacity-50"
            >
              {isCheckingIn ? '签到中...' : '签到领分'}
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30">
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500 shrink-0">
                <span className="material-symbols-outlined">share</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">分享菜品</p>
                <p className="text-[11px] text-slate-500">分享给好友下单即可获得</p>
              </div>
              <button className="text-xs font-bold text-primary border border-primary/30 px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors">
                去完成
              </button>
            </div>

            {/* Removed Review Task */}
          </div>
        </div>
      </div>

      <div className="h-8"></div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowEditProfile(false)}></div>
          <div className="bg-white dark:bg-surface-dark w-full max-w-sm rounded-2xl p-6 relative z-10 shadow-2xl">
            <h3 className="text-lg font-bold mb-4">修改个人信息</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">昵称</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowEditProfile(false)} className="px-4 py-2 text-sm text-gray-500">取消</button>
              <button onClick={handleSaveProfile} className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
