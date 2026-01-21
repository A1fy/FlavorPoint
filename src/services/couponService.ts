/**
 * 优惠券服务
 * 提供优惠券相关的 API 操作
 */
import { supabase, DEMO_USER_ID } from '../lib/supabase';
import { DbCoupon, DbUserCoupon } from '../lib/database.types';
import { Coupon } from '@/types';

/**
 * 将数据库优惠券格式转换为前端格式
 */
function mapDbCouponToCoupon(dbCoupon: DbCoupon): Coupon {
    return {
        id: dbCoupon.id,
        title: dbCoupon.title,
        amount: dbCoupon.amount,
        type: dbCoupon.type,
        minSpend: dbCoupon.min_spend || undefined,
        description: dbCoupon.description || '',
    };
}

/**
 * 获取所有可领取的优惠券
 */
export async function getAvailableCoupons(): Promise<Coupon[]> {
    const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('is_active', true);

    if (error) {
        console.error('获取可用优惠券失败:', error);
        throw error;
    }

    return (data || []).map(mapDbCouponToCoupon);
}

/**
 * 获取用户已领取的优惠券
 */
export async function getUserCoupons(): Promise<Coupon[]> {
    const { data, error } = await supabase
        .from('user_coupons')
        .select(`
      *,
      coupons (*)
    `)
        .eq('user_id', DEMO_USER_ID)
        .eq('is_used', false);

    if (error) {
        console.error('获取用户优惠券失败:', error);
        throw error;
    }

    return (data || [])
        .filter((item: DbUserCoupon) => item.coupons)
        .map((item: DbUserCoupon) => mapDbCouponToCoupon(item.coupons!));
}

/**
 * 领取优惠券
 */
export async function claimCoupon(couponId: string): Promise<void> {
    const { error } = await supabase
        .from('user_coupons')
        .insert({
            user_id: DEMO_USER_ID,
            coupon_id: couponId,
            is_used: false,
        });

    if (error) {
        // 如果是重复领取错误，忽略
        if (error.code === '23505') {
            return;
        }
        console.error('领取优惠券失败:', error);
        throw error;
    }
}

/**
 * 标记优惠券为已使用
 */
export async function markCouponAsUsed(couponId: string): Promise<void> {
    const { error } = await supabase
        .from('user_coupons')
        .update({
            is_used: true,
            used_at: new Date().toISOString(),
        })
        .eq('user_id', DEMO_USER_ID)
        .eq('coupon_id', couponId);

    if (error) {
        console.error('标记优惠券已使用失败:', error);
        throw error;
    }
}

/**
 * 检查用户是否已领取某优惠券
 */
export async function hasClaimedCoupon(couponId: string): Promise<boolean> {
    const { data, error } = await supabase
        .from('user_coupons')
        .select('id')
        .eq('user_id', DEMO_USER_ID)
        .eq('coupon_id', couponId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return false;
        }
        console.error('检查优惠券领取状态失败:', error);
        throw error;
    }

    return !!data;
}
