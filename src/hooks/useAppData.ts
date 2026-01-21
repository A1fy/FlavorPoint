/**
 * 应用数据 Hook
 * 提供全局数据状态管理，从 Supabase 获取数据并同步更新
 */
import { useState, useEffect, useCallback } from 'react';
import { Product, UserProfile, CartItem, Order, Coupon, PointsTransaction } from '@/types';
import * as productService from '../services/productService';
import * as userService from '../services/userService';
import * as cartService from '../services/cartService';
import * as orderService from '../services/orderService';
import * as couponService from '../services/couponService';
import * as pointsService from '../services/pointsService';
import { DbCategory } from '../lib/database.types';

// 定义加载状态类型
interface LoadingState {
    products: boolean;
    user: boolean;
    cart: boolean;
    orders: boolean;
    coupons: boolean;
    points: boolean;
}

// 定义 Hook 返回类型
export interface UseAppDataReturn {
    // 数据状态
    products: Product[];
    categories: DbCategory[];
    userProfile: UserProfile | null;
    cart: CartItem[];
    orders: Order[];
    favorites: string[];
    myCoupons: Coupon[];
    availableCoupons: Coupon[];
    pointsHistory: PointsTransaction[];

    // 加载状态
    loading: LoadingState;
    isInitialized: boolean;

    // 商品操作
    refreshProducts: () => Promise<void>;

    // 用户操作
    updateProfile: (updates: Partial<Pick<UserProfile, 'name' | 'avatar'>>) => Promise<void>;
    toggleFavorite: (product: Product) => Promise<void>;

    // 购物车操作
    addToCart: (product: Product, size?: 'standard' | 'large') => Promise<void>;
    updateCartQuantity: (productId: string, size: 'standard' | 'large', delta: number) => Promise<void>;

    // 订单操作
    checkout: (finalPrice: number, usedCoupon?: Coupon) => Promise<void>;
    refreshOrders: () => Promise<void>;

    // 优惠券操作
    claimCoupon: (coupon: Coupon) => Promise<void>;

    // 积分操作
    dailyCheckin: () => Promise<number>;
}

/**
 * 应用数据 Hook
 * 管理所有与后端交互的数据状态
 */
export function useAppData(): UseAppDataReturn {
    // 数据状态
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<DbCategory[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [myCoupons, setMyCoupons] = useState<Coupon[]>([]);
    const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
    const [pointsHistory, setPointsHistory] = useState<PointsTransaction[]>([]);

    // 加载状态
    const [loading, setLoading] = useState<LoadingState>({
        products: true,
        user: true,
        cart: true,
        orders: true,
        coupons: true,
        points: true,
    });
    const [isInitialized, setIsInitialized] = useState(false);

    // 刷新商品数据
    const refreshProducts = useCallback(async () => {
        try {
            setLoading(prev => ({ ...prev, products: true }));
            const [productsData, categoriesData] = await Promise.all([
                productService.getAllProducts(),
                productService.getAllCategories(),
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('刷新商品数据失败:', error);
        } finally {
            setLoading(prev => ({ ...prev, products: false }));
        }
    }, []);

    // 刷新用户数据
    const refreshUser = useCallback(async () => {
        try {
            setLoading(prev => ({ ...prev, user: true }));
            const [userData, favoritesData] = await Promise.all([
                userService.getCurrentUser(),
                userService.getUserFavorites(),
            ]);
            setUserProfile(userData);
            setFavorites(favoritesData);
        } catch (error) {
            console.error('刷新用户数据失败:', error);
        } finally {
            setLoading(prev => ({ ...prev, user: false }));
        }
    }, []);

    // 刷新购物车
    const refreshCart = useCallback(async () => {
        try {
            setLoading(prev => ({ ...prev, cart: true }));
            const cartData = await cartService.getCart();
            setCart(cartData);
        } catch (error) {
            console.error('刷新购物车失败:', error);
        } finally {
            setLoading(prev => ({ ...prev, cart: false }));
        }
    }, []);

    // 刷新订单
    const refreshOrders = useCallback(async () => {
        try {
            setLoading(prev => ({ ...prev, orders: true }));
            const ordersData = await orderService.getOrders();
            setOrders(ordersData);
        } catch (error) {
            console.error('刷新订单失败:', error);
        } finally {
            setLoading(prev => ({ ...prev, orders: false }));
        }
    }, []);

    // 刷新优惠券
    const refreshCoupons = useCallback(async () => {
        try {
            setLoading(prev => ({ ...prev, coupons: true }));
            const [myData, availableData] = await Promise.all([
                couponService.getUserCoupons(),
                couponService.getAvailableCoupons(),
            ]);
            setMyCoupons(myData);
            setAvailableCoupons(availableData);
        } catch (error) {
            console.error('刷新优惠券失败:', error);
        } finally {
            setLoading(prev => ({ ...prev, coupons: false }));
        }
    }, []);

    // 刷新积分历史
    const refreshPoints = useCallback(async () => {
        try {
            setLoading(prev => ({ ...prev, points: true }));
            const pointsData = await pointsService.getPointsHistory();
            setPointsHistory(pointsData);
        } catch (error) {
            console.error('刷新积分历史失败:', error);
        } finally {
            setLoading(prev => ({ ...prev, points: false }));
        }
    }, []);

    // 初始化数据
    useEffect(() => {
        const initData = async () => {
            await Promise.all([
                refreshProducts(),
                refreshUser(),
                refreshCart(),
                refreshOrders(),
                refreshCoupons(),
                refreshPoints(),
            ]);
            setIsInitialized(true);
        };
        initData();
    }, [refreshProducts, refreshUser, refreshCart, refreshOrders, refreshCoupons, refreshPoints]);

    // 更新用户资料
    const updateProfile = useCallback(async (updates: Partial<Pick<UserProfile, 'name' | 'avatar'>>) => {
        try {
            const updated = await userService.updateUserProfile(updates);
            if (updated) {
                setUserProfile(updated);
            }
        } catch (error) {
            console.error('更新用户资料失败:', error);
        }
    }, []);

    // 切换收藏
    const toggleFavorite = useCallback(async (product: Product) => {
        try {
            const isFavorite = favorites.includes(product.id);
            if (isFavorite) {
                await userService.removeFavorite(product.id);
                setFavorites(prev => prev.filter(id => id !== product.id));
            } else {
                await userService.addFavorite(product.id);
                setFavorites(prev => [...prev, product.id]);
            }
        } catch (error) {
            console.error('切换收藏失败:', error);
        }
    }, [favorites]);

    // 添加到购物车
    const addToCart = useCallback(async (product: Product, size: 'standard' | 'large' = 'standard') => {
        try {
            await cartService.addToCart(product, size);
            await refreshCart();
        } catch (error) {
            console.error('添加到购物车失败:', error);
        }
    }, [refreshCart]);

    // 更新购物车数量
    const updateCartQuantity = useCallback(async (productId: string, size: 'standard' | 'large', delta: number) => {
        try {
            await cartService.updateCartItemQuantity(productId, size, delta);
            await refreshCart();
        } catch (error) {
            console.error('更新购物车数量失败:', error);
        }
    }, [refreshCart]);

    // 结账
    const checkout = useCallback(async (finalPrice: number, usedCoupon?: Coupon) => {
        if (!userProfile) {
            throw new Error('用户未登录');
        }

        if (userProfile.points < finalPrice) {
            throw new Error('积分不足');
        }

        try {
            await orderService.createOrder(cart, finalPrice, usedCoupon, userProfile.points);
            // 刷新相关数据
            await Promise.all([
                refreshUser(),
                refreshCart(),
                refreshOrders(),
                refreshCoupons(),
                refreshPoints(),
            ]);
        } catch (error) {
            console.error('结账失败:', error);
            throw error;
        }
    }, [cart, userProfile, refreshUser, refreshCart, refreshOrders, refreshCoupons, refreshPoints]);

    // 领取优惠券
    const claimCoupon = useCallback(async (coupon: Coupon) => {
        try {
            await couponService.claimCoupon(coupon.id);
            await refreshCoupons();
        } catch (error) {
            console.error('领取优惠券失败:', error);
        }
    }, [refreshCoupons]);

    // 每日签到
    const dailyCheckin = useCallback(async (): Promise<number> => {
        try {
            const points = await pointsService.dailyCheckin();
            await Promise.all([refreshUser(), refreshPoints()]);
            return points;
        } catch (error) {
            console.error('签到失败:', error);
            throw error;
        }
    }, [refreshUser, refreshPoints]);

    return {
        // 数据
        products,
        categories,
        userProfile,
        cart,
        orders,
        favorites,
        myCoupons,
        availableCoupons,
        pointsHistory,
        // 状态
        loading,
        isInitialized,
        // 操作
        refreshProducts,
        updateProfile,
        toggleFavorite,
        addToCart,
        updateCartQuantity,
        checkout,
        refreshOrders,
        claimCoupon,
        dailyCheckin,
    };
}
