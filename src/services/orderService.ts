/**
 * 订单服务
 * 提供订单相关的 API 操作
 */
import { supabase, DEMO_USER_ID } from '../lib/supabase';
import { DbOrder, DbOrderItem } from '../lib/database.types';
import { Order, CartItem, Coupon } from '@/types';
import { clearCart } from './cartService';
import { updateUserPoints } from './userService';
import { addPointsTransaction } from './pointsService';
import { markCouponAsUsed } from './couponService';

/**
 * 将数据库订单格式转换为前端格式
 */
function mapDbOrderToOrder(dbOrder: DbOrder): Order {
    const items: CartItem[] = (dbOrder.order_items || []).map(item => ({
        product: {
            id: item.product_id,
            name: item.product_name || '',
            description: '',
            price: item.price,
            image: item.product_image || '',
            category: '',
        },
        quantity: item.quantity,
        size: item.size,
        currentPrice: item.price,
    }));

    // 格式化日期
    const date = new Date(dbOrder.created_at);
    const formattedDate = `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    return {
        id: dbOrder.id,
        date: formattedDate,
        status: dbOrder.status,
        items,
        totalPrice: dbOrder.total_price,
        discountAmount: dbOrder.discount_amount,
        finalPrice: dbOrder.final_price,
    };
}

/**
 * 获取用户订单列表
 */
export async function getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
        .from('orders')
        .select(`
      *,
      order_items (*)
    `)
        .eq('user_id', DEMO_USER_ID)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('获取订单列表失败:', error);
        throw error;
    }

    return (data || []).map(order => mapDbOrderToOrder(order as DbOrder));
}

/**
 * 获取单个订单详情
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
    const { data, error } = await supabase
        .from('orders')
        .select(`
      *,
      order_items (*)
    `)
        .eq('id', orderId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return null;
        }
        console.error('获取订单详情失败:', error);
        throw error;
    }

    return data ? mapDbOrderToOrder(data as DbOrder) : null;
}

/**
 * 创建订单
 */
export async function createOrder(
    cart: CartItem[],
    finalPrice: number,
    usedCoupon?: Coupon,
    currentPoints?: number
): Promise<Order> {
    const totalPrice = cart.reduce(
        (acc, item) => acc + item.currentPrice * item.quantity,
        0
    );
    const discountAmount = usedCoupon
        ? usedCoupon.type === 'deduction'
            ? usedCoupon.amount
            : Math.round(totalPrice * (1 - usedCoupon.amount))
        : 0;

    // 1. 创建订单
    const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: DEMO_USER_ID,
            status: 'placed',
            total_price: totalPrice,
            discount_amount: discountAmount,
            final_price: finalPrice,
        })
        .select()
        .single();

    if (orderError) {
        console.error('创建订单失败:', orderError);
        throw orderError;
    }

    // 2. 创建订单项
    const orderItems = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.product.id,
        quantity: item.quantity,
        size: item.size,
        price: item.currentPrice,
        product_name: item.product.name,
        product_image: item.product.image,
    }));

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

    if (itemsError) {
        console.error('创建订单项失败:', itemsError);
        throw itemsError;
    }

    // 3. 扣除积分
    if (currentPoints !== undefined) {
        await updateUserPoints(currentPoints - finalPrice);
    }

    // 4. 记录积分交易
    await addPointsTransaction(-finalPrice, 'spend', '订单消费', orderData.id);

    // 5. 标记优惠券已使用
    if (usedCoupon) {
        await markCouponAsUsed(usedCoupon.id);
    }

    // 6. 清空购物车
    await clearCart();

    // 7. 返回订单信息
    const order = await getOrderById(orderData.id);
    if (!order) {
        throw new Error('创建订单后无法获取订单信息');
    }

    return order;
}

/**
 * 更新订单状态
 */
export async function updateOrderStatus(
    orderId: string,
    status: 'placed' | 'completed'
): Promise<void> {
    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

    if (error) {
        console.error('更新订单状态失败:', error);
        throw error;
    }
}
