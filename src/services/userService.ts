/**
 * 用户服务
 * 提供用户资料、收藏相关的 API 操作
 */
import { supabase, DEMO_USER_ID } from '../lib/supabase';
import { DbUser, DbFavorite } from '../lib/database.types';
import { UserProfile } from '@/types';

/**
 * 将数据库用户格式转换为前端格式
 */
function mapDbUserToUserProfile(dbUser: DbUser): UserProfile {
    return {
        id: dbUser.id,
        name: dbUser.name,
        avatar: dbUser.avatar || '',
        level: dbUser.level,
        points: dbUser.points,
    };
}

/**
 * 获取当前用户资料
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', DEMO_USER_ID)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return null;
        }
        console.error('获取用户资料失败:', error);
        throw error;
    }

    return data ? mapDbUserToUserProfile(data) : null;
}

/**
 * 更新用户资料
 */
export async function updateUserProfile(updates: Partial<Pick<UserProfile, 'name' | 'avatar'>>): Promise<UserProfile | null> {
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', DEMO_USER_ID)
        .select()
        .single();

    if (error) {
        console.error('更新用户资料失败:', error);
        throw error;
    }

    return data ? mapDbUserToUserProfile(data) : null;
}

/**
 * 更新用户积分
 */
export async function updateUserPoints(newPoints: number): Promise<void> {
    const { error } = await supabase
        .from('users')
        .update({ points: newPoints })
        .eq('id', DEMO_USER_ID);

    if (error) {
        console.error('更新用户积分失败:', error);
        throw error;
    }
}

/**
 * 获取用户收藏列表
 */
export async function getUserFavorites(): Promise<string[]> {
    const { data, error } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', DEMO_USER_ID);

    if (error) {
        console.error('获取收藏列表失败:', error);
        throw error;
    }

    return (data || []).map(f => f.product_id);
}

/**
 * 添加收藏
 */
export async function addFavorite(productId: string): Promise<void> {
    const { error } = await supabase
        .from('favorites')
        .insert({
            user_id: DEMO_USER_ID,
            product_id: productId,
        });

    if (error) {
        // 如果是重复插入错误，忽略
        if (error.code === '23505') {
            return;
        }
        console.error('添加收藏失败:', error);
        throw error;
    }
}

/**
 * 取消收藏
 */
export async function removeFavorite(productId: string): Promise<void> {
    const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', DEMO_USER_ID)
        .eq('product_id', productId);

    if (error) {
        console.error('取消收藏失败:', error);
        throw error;
    }
}

/**
 * 切换收藏状态
 */
export async function toggleFavorite(productId: string): Promise<boolean> {
    const favorites = await getUserFavorites();
    const isFavorite = favorites.includes(productId);

    if (isFavorite) {
        await removeFavorite(productId);
        return false;
    } else {
        await addFavorite(productId);
        return true;
    }
}
