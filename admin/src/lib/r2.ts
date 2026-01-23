/**
 * Cloudflare R2 配置
 * 使用 AWS SDK v3 连接 R2 存储服务（S3 兼容）
 */
import { S3Client } from '@aws-sdk/client-s3';

// 从环境变量读取配置
const R2_ACCOUNT_ID = import.meta.env.VITE_R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = import.meta.env.VITE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = import.meta.env.VITE_R2_SECRET_ACCESS_KEY;
export const R2_BUCKET_NAME = import.meta.env.VITE_R2_BUCKET_NAME;
export const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL;

// 创建 S3 客户端配置（Cloudflare R2 兼容 S3 API）
export const r2Client = new S3Client({
    region: 'auto', // R2 使用 'auto' 作为 region
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
});
