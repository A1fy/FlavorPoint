/**
 * 商品管理页面
 * 支持商品的 CRUD 操作，响应式表格和表单
 */
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product, Category } from '@/types';
import ImageUpload from '@/components/ImageUpload';

// 商品表单弹窗组件
interface ProductFormProps {
    product: Product | null;
    categories: Category[];
    onClose: () => void;
    onSave: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, categories, onClose, onSave }) => {
    const [formData, setFormData] = useState<{
        name: string;
        description: string;
        price: number;
        image: string;
        category: string;
        rating: number | null;
        calories: number | null;
        tag_type: 'hot' | 'new' | 'sold-out' | null;
    }>({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || 0,
        image: product?.image || '',
        category: product?.category || (categories[0]?.id || ''),
        rating: product?.rating || null,
        calories: product?.calories || null,
        tag_type: product?.tag_type || null,
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (product) {
                // 更新商品
                const { error } = await supabase
                    .from('products')
                    .update(formData)
                    .eq('id', product.id);
                if (error) throw error;
            } else {
                // 新增商品
                const { error } = await supabase.from('products').insert(formData);
                if (error) throw error;
            }
            onSave();
        } catch (error) {
            console.error('保存商品失败:', error);
            alert('保存失败，请重试');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fadeIn">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {product ? '编辑商品' : '新增商品'}
                        </h2>
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
                            <span className="material-icons text-gray-500">close</span>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* 商品名称 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">商品名称 *</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    {/* 商品描述 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">商品描述</label>
                        <textarea
                            className="input min-h-[80px] resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* 价格和分类 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">价格 (积分) *</label>
                            <input
                                type="number"
                                className="input"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                min="0"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">分类 *</label>
                            <select
                                className="input"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* 图片上传 */}
                    <ImageUpload
                        currentImage={formData.image}
                        onUploadSuccess={(imageUrl) => setFormData({ ...formData, image: imageUrl })}
                    />

                    {/* 评分和卡路里 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">评分</label>
                            <input
                                type="number"
                                className="input"
                                value={formData.rating || ''}
                                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) || null })}
                                min="0"
                                max="5"
                                step="0.1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">卡路里</label>
                            <input
                                type="number"
                                className="input"
                                value={formData.calories || ''}
                                onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) || null })}
                                min="0"
                            />
                        </div>
                    </div>

                    {/* 标签类型 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">商品标签</label>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { value: null, label: '无标签' },
                                { value: 'hot', label: '热门' },
                                { value: 'new', label: '新品' },
                                { value: 'sold-out', label: '售罄' },
                            ].map((opt) => (
                                <button
                                    key={opt.label}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, tag_type: opt.value as Product['tag_type'] })}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${formData.tag_type === opt.value
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
                            取消
                        </button>
                        <button type="submit" disabled={saving} className="btn btn-primary flex-1">
                            {saving ? '保存中...' : '保存'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [{ data: productsData }, { data: categoriesData }] = await Promise.all([
                supabase.from('products').select('*').order('created_at', { ascending: false }),
                supabase.from('categories').select('*'),
            ]);
            setProducts(productsData || []);
            setCategories(categoriesData || []);
        } catch (error) {
            console.error('加载数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('确定要删除这个商品吗？')) return;

        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
            loadData();
        } catch (error) {
            console.error('删除商品失败:', error);
            alert('删除失败，请重试');
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingProduct(null);
    };

    const handleFormSave = () => {
        handleFormClose();
        loadData();
    };

    // 过滤商品
    const filteredProducts = products.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = !filterCategory || p.category === filterCategory;
        return matchSearch && matchCategory;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* 操作栏 */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {/* 搜索框 */}
                    <div className="relative">
                        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="搜索商品..."
                            className="input pl-10 w-full sm:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* 分类筛选 */}
                    <select
                        className="input w-full sm:w-40"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="">全部分类</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                {/* 新增按钮 */}
                <button onClick={() => setShowForm(true)} className="btn btn-primary w-full sm:w-auto">
                    <span className="material-icons">add</span>
                    新增商品
                </button>
            </div>

            {/* 商品列表 - 桌面端表格 */}
            <div className="hidden md:block table-container">
                <table className="w-full">
                    <thead className="table-header">
                        <tr>
                            <th className="table-cell text-left">商品</th>
                            <th className="table-cell text-left">分类</th>
                            <th className="table-cell text-left">价格</th>
                            <th className="table-cell text-left">标签</th>
                            <th className="table-cell text-left">评分</th>
                            <th className="table-cell text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="table-row">
                                <td className="table-cell">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={product.image || ''}
                                            alt={product.name}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-800">{product.name}</p>
                                            <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                                {product.description}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="table-cell">
                                    {categories.find((c) => c.id === product.category)?.name || product.category}
                                </td>
                                <td className="table-cell font-medium">¥{product.price}</td>
                                <td className="table-cell">
                                    {product.tag_type && (
                                        <span className={`badge ${product.tag_type === 'hot' ? 'badge-danger' :
                                            product.tag_type === 'new' ? 'badge-info' : 'badge-warning'
                                            }`}>
                                            {product.tag_type === 'hot' ? '热门' :
                                                product.tag_type === 'new' ? '新品' : '售罄'}
                                        </span>
                                    )}
                                </td>
                                <td className="table-cell">
                                    <div className="flex items-center gap-1">
                                        <span className="material-icons text-yellow-500 text-sm">star</span>
                                        <span>{product.rating || '-'}</span>
                                    </div>
                                </td>
                                <td className="table-cell text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="编辑"
                                        >
                                            <span className="material-icons text-gray-500 text-lg">edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                            title="删除"
                                        >
                                            <span className="material-icons text-red-500 text-lg">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredProducts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">暂无商品数据</div>
                )}
            </div>

            {/* 商品列表 - 移动端卡片 */}
            <div className="md:hidden space-y-3">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="card !p-4">
                        <div className="flex gap-3">
                            <img
                                src={product.image || ''}
                                alt={product.name}
                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h4 className="font-medium text-gray-800 truncate">{product.name}</h4>
                                        <p className="text-sm text-gray-500">
                                            {categories.find((c) => c.id === product.category)?.name}
                                        </p>
                                    </div>
                                    {product.tag_type && (
                                        <span className={`badge flex-shrink-0 ${product.tag_type === 'hot' ? 'badge-danger' :
                                            product.tag_type === 'new' ? 'badge-info' : 'badge-warning'
                                            }`}>
                                            {product.tag_type === 'hot' ? '热门' :
                                                product.tag_type === 'new' ? '新品' : '售罄'}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold text-primary">¥{product.price}</span>
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <span className="material-icons text-yellow-500 text-sm">star</span>
                                            {product.rating || '-'}
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="p-1.5 hover:bg-gray-100 rounded-lg"
                                        >
                                            <span className="material-icons text-gray-500">edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-1.5 hover:bg-red-50 rounded-lg"
                                        >
                                            <span className="material-icons text-red-500">delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">暂无商品数据</div>
                )}
            </div>

            {/* 商品表单弹窗 */}
            {showForm && (
                <ProductForm
                    product={editingProduct}
                    categories={categories}
                    onClose={handleFormClose}
                    onSave={handleFormSave}
                />
            )}
        </div>
    );
};

export default Products;
