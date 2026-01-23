/**
 * 图片上传服务
 * 提供图片上传到 Cloudflare R2 的功能
 */
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from '../lib/r2';

// 支持的图片格式
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

// 最大文件大小 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * 验证图片文件
 */
function validateImageFile(file: File): { valid: boolean; error?: string } {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return { valid: false, error: '只支持 JPG、PNG、GIF、WebP 格式的图片' };
    }

    if (file.size > MAX_FILE_SIZE) {
        return { valid: false, error: '图片大小不能超过 5MB' };
    }

    return { valid: true };
}

/**
 * 生成唯一的文件名
 */
function generateFileName(file: File): string {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop() || 'jpg';
    return `${timestamp}-${randomStr}.${extension}`;
}

/**
 * 上传图片到 Cloudflare R2
 * @param file 图片文件
 * @returns 图片的公开访问 URL
 */
export async function uploadImage(file: File): Promise<string> {
    // 验证文件
    const validation = validateImageFile(file);
    if (!validation.valid) {
        throw new Error(validation.error);
    }

    try {
        // 生成文件名
        const fileName = generateFileName(file);

        // 读取文件内容
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        // 上传到 R2
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: fileName,
            Body: buffer,
            ContentType: file.type,
        });

        await r2Client.send(command);

        // 返回公开访问 URL
        const publicUrl = `${R2_PUBLIC_URL}/${fileName}`;
        return publicUrl;
    } catch (error) {
        console.error('上传图片失败:', error);
        throw new Error('图片上传失败，请重试');
    }
}

/**
 * 从 URL 中提取文件名
 */
function extractFileNameFromUrl(url: string): string | null {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        return pathname.substring(1); // 移除开头的 '/'
    } catch {
        return null;
    }
}

/**
 * 删除 R2 中的图片
 * @param imageUrl 图片的公开访问 URL
 */
export async function deleteImage(imageUrl: string): Promise<void> {
    try {
        const fileName = extractFileNameFromUrl(imageUrl);
        if (!fileName) {
            throw new Error('无效的图片 URL');
        }

        const command = new DeleteObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: fileName,
        });

        await r2Client.send(command);
    } catch (error) {
        console.error('删除图片失败:', error);
        throw new Error('图片删除失败');
    }
}
