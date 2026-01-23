/**
 * 分类管理页面
 * 支持分类的 CRUD 操作
 */
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/types';

// Material Icons 列表（用于分类图标选择）
const iconOptions = [
    'local_fire_department',
    'lunch_dining',
    'icecream',
    'local_cafe',
    'restaurant',
    'fastfood',
    'bakery_dining',
    'ramen_dining',
    'set_meal',
    'liquor',
];

// 分类表单弹窗
interface CategoryFormProps {
    category: Category | null;
    onClose: () => void;
    onSave: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        id: category?.id || '',
        name: category?.name || '',
        icon: category?.icon || iconOptions[0],
    });
    const [saving, setSaving] = useState(false);
    const isEdit = !!category;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (isEdit) {
                // 更新分类（不能修改 ID）
                const { error } = await supabase
                    .from('categories')
                    .update({ name: formData.name, icon: formData.icon })
                    .eq('id', category.id);
                if (error) throw error;
            } else {
                // 新增分类
                const { error } = await supabase.from('categories').insert(formData);
                if (error) throw error;
            }
            onSave();
        } catch (error: any) {
            console.error('保存分类失败:', error);
            if (error.code === '23505') {
                alert('分类 ID 已存在，请使用其他 ID');
            } else {
                alert('保存失败，请重试');
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-fadeIn">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {isEdit ? '编辑分类' : '新增分类'}
                        </h2>
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
                            <span className="material-icons text-gray-500">close</span>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* 分类 ID */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">分类 ID *</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.id}
                            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                            disabled={isEdit}
                            placeholder="如: dessert, drink"
                            required
                        />
                        {isEdit && (
                            <p className="text-xs text-gray-500 mt-1">分类 ID 创建后不可修改</p>
                        )}
                    </div>

                    {/* 分类名称 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">分类名称 *</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="如: 甜品点心"
                            required
                        />
                    </div>

                    {/* 图标选择 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">选择图标 *</label>
                        <div className="grid grid-cols-5 gap-2">
                            {iconOptions.map((icon) => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, icon })}
                                    className={`p-3 rounded-lg flex items-center justify-center transition-all ${formData.icon === icon
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    <span className="material-icons">{icon}</span>
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

const Categories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const { data, error } = await supabase.from('categories').select('*');
            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            console.error('加载分类失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('删除分类后，该分类下的商品将失去分类关联。确定删除吗？')) return;

        try {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) throw error;
            loadCategories();
        } catch (error) {
            console.error('删除分类失败:', error);
            alert('删除失败，请重试');
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingCategory(null);
    };

    const handleFormSave = () => {
        handleFormClose();
        loadCategories();
    };

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
            <div className="flex justify-between items-center">
                <p className="text-gray-600">共 {categories.length} 个分类</p>
                <button onClick={() => setShowForm(true)} className="btn btn-primary">
                    <span className="material-icons">add</span>
                    新增分类
                </button>
            </div>

            {/* 分类列表 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                    <div key={category.id} className="card !p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                <span className="material-icons text-primary text-2xl">{category.icon}</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-800">{category.name}</h4>
                                <p className="text-sm text-gray-500">ID: {category.id}</p>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handleEdit(category)}
                                    className="p-1.5 hover:bg-gray-100 rounded-lg"
                                    title="编辑"
                                >
                                    <span className="material-icons text-gray-500">edit</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="p-1.5 hover:bg-red-50 rounded-lg"
                                    title="删除"
                                >
                                    <span className="material-icons text-red-500">delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    暂无分类，点击上方按钮添加
                </div>
            )}

            {/* 分类表单弹窗 */}
            {showForm && (
                <CategoryForm
                    category={editingCategory}
                    onClose={handleFormClose}
                    onSave={handleFormSave}
                />
            )}
        </div>
    );
};

export default Categories;
