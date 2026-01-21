import React, { useState } from 'react';
import { Screen, Product, Coupon } from './types';
import { BottomNav } from './components/BottomNav';
import Home from './screens/Home';
import Menu from './screens/Menu';
import Cart from './screens/Cart';
import OrderHistory from './screens/OrderHistory';
import Profile from './screens/Profile';
import ProductDetail from './screens/ProductDetail';
import { useAppData } from './src/hooks/useAppData';

const App: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Home);
    const [previousScreen, setPreviousScreen] = useState<Screen>(Screen.Home);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // 使用后端数据 Hook
    const {
        products,
        userProfile,
        cart,
        orders,
        favorites,
        myCoupons,
        availableCoupons,
        pointsHistory,
        isInitialized,
        updateProfile,
        toggleFavorite,
        addToCart,
        updateCartQuantity,
        checkout,
        claimCoupon,
        dailyCheckin,
    } = useAppData();

    const navigate = (screen: Screen) => {
        // 如果导航到商品详情页，保存来源页面
        if (screen === Screen.ProductDetail) {
            setPreviousScreen(currentScreen);
        }
        setCurrentScreen(screen);
        window.scrollTo(0, 0);
    };

    const handleProductSelect = (product: Product) => {
        setSelectedProduct(product);
    };

    const handleAddToCart = async (product: Product, size: 'standard' | 'large' = 'standard') => {
        await addToCart(product, size);
    };

    const handleUpdateCartQuantity = async (productId: string, size: 'standard' | 'large', delta: number) => {
        await updateCartQuantity(productId, size, delta);
    };

    const handleToggleFavorite = async (product: Product) => {
        await toggleFavorite(product);
    };

    const handleUpdateProfile = async (updates: Partial<{ name: string; avatar: string }>) => {
        await updateProfile(updates);
    };

    const handleAddCoupon = async (coupon: Coupon) => {
        await claimCoupon(coupon);
    };

    const handleCheckout = async (finalPrice: number, usedCoupon?: Coupon) => {
        if (!userProfile) {
            alert('用户信息加载中，请稍后再试');
            return;
        }

        if (userProfile.points < finalPrice) {
            alert('积分不足，无法支付！');
            return;
        }

        try {
            await checkout(finalPrice, usedCoupon);
            navigate(Screen.Orders);
        } catch (error) {
            console.error('结账失败:', error);
            alert('结账失败，请重试');
        }
    };

    // 加载状态
    if (!isInitialized || !userProfile) {
        return (
            <div className="mx-auto max-w-md bg-white dark:bg-background-dark min-h-screen shadow-2xl flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 dark:text-gray-400">加载中...</p>
                </div>
            </div>
        );
    }

    const renderScreen = () => {
        switch (currentScreen) {
            case Screen.Home:
                return (
                    <Home
                        onNavigate={navigate}
                        onProductSelect={handleProductSelect}
                        favorites={favorites}
                        onToggleFavorite={handleToggleFavorite}
                        userProfile={userProfile}
                        products={products}
                    />
                );
            case Screen.Menu:
                return (
                    <Menu
                        onNavigate={navigate}
                        cart={cart}
                        onAddToCart={handleAddToCart}
                        onUpdateCartQuantity={handleUpdateCartQuantity}
                        onProductSelect={handleProductSelect}
                        favorites={favorites}
                        onToggleFavorite={handleToggleFavorite}
                        userPoints={userProfile.points}
                        products={products}
                    />
                );
            case Screen.Cart:
                return (
                    <Cart
                        onNavigate={navigate}
                        cart={cart}
                        onAddToCart={handleAddToCart}
                        onUpdateCartQuantity={handleUpdateCartQuantity}
                        userPoints={userProfile.points}
                        myCoupons={myCoupons}
                        onCheckout={handleCheckout}
                    />
                );
            case Screen.Orders:
                return <OrderHistory onNavigate={navigate} orders={orders} />;
            case Screen.Profile:
                return (
                    <Profile
                        onNavigate={navigate}
                        userProfile={userProfile}
                        favorites={favorites}
                        myCoupons={myCoupons}
                        availableCoupons={availableCoupons}
                        pointsHistory={pointsHistory}
                        onUpdateProfile={handleUpdateProfile}
                        onAddCoupon={handleAddCoupon}
                        onProductSelect={(p) => {
                            handleProductSelect(p);
                            navigate(Screen.ProductDetail);
                        }}
                        onDailyCheckin={dailyCheckin}
                        products={products}
                    />
                );
            case Screen.ProductDetail:
                if (!selectedProduct) {
                    return (
                        <Home
                            onNavigate={navigate}
                            onProductSelect={handleProductSelect}
                            favorites={favorites}
                            onToggleFavorite={handleToggleFavorite}
                            userProfile={userProfile}
                            products={products}
                        />
                    );
                }

                // 计算购物车中该商品的总数量
                const quantityInCart = cart
                    .filter((item) => item.product.id === selectedProduct.id)
                    .reduce((acc, item) => acc + item.quantity, 0);

                return (
                    <ProductDetail
                        product={selectedProduct}
                        onNavigate={navigate}
                        onAddToCart={handleAddToCart}
                        cartQuantity={quantityInCart}
                        isFavorite={favorites.includes(selectedProduct.id)}
                        onToggleFavorite={handleToggleFavorite}
                        backScreen={previousScreen}
                    />
                );
            default:
                return (
                    <Home
                        onNavigate={navigate}
                        onProductSelect={handleProductSelect}
                        favorites={favorites}
                        onToggleFavorite={handleToggleFavorite}
                        userProfile={userProfile}
                        products={products}
                    />
                );
        }
    };

    // 只在主要页面显示底部导航
    const showBottomNav = [Screen.Home, Screen.Menu, Screen.Orders, Screen.Profile].includes(
        currentScreen
    );

    return (
        <div className="mx-auto max-w-md bg-white dark:bg-background-dark min-h-screen shadow-2xl overflow-hidden relative">
            {renderScreen()}
            {showBottomNav && <BottomNav currentScreen={currentScreen} onNavigate={navigate} />}
        </div>
    );
};

export default App;