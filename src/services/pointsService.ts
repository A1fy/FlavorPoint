/**
 * 积分服务
 * 提供积分交易相关的 API 操作
 */
import { supabase, DEMO_USER_ID } from '../lib/supabase';
import { DbPointsTransaction } from '../lib/database.types';
import { PointsTransaction } from '@/types';
import { updateUserPoints, getCurrentUser } from './userService';

/**
 * 将数据库积分交易格式转换为前端格式
 */
function mapDbTransactionToTransaction(dbTransaction: DbPointsTransaction): PointsTransaction {
    const date = new Date(dbTransaction.created_at);
    const formattedDate = `${date.getMonth() + 1}月${date.getDate()}日`;

    return {
        id: dbTransaction.id,
        date: formattedDate,
        amount: dbTransaction.amount,
        type: dbTransaction.type,
        description: dbTransaction.description || '',
    };
}

/**
 * 获取用户积分交易历史
 */
export async function getPointsHistory(): Promise<PointsTransaction[]> {
    const { data, error } = await supabase
        .from('points_transactions')
        .select('*')
        .eq('user_id', DEMO_USER_ID)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('获取积分历史失败:', error);
        throw error;
    }

    return (data || []).map(mapDbTransactionToTransaction);
}

/**
 * 添加积分交易记录
 */
export async function addPointsTransaction(
    amount: number,
    type: 'earn' | 'spend',
    description: string,
    orderId?: string
): Promise<void> {
    const { error } = await supabase
        .from('points_transactions')
        .insert({
            user_id: DEMO_USER_ID,
            amount,
            type,
            description,
            order_id: orderId || null,
        });

    if (error) {
        console.error('添加积分交易记录失败:', error);
        throw error;
    }
}

/**
 * 检查今天是否已签到
 */
export async function hasTodayCheckin(): Promise<boolean> {
    // 获取今天的开始时间（UTC）
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
        .from('points_transactions')
        .select('id')
        .eq('user_id', DEMO_USER_ID)
        .eq('description', '每日签到')
        .gte('created_at', today.toISOString())
        .limit(1);

    if (error) {
        console.error('检查签到状态失败:', error);
        throw error;
    }

    return (data && data.length > 0);
}

/**
 * 每日签到
 * @returns 签到获得的积分
 * @throws 如果今天已签到，抛出错误
 */
export async function dailyCheckin(): Promise<number> {
    const checkinPoints = 50;

    // 检查今天是否已签到
    const alreadyCheckin = await hasTodayCheckin();
    if (alreadyCheckin) {
        throw new Error('今天已经签到过了');
    }

    // 获取当前用户
    const user = await getCurrentUser();
    if (!user) {
        throw new Error('用户不存在');
    }

    // 更新用户积分
    await updateUserPoints(user.points + checkinPoints);

    // 记录积分交易
    await addPointsTransaction(checkinPoints, 'earn', '每日签到');

    return checkinPoints;
}
