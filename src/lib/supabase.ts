/**
 * Supabase 客户端配置
 * 提供与 Supabase 数据库交互的客户端实例
 */
import { createClient } from '@supabase/supabase-js';

// 从环境变量获取 Supabase 配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 验证环境变量是否配置
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase 环境变量未配置，请检查 .env.local 文件');
}

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 导出演示用户 ID（由于无需登录，使用固定的演示用户）
export const DEMO_USER_ID = '33333333-3333-3333-3333-333333333301';
