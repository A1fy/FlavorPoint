import { Product, Order, Coupon } from './types';

export const CATEGORIES = [
  { id: 'hot', name: '热门', icon: 'local_fire_department' },
  { id: 'main', name: '招牌主食', icon: 'lunch_dining' },
  { id: 'dessert', name: '甜品点心', icon: 'icecream' },
  { id: 'drink', name: '清爽饮品', icon: 'local_cafe' },
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: '香辣金枪鱼波奇饭',
    description: '新鲜捕捞金枪鱼，搭配牛油果、海苔、芝麻及特制香辣酱汁。',
    price: 800,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfSeP2g5-f1choDMJS5k1DZlWmlZoYa3qEbNTDofrrxRxDeaqACC1LOEu1qiA1vTl5h2YgFgwHZNe6JnSSCmt_WnjHog2Xjsnz6dc2cBRekd5_DJHc0mhurJsK8sUye5HMLsMGdfhM4WL0RWD1AhoA2zL5UlxqvlwUx5hk8H-MttHboTVh1z_C_FC1kWcV7v3wkv8GQxMJs9VwH508b4sGevLMfjIHdZGqYyo_u24QinOXPwrHSZY28MnHfzAKn-geoVJh_2LvSW0q',
    category: 'hot',
    tagType: 'hot',
    rating: 4.8,
    calories: 450
  },
  {
    id: '2',
    name: '酸种牛油果吐司',
    description: '每日现烤酸种面包，铺满捣碎的牛油果，点缀微型蔬菜和坚果碎。',
    price: 450,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfpCzbo4TuQgLTzzm5aCnDwZNnixb0uT8WV9_6eFA9r39MfByvHs_ph6BMIWlbRjFxdM4MBj5uigtV4Qca93_ihicTvHjYIcxuT7XyzZwZYvWAsF-Xj4tfQ4fN5mLr4467RT2rOLKZzwBlyNzFIBp_-PKTfBxvLn8SB1ehBZ8CQp-wcYUcG-XEA_VNiqJrBbdpiXe3xn1Mwkl5eU46kP0FQC7rwnB2k6XyueQuKDU2lc4N2G6WDb3U2_mtqBgCJrsC9DS_oFWzx3wX',
    category: 'hot',
    tagType: 'new',
    rating: 4.9,
    calories: 320
  },
  {
    id: '3',
    name: '香烤三文鱼碗',
    description: '富含Omega-3的深海三文鱼，佐以藜麦、羽衣甘蓝和清爽柠檬酱汁。',
    price: 1200,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqIy2kGeLmENUrUQQaeqbKk-nkrD97sYvMF0FDPCmk4ahrk9YwM4VKlVrFKrQAh0dWkwt-A2IEsqr75vrYmPfVL29eqWRPhqhjYN7zMhhPdFape3VwZIOyV6JLyUG4o_byISoDB1tEEOiiB6-zMb3gOAG4wj_nb_rZXR9xeT1nEJ6C1YJlOsFGlvoEb8YAQGyQYhq_08ECzA06l0fHy8kww7bWj-3wvYCzrZvYiVmxA1nu8fB7_-KwtjwW5XgvU1J4OpBtwsq-sauq',
    category: 'main',
    rating: 4.7,
    calories: 550
  },
  {
    id: '4',
    name: '芒果天堂',
    description: '精选当季成熟芒果，混合椰奶，撒上奇亚籽，口感丰富。',
    price: 350,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcAd2_xhYXJ8ytxT_QPNOr681sY7r-YdTffMcPpOipzZdEEfjumvAewd8sB6hqzduceSLRIlCHN7AcTsKL-eOma--lQA65AfP4jX1SNPKUNVFRx4WRTLqgRlyvjXM6tO9fwM5L75As4dPL9oVBKWqr1O7bligBbWRe4KL9PKlSQnF0f5hfbc2qtdhWA3zwXK4TFyMTYvWXJduHYX35_E89Tya-aj7Ftgw9eUaIz90qFs3o3vmYk1LNXv-av0K2cOZwb1Y_yc4bSgkF',
    category: 'dessert',
    rating: 4.6,
    calories: 280
  },
  {
    id: '5',
    name: '经典凯撒沙拉',
    description: '嫩烤鸡胸肉、脆爽罗马生菜、帕尔马干酪片和自制面包丁。',
    price: 650,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgV1P1TaIPACWJLajnG-3RA0AharlAqDWcFCHkOiMtC2EJ4EIyidAkJL1Ch2mDpW5_mLuLcNQ4op2fycjKC0v58gSZdpAtDCAd_SEME0TFz0c9ggUFAcF8mlVhCQdPtCjMjdrEbvaWRdHt1v6fULfbhCLNnRsAgC1Tno7VBg1KzjUzh895_HiMAEpVWSQwKZlZR1WTDnujubXmp9EAOsvJvF5Q_Inv20OHBc4f0jyZltZXwXXfomKnT_TIzjtn6btzjbYi3cjucnSH',
    category: 'main',
    rating: 4.5,
    calories: 380
  },
  {
    id: '6',
    name: '莓果阿萨伊碗',
    description: '巴西莓果泥打底，铺满草莓、蓝莓和香脆麦片，抗氧化首选。',
    price: 550,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWZMWkUuAsZ4Uf4plrirvv_e6IqV-Yxc2EFmfNyHV3Ley9Nh7zcBrtnTGNSqgZ08hjGR1D0RS20qP2EVk_8C9MYq5rAed53zewU0Hm__Cc06dnVoOdM3C9hxg8jDWdO-A4EP-rAQEAglz8qxyri3k7wZmd8m7T1WN0clNbt-alPhiG5Ippwt-n8KsKakxzQBtRdiyCJPjwQGNU2p6NRU3EnNpHyQCKDGZcmefvBXjaGGbjXza3USttDBqfNCAGsS7Ggv_4Y5vc3FCT',
    category: 'dessert',
    rating: 4.8,
    calories: 310
  },
  {
    id: '7',
    name: '牛油果酸面包',
    description: '新鲜酵母面包，配以流心水波蛋和特制香草酱。',
    price: 450,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKeTbBhz8bU1d-txIpLG_wVnQbxAZv2cHvf1X1RW9azOeEhAFr9YloXiLP3jLXD6TFRG7k3L3oFdIhvVrtwu1B5OFytv2qfPL2tMcneuCflHNYfk5gJGvf5BoN9pBlvaT4LjN4E0D-L6ySjWwfI0PBCRwfmrpZMw6SOivNy4N5qTX9YD8eYH2OAlgHeekrv1lkXTzL4rjaIdfmXtt6Z4fW2xYyGqtQKjk7tcSG_WcTQ-wgVD9Bb6KLpg7MJlW-d7azoT7ADl8_Psrc',
    category: 'main',
    rating: 4.7,
    calories: 340
  },
  {
    id: '8',
    name: '意式辣味披萨',
    description: '经典意式薄底，撒满马苏里拉芝士和辣味香肠。',
    price: 620,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7vHz-b0PKqpVpLInvouNDBtgLM5hwMJoyPjngABfq0GOyPyuma9rvBOBM3KotnyocesB2f5QogKI5Cr2HPE3loL9NaNa2wEQTam42fDKP6SlqVUfeaUrb2NvpIzbMWJIxFmvx7aFnOnp_YmJ6M-lAy_X16_iaUqx8qewe8Qwc1_Bingql7efiM7ebH4e-oMyQ5aS3sr8PVBAXxLnjoDsHTBRo8cruc1AQ2bcdiqqlBj4EwG6ZRzBPTUiwOaH1e29ARi7vCChSxsQd',
    category: 'main',
    rating: 4.6,
    calories: 780
  },
  {
    id: '9',
    name: '宇治抹茶拿铁',
    description: '选用特级抹茶粉，搭配香浓鲜奶，口感丝滑浓郁。',
    price: 350,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRKiY5SqQECe8sEPOfmnY_AJP7QgYWJZfpXMiwrucsGkhHG-IWwNHVKY-8mTNn0w_ado2b90OPHdhNRz_h6kGBBWF68fsDgIcd_bd4RwdpRUA1umTpSCIsm7XiPiMqsmEU_2a9_7x7LlGmKOxnBMdd7Zox09RdmWrBkRx1N0qOL49RnJVkbY4JmCB7taIj3n7bhN_Zq3eiSXbUYnyMQyIFqcSaPg-NoPDvJmIWy5WxbcqmparP225Dep7KA41EfNLJQCU3gMD8yaDP',
    category: 'drink',
    rating: 4.5,
    calories: 220
  },
  {
    id: '10',
    name: '招牌红烧牛肉面',
    description: '八小时慢炖牛腱，汤浓肉烂，面条劲道。',
    price: 500,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA68AbrphmeIcs5IgY255szvjGrgUsfugmT_UJasXsznQ4aNaTV1t9bDD2Ndrd5HcKMSQRHunzOUje3PY0c0xJOuUyPZuKlcBtKkFfvSXvC1plMiVNwcenVXbinDlHpE3CJN4B_BIXs4INsJjFpxG6VdH-udllBbXNT5VARZsL171cW1nwA4N-YeON3VK-D7ZTJub1oXJCulStj1BIaSTC6PN1pcm2IovtAt4jZxAbwqsHcKOpEH7Ocnnz5UK3ddEEFHzQVEAvziHJI',
    category: 'main',
    rating: 4.9,
    calories: 650
  },
  {
    id: '11',
    name: '草莓千层蛋糕',
    description: '时令有机草莓，每日限量供应，酸甜适中。',
    price: 380,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvTTmbqJofnTF-RTX0IKoJsN8S_1BXyCApFsV4ArbvmIsN_9XjamAxeeEEb88ihkLTBU25JmhnxTwlgolH6O25O8kMUQIkDxDso5xPP_nrl6TVuJjZ-lqSjjPzoBNwAAOxOXYJsA0CKFxOaptxv8bLo6OwQ75mA2TyldfZNFZhVoSdj07QYd77BpcgpJOzIJ6Irs6l3gBxb7n6CVurtdpqP0upW3Aj-8IbaL77PlM35h_qPvwStXIIH0ET05vtLrpRrvbxe5g89Ty8',
    category: 'dessert',
    tagType: 'sold-out',
    rating: 4.8,
    calories: 420
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-2023-001',
    date: '10月24日 12:30',
    status: 'placed',
    totalPrice: 850,
    finalPrice: 850,
    items: [
      { product: PRODUCTS[6], quantity: 1, size: 'standard', currentPrice: PRODUCTS[6].price } // 牛油果酸面包
    ]
  },
  {
    id: 'ORD-2023-002',
    date: '10月20日 18:45',
    status: 'completed',
    totalPrice: 920,
    finalPrice: 920,
    items: [
      { product: PRODUCTS[9], quantity: 1, size: 'standard', currentPrice: PRODUCTS[9].price }, // 牛肉面
      { product: PRODUCTS[8], quantity: 1, size: 'standard', currentPrice: PRODUCTS[8].price }  // 抹茶拿铁
    ]
  },
  {
    id: 'ORD-2023-003',
    date: '10月18日 11:15',
    status: 'completed',
    totalPrice: 1450,
    finalPrice: 1450,
    items: [
      { product: PRODUCTS[7], quantity: 2, size: 'standard', currentPrice: PRODUCTS[7].price }, // 披萨
      { product: PRODUCTS[3], quantity: 1, size: 'standard', currentPrice: PRODUCTS[3].price }  // 芒果天堂
    ]
  }
];

export const AVAILABLE_COUPONS: Coupon[] = [
    { id: 'c1', title: '新人礼包', amount: 50, type: 'deduction', description: '无门槛积分抵扣券' },
    { id: 'c2', title: '主食专享', amount: 100, type: 'deduction', minSpend: 500, description: '满500积分可用' },
    { id: 'c3', title: '饮品8折', amount: 0.8, type: 'discount', description: '所有饮品通用' },
];

export const MY_COUPONS: Coupon[] = [
    { id: 'mc1', title: '新人礼包', amount: 50, type: 'deduction', description: '无门槛积分抵扣券' },
    { id: 'mc2', title: '咖啡券', amount: 30, type: 'deduction', description: '仅限咖啡类饮品' },
];
