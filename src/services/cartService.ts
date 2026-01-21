/**
 * 购物车服务
 * 提供购物车相关的 API 操作
 */
import { supabase, DEMO_USER_ID } from '../lib/supabase';
import { DbCartItem } from '../lib/database.types';
import { CartItem, Product } from '@/types';

/**
 * 将数据库购物车项格式转换为前端格式
 */
function mapDbCartItemToCartItem(dbItem: DbCartItem): CartItem | null {
    if (!dbItem.products) {
        return null;
    }

    const product: Product = {
        id: dbItem.products.id,
        name: dbItem.products.name,
        description: dbItem.products.description || '',
        price: dbItem.products.price,
        image: dbItem.products.image || '',
        category: dbItem.products.category,
        rating: dbItem.products.rating || undefined,
        calories: dbItem.products.calories || undefined,
        tagType: dbItem.products.tag_type || undefined,
    };

    return {
        product,
        quantity: dbItem.quantity,
        size: dbItem.size,
        currentPrice: dbItem.current_price,
    };
}

/**
 * 获取用户购物车
 */
export async function getCart(): Promise<CartItem[]> {
    const { data, error } = await supabase
        .from('cart_items')
        .select(`
      *,
      products (*)
    `)
        .eq('user_id', DEMO_USER_ID);

    if (error) {
        console.error('获取购物车失败:', error);
        throw error;
    }

    return (data || [])
        .map(item => mapDbCartItemToCartItem(item as DbCartItem))
        .filter((item): item is CartItem => item !== null);
}

/**
 * 添加商品到购物车
 */
export async function addToCart(
    product: Product,
    size: 'standard' | 'large' = 'standard'
): Promise<void> {
    const price = size === 'large' ? product.price + 200 : product.price;

    // 尝试更新已存在的购物车项
    const { data: existingItem, error: fetchError } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', DEMO_USER_ID)
        .eq('product_id', product.id)
        .eq('size', size)
        .maybeSingle();

    if (fetchError) {
        console.error('查询购物车失败:', fetchError);
        throw fetchError;
    }

    if (existingItem) {
        // 更新数量
        const { error: updateError } = await supabase
            .from('cart_items')
            .update({ quantity: existingItem.quantity + 1 })
            .eq('id', existingItem.id);

        if (updateError) {
            console.error('更新购物车失败:', updateError);
            throw updateError;
        }
    } else {
        // 插入新项
        const { error: insertError } = await supabase
            .from('cart_items')
            .insert({
                user_id: DEMO_USER_ID,
                product_id: product.id,
                quantity: 1,
                size,
                current_price: price,
            });

        if (insertError) {
            console.error('添加到购物车失败:', insertError);
            throw insertError;
        }
    }
}

/**
 * 更新购物车项数量
 */
export async function updateCartItemQuantity(
    productId: string,
    size: 'standard' | 'large',
    delta: number
): Promise<void> {
    // 获取当前购物车项
    const { data: existingItem, error: fetchError } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', DEMO_USER_ID)
        .eq('product_id', productId)
        .eq('size', size)
        .single();

    if (fetchError) {
        if (fetchError.code === 'PGRST116') {
            return; // 购物车项不存在
        }
        console.error('查询购物车项失败:', fetchError);
        throw fetchError;
    }

    const newQuantity = existingItem.quantity + delta;

    if (newQuantity <= 0) {
        // 删除购物车项
        const { error: deleteError } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', existingItem.id);

        if (deleteError) {
            console.error('删除购物车项失败:', deleteError);
            throw deleteError;
        }
    } else {
        // 更新数量
        const { error: updateError } = await supabase
            .from('cart_items')
            .update({ quantity: newQuantity })
            .eq('id', existingItem.id);

        if (updateError) {
            console.error('更新购物车数量失败:', updateError);
            throw updateError;
        }
    }
}

/**
 * 清空购物车
 */
export async function clearCart(): Promise<void> {
    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', DEMO_USER_ID);

    if (error) {
        console.error('清空购物车失败:', error);
        throw error;
    }
}
