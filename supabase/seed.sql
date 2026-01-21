-- =====================================================
-- FlavorPoint 初始数据
-- 在执行 schema.sql 后，执行此脚本导入初始数据
-- =====================================================

-- =====================================================
-- 1. 插入分类数据
-- =====================================================
INSERT INTO categories (id, name, icon) VALUES
    ('hot', '热门', 'local_fire_department'),
    ('main', '招牌主食', 'lunch_dining'),
    ('dessert', '甜品点心', 'icecream'),
    ('drink', '清爽饮品', 'local_cafe')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. 插入商品数据
-- =====================================================
INSERT INTO products (id, name, description, price, image, category, tag_type, rating, calories) VALUES
    -- 热门商品
    ('11111111-1111-1111-1111-111111111101', 
     '香辣金枪鱼波奇饭', 
     '新鲜捕捞金枪鱼，搭配牛油果、海苔、芝麻及特制香辣酱汁。', 
     800, 
     'https://lh3.googleusercontent.com/aida-public/AB6AXuAfSeP2g5-f1choDMJS5k1DZlWmlZoYa3qEbNTDofrrxRxDeaqACC1LOEu1qiA1vTl5h2YgFgwHZNe6JnSSCmt_WnjHog2Xjsnz6dc2cBRekd5_DJHc0mhurJsK8sUye5HMLsMGdfhM4WL0RWD1AhoA2zL5UlxqvlwUx5hk8H-MttHboTVh1z_C_FC1kWcV7v3wkv8GQxMJs9VwH508b4sGevLMfjIHdZGqYyo_u24QinOXPwrHSZY28MnHfzAKn-geoVJh_2LvSW0q',
     'hot',
     'hot',
     4.8,
     450),
    
    ('11111111-1111-1111-1111-111111111102', 
     '酸种牛油果吐司', 
     '每日现烤酸种面包，铺满捣碎的牛油果，点缀微型蔬菜和坚果碎。', 
     450, 
     'https://lh3.googleusercontent.com/aida-public/AB6AXuCfpCzbo4TuQgLTzzm5aCnDwZNnixb0uT8WV9_6eFA9r39MfByvHs_ph6BMIWlbRjFxdM4MBj5uigtV4Qca93_ihicTvHjYIcxuT7XyzZwZYvWAsF-Xj4tfQ4fN5mLr4467RT2rOLKZzwBlyNzFIBp_-PKTfBxvLn8SB1ehBZ8CQp-wcYUcG-XEA_VNiqJrBbdpiXe3xn1Mwkl5eU46kP0FQC7rwnB2k6XyueQuKDU2lc4N2G6WDb3U2_mtqBgCJrsC9DS_oFWzx3wX',
     'hot',
     'new',
     4.9,
     320),
    
    -- 招牌主食
    ('11111111-1111-1111-1111-111111111103', 
     '香烤三文鱼碗', 
     '富含Omega-3的深海三文鱼，佐以藜麦、羽衣甘蓝和清爽柠檬酱汁。', 
     1200, 
     'https://lh3.googleusercontent.com/aida-public/AB6AXuDqIy2kGeLmENUrUQQaeqbKk-nkrD97sYvMF0FDPCmk4ahrk9YwM4VKlVrFKrQAh0dWkwt-A2IEsqr75vrYmPfVL29eqWRPhqhjYN7zMhhPdFape3VwZIOyV6JLyUG4o_byISoDB1tEEOiiB6-zMb3gOAG4wj_nb_rZXR9xeT1nEJ6C1YJlOsFGlvoEb8YAQGyQYhq_08ECzA06l0fHy8kww7bWj-3wvYCzrZvYiVmxA1nu8fB7_-KwtjwW5XgvU1J4OpBtwsq-sauq',
     'main',
     NULL,
     4.7,
     550),
    
    ('11111111-1111-1111-1111-111111111105', 
     '经典凯撒沙拉', 
     '嫩烤鸡胸肉、脆爽罗马生菜、帕尔马干酪片和自制面包丁。', 
     650, 
     'https://lh3.googleusercontent.com/aida-public/AB6AXuCgV1P1TaIPACWJLajnG-3RA0AharlAqDWcFCHkOiMtC2EJ4EIyidAkJL1Ch2mDpW5_mLuLcNQ4op2fycjKC0v58gSZdpAtDCAd_SEME0TFz0c9ggUFAcF8mlVhCQdPtCjMjdrEbvaWRdHt1v6fULfbhCLNnRsAgC1Tno7VBg1KzjUzh895_HiMAEpVWSQwKZlZR1WTDnujubXmp9EAOsvJvF5Q_Inv20OHBc4f0jyZltZXwXXfomKnT_TIzjtn6btzjbYi3cjucnSH',
     'main',
     NULL,
     4.5,
     380),
    
    ('11111111-1111-1111-1111-111111111107', 
     '牛油果酸面包', 
     '新鲜酵母面包，配以流心水波蛋和特制香草酱。', 
     450, 
     'https://lh3.googleusercontent.com/aida-public/AB6AXuBKeTbBhz8bU1d-txIpLG_wVnQbxAZv2cHvf1X1RW9azOeEhAFr9YloXiLP3jLXD6TFRG7k3L3oFdIhvVrtwu1B5OFytv2qfPL2tMcneuCflHNYfk5gJGvf5BoN9pBlvaT4LjN4E0D-L6ySjWwfI0PBCRwfmrpZMw6SOivNy4N5qTX9YD8eYH2OAlgHeekrv1lkXTzL4rjaIdfmXtt6Z4fW2xYyGqtQKjk7tcSG_WcTQ-wgVD9Bb6KLpg7MJlW-d7azoT7ADl8_Psrc',
     'main',
     NULL,
     4.7,
     340),
    
    ('11111111-1111-1111-1111-111111111108', 
     '意式辣味披萨', 
     '经典意式薄底，撒满马苏里拉芝士和辣味香肠。', 
     620, 
     'https://lh3.googleusercontent.com/aida-public/AB6AXuD7vHz-b0PKqpVpLInvouNDBtgLM5hwMJoyPjngABfq0GOyPyuma9rvBOBM3KotnyocesB2f5QogKI5Cr2HPE3loL9NaNa2wEQTam42fDKP6SlqVUfeaUrb2NvpIzbMWJIxFmvx7aFnOnp_YmJ6M-lAy_X16_iaUqx8qewe8Qwc1_Bingql7efiM7ebH4e-oMyQ5aS3sr8PVBAXxLnjoDsHTBRo8cruc1AQ2bcdiqqlBj4EwG6ZRzBPTUiwOaH1e29ARi7vCChSxsQd',
     'main',
     NULL,
     4.6,
     780),
    
    ('11111111-1111-1111-1111-111111111110', 
     '招牌红烧牛肉面', 
     '八小时慢炖牛腱，汤浓肉烂，面条劲道。', 
     500, 
     'https://lh3.googleusercontent.com/aida-public/AB6AXuA68AbrphmeIcs5IgY255szvjGrgUsfugmT_UJasXsznQ4aNaTV1t9bDD2Ndrd5HcKMSQRHunzOUje3PY0c0xJOuUyPZuKlcBtKkFfvSXvC1plMiVNwcenVXbinDlHpE3CJN4B_BIXs4INsJjFpxG6VdH-udllBbXNT5VARZsL171cW1nwA4N-YeON3VK-D7ZTJub1oXJCulStj1BIaSTC6PN1pcm2IovtAt4jZxAbwqsHcKOpEH7Ocnnz5UK3ddEEFHzQVEAvziHJI',
     'main',
     NULL,
     4.9,
     650),
    
    -- 甜品点心
    ('11111111-1111-1111-1111-111111111104', 
     '芒果天堂', 
     '精选当季成熟芒果，混合椰奶，撒上奇亚籽，口感丰富。', 
     350, 
     'https://lh3.googleusercontent.com/aida-public/AB6AXuDcAd2_xhYXJ8ytxT_QPNOr681sY7r-YdTffMcPpOipzZdEEfjumvAewd8sB6hqzduceSLRIlCHN7AcTsKL-eOma--lQA65AfP4jX1SNPKUNVFRx4WRTLqgRlyvjXM6tO9fwM5L75As4dPL9oVBKWqr1O7bligBbWRe4KL9PKlSQnF0f5hfbc2qtdhWA3zwXK4TFyMTYvWXJduHYX35_E89Tya-aj7Ftgw9eUaIz90qFs3o3vmYk1LNXv-av0K2cOZwb1Y_yc4bSgkF',
     'dessert',
     NULL,
     4.6,
     280),
    
    ('11111111-1111-1111-1111-111111111106', 
     '莓果阿萨伊碗', 
     '巴西莓果泥打底，铺满草莓、蓝莓和香脆麦片，抗氧化首选。', 
     550, 
     'https://lh3.googleusercontent.com/aida-public/AB6AXuCWZMWkUuAsZ4Uf4plrirvv_e6IqV-Yxc2EFmfNyHV3Ley9Nh7zcBrtnTGNSqgZ08hjGR1D0RS20qP2EVk_8C9MYq5rAed53zewU0Hm__Cc06dnVoOdM3C9hxg8jDWdO-A4EP-rAQEAglz8qxyri3k7wZmd8m7T1WN0clNbt-alPhiG5Ippwt-n8KsKakxzQBtRdiyCJPjwQGNU2p6NRU3EnNpHyQCKDGZcmefvBXjaGGbjXza3USttDBqfNCAGsS7Ggv_4Y5vc3FCT',
     'dessert',
     NULL,
     4.8,
     310),
    
    ('11111111-1111-1111-1111-111111111111', 
     '草莓千层蛋糕', 
     '时令有机草莓，每日限量供应，酸甜适中。', 
     380, 
     'https://lh3.googleusercontent.com/aida-public/AB6AXuAvTTmbqJofnTF-RTX0IKoJsN8S_1BXyCApFsV4ArbvmIsN_9XjamAxeeEEb88ihkLTBU25JmhnxTwlgolH6O25O8kMUQIkDxDso5xPP_nrl6TVuJjZ-lqSjjPzoBNwAAOxOXYJsA0CKFxOaptxv8bLo6OwQ75mA2TyldfZNFZhVoSdj07QYd77BpcgpJOzIJ6Irs6l3gBxb7n6CVurtdpqP0upW3Aj-8IbaL77PlM35h_qPvwStXIIH0ET05vtLrpRrvbxe5g89Ty8',
     'dessert',
     'sold-out',
     4.8,
     420),
    
    -- 清爽饮品
    ('11111111-1111-1111-1111-111111111109', 
     '宇治抹茶拿铁', 
     '选用特级抹茶粉，搭配香浓鲜奶，口感丝滑浓郁。', 
     350, 
     'https://lh3.googleusercontent.com/aida-public/AB6AXuBRKiY5SqQECe8sEPOfmnY_AJP7QgYWJZfpXMiwrucsGkhHG-IWwNHVKY-8mTNn0w_ado2b90OPHdhNRz_h6kGBBWF68fsDgIcd_bd4RwdpRUA1umTpSCIsm7XiPiMqsmEU_2a9_7x7LlGmKOxnBMdd7Zox09RdmWrBkRx1N0qOL49RnJVkbY4JmCB7taIj3n7bhN_Zq3eiSXbUYnyMQyIFqcSaPg-NoPDvJmIWy5WxbcqmparP225Dep7KA41EfNLJQCU3gMD8yaDP',
     'drink',
     NULL,
     4.5,
     220)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 3. 插入优惠券数据
-- =====================================================
INSERT INTO coupons (id, title, amount, type, min_spend, description, is_active) VALUES
    ('22222222-2222-2222-2222-222222222201', 
     '新人礼包', 
     50, 
     'deduction', 
     0, 
     '无门槛积分抵扣券',
     true),
    
    ('22222222-2222-2222-2222-222222222202', 
     '主食专享', 
     100, 
     'deduction', 
     500, 
     '满500积分可用',
     true),
    
    ('22222222-2222-2222-2222-222222222203', 
     '饮品8折', 
     0.8, 
     'discount', 
     0, 
     '所有饮品通用',
     true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 4. 创建演示用户
-- =====================================================
INSERT INTO users (id, name, avatar, level, points) VALUES
    ('33333333-3333-3333-3333-333333333301',
     '美食家小王',
     'https://lh3.googleusercontent.com/aida-public/AB6AXuA9O6BXZ6FFFJfAg6UMY5IHS9wqAf8VZ-AOI3i7A8V4U-KDEkHPWA_imC0LwjSrzipGGVYcuBKlt3SsfZo6KcJ9-aifT8GGh3GDcHn4ycs0OYcsVD08Hs_MgQAf2Byvrm9311TB9RHm2Ye2W_9rIVzlXhzWezs47krd-jGbpiCVO3ofgkXIkrKhDLQGCBJSwnn80qnMxZi3NsAo6DtU0KsgQjAHuHTSKbLIHFDbjFset91GJzQ0XDeoUu1knwN-h_XbOdWT7ca9l3tP',
     '黄金会员',
     2450)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 5. 为演示用户添加初始收藏
-- =====================================================
INSERT INTO favorites (user_id, product_id) VALUES
    ('33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111101'),
    ('33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111104')
ON CONFLICT (user_id, product_id) DO NOTHING;

-- =====================================================
-- 6. 为演示用户添加初始优惠券
-- =====================================================
INSERT INTO user_coupons (user_id, coupon_id, is_used) VALUES
    ('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', false),
    ('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222203', false)
ON CONFLICT (user_id, coupon_id) DO NOTHING;

-- =====================================================
-- 7. 为演示用户添加积分历史
-- =====================================================
INSERT INTO points_transactions (user_id, amount, type, description) VALUES
    ('33333333-3333-3333-3333-333333333301', 50, 'earn', '每日签到'),
    ('33333333-3333-3333-3333-333333333301', -920, 'spend', '订单消费'),
    ('33333333-3333-3333-3333-333333333301', -1450, 'spend', '订单消费');

-- =====================================================
-- 8. 为演示用户添加历史订单
-- =====================================================

-- 订单 1
INSERT INTO orders (id, user_id, status, total_price, discount_amount, final_price, created_at) VALUES
    ('44444444-4444-4444-4444-444444444401',
     '33333333-3333-3333-3333-333333333301',
     'placed',
     450,
     0,
     450,
     NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO order_items (order_id, product_id, quantity, size, price, product_name, product_image) VALUES
    ('44444444-4444-4444-4444-444444444401',
     '11111111-1111-1111-1111-111111111107',
     1,
     'standard',
     450,
     '牛油果酸面包',
     'https://lh3.googleusercontent.com/aida-public/AB6AXuBKeTbBhz8bU1d-txIpLG_wVnQbxAZv2cHvf1X1RW9azOeEhAFr9YloXiLP3jLXD6TFRG7k3L3oFdIhvVrtwu1B5OFytv2qfPL2tMcneuCflHNYfk5gJGvf5BoN9pBlvaT4LjN4E0D-L6ySjWwfI0PBCRwfmrpZMw6SOivNy4N5qTX9YD8eYH2OAlgHeekrv1lkXTzL4rjaIdfmXtt6Z4fW2xYyGqtQKjk7tcSG_WcTQ-wgVD9Bb6KLpg7MJlW-d7azoT7ADl8_Psrc');

-- 订单 2
INSERT INTO orders (id, user_id, status, total_price, discount_amount, final_price, created_at) VALUES
    ('44444444-4444-4444-4444-444444444402',
     '33333333-3333-3333-3333-333333333301',
     'completed',
     850,
     0,
     850,
     NOW() - INTERVAL '7 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO order_items (order_id, product_id, quantity, size, price, product_name, product_image) VALUES
    ('44444444-4444-4444-4444-444444444402',
     '11111111-1111-1111-1111-111111111110',
     1,
     'standard',
     500,
     '招牌红烧牛肉面',
     'https://lh3.googleusercontent.com/aida-public/AB6AXuA68AbrphmeIcs5IgY255szvjGrgUsfugmT_UJasXsznQ4aNaTV1t9bDD2Ndrd5HcKMSQRHunzOUje3PY0c0xJOuUyPZuKlcBtKkFfvSXvC1plMiVNwcenVXbinDlHpE3CJN4B_BIXs4INsJjFpxG6VdH-udllBbXNT5VARZsL171cW1nwA4N-YeON3VK-D7ZTJub1oXJCulStj1BIaSTC6PN1pcm2IovtAt4jZxAbwqsHcKOpEH7Ocnnz5UK3ddEEFHzQVEAvziHJI'),
    ('44444444-4444-4444-4444-444444444402',
     '11111111-1111-1111-1111-111111111109',
     1,
     'standard',
     350,
     '宇治抹茶拿铁',
     'https://lh3.googleusercontent.com/aida-public/AB6AXuBRKiY5SqQECe8sEPOfmnY_AJP7QgYWJZfpXMiwrucsGkhHG-IWwNHVKY-8mTNn0w_ado2b90OPHdhNRz_h6kGBBWF68fsDgIcd_bd4RwdpRUA1umTpSCIsm7XiPiMqsmEU_2a9_7x7LlGmKOxnBMdd7Zox09RdmWrBkRx1N0qOL49RnJVkbY4JmCB7taIj3n7bhN_Zq3eiSXbUYnyMQyIFqcSaPg-NoPDvJmIWy5WxbcqmparP225Dep7KA41EfNLJQCU3gMD8yaDP');

-- 订单 3
INSERT INTO orders (id, user_id, status, total_price, discount_amount, final_price, created_at) VALUES
    ('44444444-4444-4444-4444-444444444403',
     '33333333-3333-3333-3333-333333333301',
     'completed',
     1590,
     0,
     1590,
     NOW() - INTERVAL '10 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO order_items (order_id, product_id, quantity, size, price, product_name, product_image) VALUES
    ('44444444-4444-4444-4444-444444444403',
     '11111111-1111-1111-1111-111111111108',
     2,
     'standard',
     620,
     '意式辣味披萨',
     'https://lh3.googleusercontent.com/aida-public/AB6AXuD7vHz-b0PKqpVpLInvouNDBtgLM5hwMJoyPjngABfq0GOyPyuma9rvBOBM3KotnyocesB2f5QogKI5Cr2HPE3loL9NaNa2wEQTam42fDKP6SlqVUfeaUrb2NvpIzbMWJIxFmvx7aFnOnp_YmJ6M-lAy_X16_iaUqx8qewe8Qwc1_Bingql7efiM7ebH4e-oMyQ5aS3sr8PVBAXxLnjoDsHTBRo8cruc1AQ2bcdiqqlBj4EwG6ZRzBPTUiwOaH1e29ARi7vCChSxsQd'),
    ('44444444-4444-4444-4444-444444444403',
     '11111111-1111-1111-1111-111111111104',
     1,
     'standard',
     350,
     '芒果天堂',
     'https://lh3.googleusercontent.com/aida-public/AB6AXuDcAd2_xhYXJ8ytxT_QPNOr681sY7r-YdTffMcPpOipzZdEEfjumvAewd8sB6hqzduceSLRIlCHN7AcTsKL-eOma--lQA65AfP4jX1SNPKUNVFRx4WRTLqgRlyvjXM6tO9fwM5L75As4dPL9oVBKWqr1O7bligBbWRe4KL9PKlSQnF0f5hfbc2qtdhWA3zwXK4TFyMTYvWXJduHYX35_E89Tya-aj7Ftgw9eUaIz90qFs3o3vmYk1LNXv-av0K2cOZwb1Y_yc4bSgkF');

-- =====================================================
-- 完成提示
-- =====================================================
-- 初始数据导入完成！
-- 演示用户 ID: 33333333-3333-3333-3333-333333333301
-- 用户名: 美食家小王
-- 初始积分: 2450
