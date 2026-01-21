/**
 * 商品服务
 * 提供商品和分类相关的 API 操作
 */
import { supabase } from '../lib/supabase';
import { DbProduct, DbCategory } from '../lib/database.types';
import { Product } from '@/types';

/**
 * 将数据库商品格式转换为前端格式
 */
function mapDbProductToProduct(dbProduct: DbProduct): Product {
    return {
        id: dbProduct.id,
        name: dbProduct.name,
        description: dbProduct.description || '',
        price: dbProduct.price,
        image: dbProduct.image || '',
        category: dbProduct.category,
        rating: dbProduct.rating || undefined,
        calories: dbProduct.calories || undefined,
        tagType: dbProduct.tag_type || undefined,
    };
}

/**
 * 获取所有商品
 */
export async function getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('获取商品列表失败:', error);
        throw error;
    }

    return (data || []).map(mapDbProductToProduct);
}

/**
 * 按分类获取商品
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
    let query = supabase.from('products').select('*');

    if (category === 'hot') {
        // 热门分类包含 hot 和 new 标签的商品
        query = query.or('tag_type.eq.hot,tag_type.eq.new');
    } else {
        query = query.eq('category', category);
    }

    const { data, error } = await query.order('created_at', { ascending: true });

    if (error) {
        console.error('按分类获取商品失败:', error);
        throw error;
    }

    return (data || []).map(mapDbProductToProduct);
}

/**
 * 获取单个商品
 */
export async function getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return null; // 未找到商品
        }
        console.error('获取商品详情失败:', error);
        throw error;
    }

    return data ? mapDbProductToProduct(data) : null;
}

/**
 * 获取所有分类
 */
export async function getAllCategories(): Promise<DbCategory[]> {
    const { data, error } = await supabase
        .from('categories')
        .select('*');

    if (error) {
        console.error('获取分类列表失败:', error);
        throw error;
    }

    return data || [];
}
