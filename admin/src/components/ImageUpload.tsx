/**
 * 图片上传组件
 * 支持点击选择和拖拽上传图片
 */
import React, { useState, useRef } from 'react';
import { uploadImage } from '@/services/uploadService';

interface ImageUploadProps {
    currentImage?: string;
    onUploadSuccess: (imageUrl: string) => void;
    onUploadError?: (error: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    currentImage = '',
    onUploadSuccess,
    onUploadError,
}) => {
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(currentImage);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 处理文件上传
    const handleFileUpload = async (file: File) => {
        setUploading(true);

        try {
            const imageUrl = await uploadImage(file);
            setPreviewUrl(imageUrl);
            onUploadSuccess(imageUrl);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '上传失败';
            onUploadError?.(errorMessage);
            alert(errorMessage);
        } finally {
            setUploading(false);
        }
    };

    // 文件选择处理
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    // 拖拽处理
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleFileUpload(file);
        } else {
            alert('请上传图片文件');
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">商品图片</label>

            {/* 上传区域 */}
            <div
                className={`relative border-2 border-dashed rounded-lg p-4 transition-all ${dragOver
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-300 hover:border-gray-400'
                    } ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => !uploading && fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                />

                {previewUrl ? (
                    // 显示预览图
                    <div className="flex items-center gap-4">
                        <img
                            src={previewUrl}
                            alt="预览"
                            className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="flex-1">
                            <p className="text-sm text-gray-600 mb-1">
                                {uploading ? '上传中...' : '点击或拖拽图片来更换'}
                            </p>
                            <p className="text-xs text-gray-500">
                                支持 JPG、PNG、GIF、WebP，最大 5MB
                            </p>
                        </div>
                    </div>
                ) : (
                    // 显示上传提示
                    <div className="text-center py-8">
                        <span className="material-icons text-4xl text-gray-400 mb-2">
                            {uploading ? 'cloud_upload' : 'add_photo_alternate'}
                        </span>
                        <p className="text-sm text-gray-600 mb-1">
                            {uploading ? '上传中...' : '点击或拖拽图片到这里上传'}
                        </p>
                        <p className="text-xs text-gray-500">
                            支持 JPG、PNG、GIF、WebP，最大 5MB
                        </p>
                    </div>
                )}

                {/* 上传进度遮罩 */}
                {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm font-medium text-gray-700">上传中...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
