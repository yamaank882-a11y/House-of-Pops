import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  DatabaseSchema,
  Product,
  User,
  Order,
  OrderStatus,
  RetailStore,
  Campaign,
  Subscription,
  UserReward,
  SupportTicket,
  CorporateLead,
  ProductReview,
  AuditLog,
} from './types.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'houseofpops.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Simple deterministic hash for password authentication (SHA-256 with salt)
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_HOP_SALT_2026').digest('hex');
}

// Initial Seed Data with Real Artisanal UAE Products & Stores
const SEED_PRODUCTS: Product[] = [
  {
    id: 'pop-mango-passion',
    slug: 'mighty-mango-passion',
    name: 'Mighty Mango & Passion Fruit',
    nameAr: 'مانجو وباشن فروت طبيعي',
    category: 'Fruit Pops',
    price: 20,
    description: '100% real ripe Alfonso mango blended with tangy passion fruit seeds. Zero added sugar, no concentrates, purely squeezed tropical richness.',
    descriptionAr: 'مانجو ألفونسو ناضج ١٠٠٪ مع بذور فاكهة الباشن المنعشة. بدون سكر مضاف، خالٍ من النكهات الصناعية.',
    image: '/src/assets/images/pop_mango_passion_1790195037888.jpg',
    ingredients: ['Fresh Alfonso Mango Puree (72%)', 'Passion Fruit Juice & Pulp (18%)', 'Filtered Water', 'Natural Agave Nectar', 'Fresh Lime Juice'],
    allergens: ['None'],
    dietaryTags: ['100% Natural', 'Plant-Based / Vegan', 'No Added Sugar', 'Gluten Free', 'Non-GMO'],
    nutrition: {
      servingSize: '80g (1 Pop)',
      calories: 68,
      totalFatG: 0.2,
      saturatedFatG: 0.0,
      carbsG: 16.5,
      sugarsG: 14.2,
      fiberG: 2.1,
      proteinG: 0.8,
      sodiumMg: 3,
    },
    stockQuantity: 120,
    reservedStock: 0,
    inStock: true,
    isFeatured: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 142,
  },
  {
    id: 'pop-choco-hazelnut',
    slug: 'creamy-choco-hazelnut',
    name: 'Artisan Choco Hazelnut Crunch',
    nameAr: 'شوكولاتة بندق كريمية نباتية',
    category: 'Creamy Pops',
    price: 25,
    description: 'Decadent single-origin Belgian cocoa folded into rich coconut cream, hand-dipped in roasted crushed Mediterranean hazelnuts.',
    descriptionAr: 'كاكاو بلجيكي فاخر مخلوط مع كريمة جوز الهند الطبيعية ومغطى بقطع البندق المحمص والمقرمش.',
    image: '/src/assets/images/pop_choco_hazelnut_1790195055104.jpg',
    ingredients: ['Coconut Milk Cream (54%)', 'Fairtrade Single-Origin Cocoa (16%)', 'Roasted Hazelnuts (14%)', 'Date Syrup (12%)', 'Madagascar Vanilla Bean', 'Sea Salt'],
    allergens: ['Tree Nuts (Hazelnuts)'],
    dietaryTags: ['Plant-Based / Vegan', 'Dairy Free', 'Refined Sugar Free', 'Keto Friendly', 'Gluten Free'],
    nutrition: {
      servingSize: '85g (1 Pop)',
      calories: 142,
      totalFatG: 8.5,
      saturatedFatG: 4.2,
      carbsG: 13.0,
      sugarsG: 9.5,
      fiberG: 3.2,
      proteinG: 2.9,
      sodiumMg: 15,
    },
    stockQuantity: 95,
    reservedStock: 0,
    inStock: true,
    isFeatured: true,
    isBestSeller: true,
    rating: 5.0,
    reviewCount: 98,
  },
  {
    id: 'pop-raspberry-hibiscus',
    slug: 'wild-raspberry-hibiscus',
    name: 'Wild Raspberry & Hibiscus Infusion',
    nameAr: 'توت العليق وزهور الكركديه',
    category: 'Fruit Pops',
    price: 20,
    description: 'Hand-picked alpine raspberries cold-pressed with brewed ruby red Egyptian hibiscus tea. Antioxidant powerhouse with vibrant floral tartness.',
    descriptionAr: 'توت بري طازج مع شاي الكركديه المركز والغني بمضادات الأكسدة. نكهة منعشة ورائحة زهرية ساحرة.',
    image: '/src/assets/images/hero_house_of_pops_1790195019900.jpg',
    ingredients: ['Wild Raspberry Puree (68%)', 'Brewed Hibiscus Infusion (22%)', 'White Grape Juice Reduction', 'Organic Lemon Zest'],
    allergens: ['None'],
    dietaryTags: ['100% Natural', 'Plant-Based / Vegan', 'Antioxidant Rich', 'Gluten Free'],
    nutrition: {
      servingSize: '80g (1 Pop)',
      calories: 54,
      totalFatG: 0.1,
      saturatedFatG: 0.0,
      carbsG: 12.8,
      sugarsG: 10.4,
      fiberG: 3.8,
      proteinG: 0.6,
      sodiumMg: 2,
    },
    stockQuantity: 110,
    reservedStock: 0,
    inStock: true,
    isFeatured: true,
    isBestSeller: false,
    rating: 4.8,
    reviewCount: 64,
  },
  {
    id: 'pop-coconut-strawberry',
    slug: 'coconut-strawberry-swirl',
    name: 'Velvet Coconut & Strawberry Swirl',
    nameAr: 'جوز هند كريمي مع الفراولة الطازجة',
    category: 'Creamy Pops',
    price: 22,
    description: 'Creamy cold-pressed coconut milk paired in dual layers with sun-ripened Mediterranean strawberries. Silky texture with zero dairy.',
    descriptionAr: 'طبقات متناغمة من حليب جوز الهند الكريمي وفراولة البحر المتوسط العضوية.',
    image: '/src/assets/images/pop_box_assorted_1790195069629.jpg',
    ingredients: ['Cold-Pressed Coconut Milk (50%)', 'Fresh Strawberry Puree (35%)', 'Organic Agave', 'Pectin', 'Pinch of Himalayan Pink Salt'],
    allergens: ['None'],
    dietaryTags: ['100% Plant-Based', 'Dairy Free', 'Gluten Free', 'Clean Label'],
    nutrition: {
      servingSize: '85g (1 Pop)',
      calories: 98,
      totalFatG: 4.8,
      saturatedFatG: 3.8,
      carbsG: 12.2,
      sugarsG: 9.8,
      fiberG: 1.8,
      proteinG: 1.1,
      sodiumMg: 8,
    },
    stockQuantity: 88,
    reservedStock: 0,
    inStock: true,
    isFeatured: false,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 115,
  },
  {
    id: 'pop-lemon-mint',
    slug: 'sunshine-lemon-fresh-mint',
    name: 'Zesty Lemon & Fresh Garden Mint',
    nameAr: 'ليمون منعش مع النعناع الأخضر',
    category: 'Fruit Pops',
    price: 18,
    description: 'Freshly squeezed Sicilian lemons crushed with aromatic mint leaves. The ultimate cooling treat for sun-drenched UAE afternoons.',
    descriptionAr: 'عصير ليمون صقلي طازج مع أوراق النعناع الخضراء. الانتعاش الأمثل للأجواء الحارة.',
    image: '/src/assets/images/pop_mango_passion_1790195037888.jpg',
    ingredients: ['Fresh Lemon Juice (38%)', 'Fresh Garden Mint Extract (12%)', 'Water', 'Organic Cane Juice', 'Lemon Zest'],
    allergens: ['None'],
    dietaryTags: ['100% Natural', 'Plant-Based / Vegan', 'Hydrating', 'Low Calorie', 'Gluten Free'],
    nutrition: {
      servingSize: '80g (1 Pop)',
      calories: 42,
      totalFatG: 0.0,
      saturatedFatG: 0.0,
      carbsG: 10.5,
      sugarsG: 8.8,
      fiberG: 0.5,
      proteinG: 0.3,
      sodiumMg: 1,
    },
    stockQuantity: 75,
    reservedStock: 0,
    inStock: true,
    isFeatured: false,
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 43,
  },
  {
    id: 'pop-salted-caramel',
    slug: 'creamy-salted-caramel-pecan',
    name: 'Plant-Based Salted Caramel & Pecan',
    nameAr: 'كراميل مملح مع جوز البيكان',
    category: 'Creamy Pops',
    price: 25,
    description: 'Slow-simmered date caramel with rich cashew milk base, sprinkled with fleur de sel and toasted buttery pecans.',
    descriptionAr: 'كراميل طبيعي مصنوع من التمر مع حليب الكاجو ولمسة ملح البحر الفرنسي وجوز البيكان المحمص.',
    image: '/src/assets/images/pop_choco_hazelnut_1790195055104.jpg',
    ingredients: ['Raw Cashew Milk (48%)', 'Medjool Date Puree (28%)', 'Toasted Pecans (12%)', 'Coconut Butter', 'Fleur de Sel Salt'],
    allergens: ['Tree Nuts (Cashews, Pecans)'],
    dietaryTags: ['Plant-Based / Vegan', 'Dairy Free', 'Refined Sugar Free'],
    nutrition: {
      servingSize: '85g (1 Pop)',
      calories: 155,
      totalFatG: 9.2,
      saturatedFatG: 3.5,
      carbsG: 14.8,
      sugarsG: 11.2,
      fiberG: 2.8,
      proteinG: 3.1,
      sodiumMg: 45,
    },
    stockQuantity: 60,
    reservedStock: 0,
    inStock: true,
    isFeatured: false,
    isBestSeller: true,
    rating: 4.95,
    reviewCount: 82,
  },
  {
    id: 'pop-dragonfruit-lychee',
    slug: 'exotic-dragonfruit-lychee',
    name: 'Exotic Pink Dragonfruit & Lychee',
    nameAr: 'دراغون فروت الوردي مع الليتشي',
    category: 'Special Edition',
    price: 24,
    description: 'Vibrant magenta pitaya blended with sweet white lychees and a hint of cold-pressed ginger. Limited seasonal release.',
    descriptionAr: 'دراغون فروت فاقع مع حبات الليتشي العذبة ولمسة زنجبيل بارد. إصدار موسمي خاص.',
    image: '/src/assets/images/pop_box_assorted_1790195069629.jpg',
    ingredients: ['Red Pitaya Dragonfruit (55%)', 'Lychee Puree (35%)', 'Cold-Pressed Ginger (2%)', 'Agave', 'Lime Juice'],
    allergens: ['None'],
    dietaryTags: ['Seasonal Limited', '100% Natural', 'Vegan', 'Superfood', 'Gluten Free'],
    nutrition: {
      servingSize: '80g (1 Pop)',
      calories: 62,
      totalFatG: 0.1,
      saturatedFatG: 0.0,
      carbsG: 15.1,
      sugarsG: 12.8,
      fiberG: 2.9,
      proteinG: 0.9,
      sodiumMg: 2,
    },
    stockQuantity: 40,
    reservedStock: 0,
    inStock: true,
    isFeatured: true,
    isBestSeller: false,
    rating: 4.9,
    reviewCount: 51,
  },
  {
    id: 'pop-matcha-pistachio',
    slug: 'ceremonial-matcha-pistachio',
    name: 'Ceremonial Matcha & Bronte Pistachio',
    nameAr: 'ماتشا احتفالية مع فستق حلبي',
    category: 'Special Edition',
    price: 26,
    description: 'First-harvest Uji ceremonial matcha infused into rich almond milk, rolled in crushed emerald pistachio nuts.',
    descriptionAr: 'شاي ماتشا ياباني فاخر ممزوج بحليب اللوز الطبيعي ومزين بالفستق الحلبي الأخضر.',
    image: '/src/assets/images/pop_choco_hazelnut_1790195055104.jpg',
    ingredients: ['Almond Cream (52%)', 'Organic Uji Ceremonial Matcha (6%)', 'Crushed Pistachios (16%)', 'Raw Agave', 'Vanilla Extract'],
    allergens: ['Tree Nuts (Almonds, Pistachios)'],
    dietaryTags: ['Antioxidant Rich', 'Plant-Based / Vegan', 'Dairy Free'],
    nutrition: {
      servingSize: '85g (1 Pop)',
      calories: 138,
      totalFatG: 7.9,
      saturatedFatG: 2.1,
      carbsG: 12.5,
      sugarsG: 8.9,
      fiberG: 3.1,
      proteinG: 3.4,
      sodiumMg: 12,
    },
    stockQuantity: 35,
    reservedStock: 0,
    inStock: true,
    isFeatured: false,
    isBestSeller: false,
    rating: 4.85,
    reviewCount: 39,
  }
];

const SEED_STORES: RetailStore[] = [
  {
    id: 'store-dubai-mall',
    name: 'House of Pops — The Dubai Mall',
    nameAr: 'هاوس أوف بوبس — دبي مول',
    emirate: 'Dubai',
    area: 'Downtown Dubai',
    locationDetails: 'Ground Floor, Near Dubai Aquarium & Underwater Zoo Promenade',
    openingHours: 'Sun - Thu: 10:00 AM - 11:00 PM | Fri - Sat: 10:00 AM - Midnight',
    phone: '+971 4 362 7500',
    lat: 25.1972,
    lng: 55.2744,
    image: '/src/assets/images/store_kiosk_dubai_1790195084066.jpg',
    hasPickup: true,
  },
  {
    id: 'store-kite-beach',
    name: 'House of Pops — Kite Beach Boardwalk',
    nameAr: 'هاوس أوف بوبس — كايت بيتش ممشى الشاطئ',
    emirate: 'Dubai',
    area: 'Jumeirah',
    locationDetails: 'Kite Beach Kiosk #7, 2C Street, Near Volleyball Courts',
    openingHours: 'Daily: 9:00 AM - Midnight',
    phone: '+971 58 592 1088',
    lat: 25.1633,
    lng: 55.2076,
    image: '/src/assets/images/store_kiosk_dubai_1790195084066.jpg',
    hasPickup: true,
  },
  {
    id: 'store-bluewaters',
    name: 'House of Pops — Bluewaters Island',
    nameAr: 'هاوس أوف بوبس — جزيرة بلوواترز',
    emirate: 'Dubai',
    area: 'Dubai Marina / JBR',
    locationDetails: 'Waterfront Esplanade, Facing Ain Dubai Plaza',
    openingHours: 'Sun - Thu: 11:00 AM - 11:00 PM | Fri - Sat: 11:00 AM - Midnight',
    phone: '+971 4 399 9033',
    lat: 25.0792,
    lng: 55.1222,
    image: '/src/assets/images/store_kiosk_dubai_1790195084066.jpg',
    hasPickup: true,
  },
  {
    id: 'store-yas-mall',
    name: 'House of Pops — Yas Mall Abu Dhabi',
    nameAr: 'هاوس أوف بوبس — ياس مول أبوظبي',
    emirate: 'Abu Dhabi',
    area: 'Yas Island',
    locationDetails: 'First Floor, Fashion Avenue Atrium',
    openingHours: 'Sun - Thu: 10:00 AM - 10:00 PM | Fri - Sat: 10:00 AM - Midnight',
    phone: '+971 2 414 6401',
    lat: 24.4883,
    lng: 54.6074,
    image: '/src/assets/images/store_kiosk_dubai_1790195084066.jpg',
    hasPickup: true,
  },
  {
    id: 'store-al-qana',
    name: 'House of Pops — Al Qana Marina',
    nameAr: 'هاوس أوف بوبس — القناة مارينا أبوظبي',
    emirate: 'Abu Dhabi',
    area: 'Rabdan',
    locationDetails: 'South Marina Promenade, Unit G-12',
    openingHours: 'Daily: 10:00 AM - 11:00 PM',
    phone: '+971 2 555 4910',
    lat: 24.4172,
    lng: 54.4921,
    image: '/src/assets/images/store_kiosk_dubai_1790195084066.jpg',
    hasPickup: true,
  }
];

const SEED_CAMPAIGNS: Campaign[] = [
  {
    id: 'campaign-uae-heat',
    title: 'Feeling The UAE Heat? Cool Down 100% Naturally',
    titleAr: 'تشعر بحرارة الصيف؟ انتعش طبيعياً ١٠٠٪ مع بوبس طازجة',
    subtitle: 'Cold-pressed pure tropical fruits delivered to your doorstep in sub-zero frozen biodegradable packs across UAE.',
    subtitleAr: 'فواكه استوائية طبيعية مثلجة معصورة على البارد تصلك في عبوات تبريد مستدامة.',
    badge: 'UAE Summer Refresh',
    ctaText: 'Build Your Custom Box',
    ctaLink: '/build-box',
    weatherCondition: 'HOT',
    temperatureThresholdC: 36,
    active: true,
  },
  {
    id: 'campaign-eco-recycle',
    title: 'Return 10 Sticks & Wrappers, Get 1 Free Pop',
    titleAr: 'أعد ١٠ أعواد وأغلفة بيئية واحصل على بوب مجاني',
    subtitle: 'Our zero-plastic guarantee: Drop your biodegradable wrappers at any House of Pops kiosk to earn 100 EcoPoints.',
    subtitleAr: 'ضمان الاستدامة الخالي من البلاستيك: سلّم الأغلفة في أي فرع واكسب نقاط بيئية فورية.',
    badge: 'Eco Rewards 2026',
    ctaText: 'Discover Eco Rewards',
    ctaLink: '/rewards',
    weatherCondition: 'ANY',
    active: true,
  }
];

// Initial default database structure
function getInitialDatabase(): DatabaseSchema {
  const adminId = 'user-admin-01';
  const customerId = 'user-customer-01';

  const defaultUsers: User[] = [
    {
      id: adminId,
      email: 'admin@houseofpops.ae',
      passwordHash: hashPassword('AdminPops2026!'),
      name: 'Operations Director',
      phone: '+971 50 123 4567',
      role: 'admin',
      createdAt: new Date('2026-01-10T08:00:00Z').toISOString(),
    },
    {
      id: customerId,
      email: 'guest@houseofpops.ae',
      passwordHash: hashPassword('Customer2026!'),
      name: 'Fatima Al Mansoori',
      phone: '+971 52 987 6543',
      role: 'customer',
      createdAt: new Date('2026-02-15T10:30:00Z').toISOString(),
    }
  ];

  return {
    users: defaultUsers,
    userProfiles: [
      {
        id: 'prof-01',
        userId: customerId,
        preferredLanguage: 'en',
        preferredEmirate: 'Dubai',
        marketingConsent: true,
        packagingReturnsCount: 14,
      }
    ],
    addresses: [
      {
        id: 'addr-01',
        userId: customerId,
        title: 'Home Villa',
        emirate: 'Dubai',
        area: 'Al Wasl / Jumeirah 2',
        street: 'Street 14B',
        building: 'Villa 28',
        apartment: 'Villa',
        notes: 'Ring doorbell, leave in shade if not home',
        isDefault: true,
      }
    ],
    products: SEED_PRODUCTS,
    orders: [
      {
        id: 'ord-1001',
        orderNumber: 'HOP-2026-8491',
        userId: customerId,
        customerName: 'Fatima Al Mansoori',
        customerEmail: 'guest@houseofpops.ae',
        customerPhone: '+971 52 987 6543',
        fulfillmentType: 'DELIVERY',
        items: [
          {
            id: 'item-1',
            type: 'custom_box',
            productName: '10-Pop Family Happiness Box',
            productImage: '/src/assets/images/pop_box_assorted_1790195069629.jpg',
            boxSize: 10,
            boxItems: [
              { productId: 'pop-mango-passion', productName: 'Mighty Mango & Passion Fruit', quantity: 4, image: '/src/assets/images/pop_mango_passion_1790195037888.jpg' },
              { productId: 'pop-choco-hazelnut', productName: 'Artisan Choco Hazelnut Crunch', quantity: 3, image: '/src/assets/images/pop_choco_hazelnut_1790195055104.jpg' },
              { productId: 'pop-raspberry-hibiscus', productName: 'Wild Raspberry & Hibiscus', quantity: 3, image: '/src/assets/images/hero_house_of_pops_1790195019900.jpg' }
            ],
            quantity: 1,
            unitPrice: 187,
            totalPrice: 187,
          }
        ],
        subtotal: 220,
        discount: 33, // 15% box discount
        promoCode: 'NATURAL15',
        deliveryFee: 0,
        total: 187,
        currency: 'AED',
        status: 'OUT_FOR_DELIVERY',
        paymentStatus: 'PAID',
        paymentMethod: 'apple_pay',
        deliveryAddress: {
          emirate: 'Dubai',
          area: 'Al Wasl / Jumeirah 2',
          street: 'Street 14B',
          building: 'Villa 28',
          apartment: 'Villa',
          notes: 'Ring doorbell, sub-zero courier box is ready',
        },
        deliverySlot: 'Today, 2:00 PM - 5:00 PM',
        statusHistory: [
          { status: 'ORDER_PLACED', note: 'Order placed by customer via PWA', timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString() },
          { status: 'PAYMENT_CONFIRMED', note: 'Apple Pay transaction approved', timestamp: new Date(Date.now() - 3600000 * 2.3).toISOString() },
          { status: 'PREPARING', note: 'Frozen dry-ice thermal insulation packed at Al Quoz cold center', timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString() },
          { status: 'READY', note: 'Dispatched to refrigerated delivery van #14', timestamp: new Date(Date.now() - 3600000 * 0.8).toISOString() },
          { status: 'OUT_FOR_DELIVERY', note: 'Courier Rashid is on his way (van temperature: -18°C)', timestamp: new Date(Date.now() - 3600000 * 0.2).toISOString() }
        ],
        driverNotes: 'Rashid (Cold Fleet 08) - ETA 25 mins',
        createdAt: new Date(Date.now() - 3600000 * 2.5).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 0.2).toISOString(),
      }
    ],
    subscriptions: [
      {
        id: 'sub-01',
        userId: customerId,
        customerName: 'Fatima Al Mansoori',
        customerEmail: 'guest@houseofpops.ae',
        planFrequency: 'BIWEEKLY',
        boxSize: 10,
        boxItems: [
          { productId: 'pop-mango-passion', productName: 'Mighty Mango & Passion Fruit', quantity: 4, image: '/src/assets/images/pop_mango_passion_1790195037888.jpg' },
          { productId: 'pop-choco-hazelnut', productName: 'Artisan Choco Hazelnut Crunch', quantity: 3, image: '/src/assets/images/pop_choco_hazelnut_1790195055104.jpg' },
          { productId: 'pop-coconut-strawberry', productName: 'Velvet Coconut Strawberry', quantity: 3, image: '/src/assets/images/pop_box_assorted_1790195069629.jpg' }
        ],
        status: 'ACTIVE',
        nextDeliveryDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
        deliveryAddress: {
          emirate: 'Dubai',
          area: 'Al Wasl / Jumeirah 2',
          street: 'Street 14B',
          building: 'Villa 28',
          apartment: 'Villa',
        },
        deliverySlot: 'Morning (10:00 AM - 1:00 PM)',
        pricePerDelivery: 187,
        discountPercent: 15,
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ],
    rewards: [
      {
        userId: customerId,
        currentPoints: 480,
        lifetimePoints: 720,
        tier: 'Bloom',
        transactions: [
          { id: 'tx-1', userId: customerId, points: 200, type: 'EARNED_ORDER', description: 'Order #HOP-2026-8491 Points', createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
          { id: 'tx-2', userId: customerId, points: 140, type: 'EARNED_RECYCLE', description: 'Returned 14 biodegradable sticks to Dubai Mall Kiosk', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
          { id: 'tx-3', userId: customerId, points: 140, type: 'EARNED_ORDER', description: 'Bi-weekly subscription renewal reward', createdAt: new Date(Date.now() - 86400000 * 1).toISOString() }
        ]
      }
    ],
    stores: SEED_STORES,
    campaigns: SEED_CAMPAIGNS,
    supportTickets: [
      {
        id: 'tkt-101',
        ticketNumber: 'TKT-821',
        userId: customerId,
        customerName: 'Fatima Al Mansoori',
        customerEmail: 'guest@houseofpops.ae',
        subject: 'Inquiry regarding corporate catering for office wellness week',
        status: 'IN_PROGRESS',
        messages: [
          {
            id: 'm1',
            sender: 'customer',
            senderName: 'Fatima Al Mansoori',
            message: 'Hello, our team in Dubai Media City is hosting an organic wellness day next Tuesday. Do you offer the branded wooden pop cart with an attendant?',
            timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
          },
          {
            id: 'm2',
            sender: 'agent',
            senderName: 'House of Pops Concierge',
            message: 'Hello Fatima! Yes indeed. Our artisanal pop cart package includes dry-ice display, server attendant, and custom flavor menu for up to 250 guests. We would be thrilled to bring it over!',
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          }
        ],
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      }
    ],
    corporateLeads: [
      {
        id: 'lead-01',
        company: 'Emirates NBD Innovation Hub',
        contactName: 'Sultan Al Qasimi',
        email: 'sultan.q@emiratesnbd.com',
        phone: '+971 50 442 8119',
        eventDate: '2026-10-15',
        quantity: '300-500 Pops',
        location: 'DIFC Gate Avenue, Dubai',
        requirements: 'Branded eco-cart with vegan & refined sugar-free fruit pops for tech summit keynote.',
        status: 'PROPOSAL_SENT',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      }
    ],
    reviews: [
      {
        id: 'rev-01',
        productId: 'pop-mango-passion',
        userId: customerId,
        userName: 'Fatima Al Mansoori',
        rating: 5,
        comment: 'Tastes exactly like real fresh ripe mango with the perfect crunch of passionfruit seeds. So grateful there is zero artificial syrup or refined sugar!',
        verifiedPurchase: true,
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      },
      {
        id: 'rev-02',
        productId: 'pop-choco-hazelnut',
        userId: 'user-02',
        userName: 'Alexandre Moreau',
        rating: 5,
        comment: 'Unbelievably creamy for a dairy-free pop. The roasted hazelnut coating gives it a luxury gelato taste. Delivered ice-cold in 40 minutes.',
        verifiedPurchase: true,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      }
    ],
    auditLogs: [
      {
        id: 'log-01',
        actorId: adminId,
        actorRole: 'admin',
        action: 'INVENTORY_INITIALIZE',
        entity: 'inventory',
        entityId: 'all',
        details: 'Initial inventory stock counts committed to Al Quoz fulfillment hub.',
        timestamp: new Date('2026-02-01T08:00:00Z').toISOString(),
      }
    ]
  };
}

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Failed reading database file, using initial seed:', err);
    }
    const initial = getInitialDatabase();
    this.saveData(initial);
    return initial;
  }

  // Atomic write to prevent race conditions or corrupted JSON
  public saveData(dataToSave?: DatabaseSchema): void {
    if (dataToSave) {
      this.data = dataToSave;
    }
    const tempFile = `${DATA_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);
  }

  public getRawData(): DatabaseSchema {
    return this.data;
  }

  // Users
  public findUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public createUser(user: User): User {
    this.data.users.push(user);
    // Create initial user reward profile
    this.data.rewards.push({
      userId: user.id,
      currentPoints: 100, // 100 bonus welcome points
      lifetimePoints: 100,
      tier: 'Sprout',
      transactions: [
        {
          id: `tx-${Date.now()}`,
          userId: user.id,
          points: 100,
          type: 'EARNED_REFERRAL',
          description: 'Welcome to House of Pops Rewards',
          createdAt: new Date().toISOString(),
        }
      ]
    });
    this.saveData();
    return user;
  }

  // Products & Inventory
  public getProducts(): Product[] {
    return this.data.products;
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find((p) => p.id === id || p.slug === id);
  }

  public updateProduct(id: string, updates: Partial<Product>, actorId: string): Product | null {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const old = this.data.products[idx];
    const updated = { ...old, ...updates };
    this.data.products[idx] = updated;

    this.logAudit({
      actorId,
      actorRole: 'admin',
      action: 'UPDATE_PRODUCT',
      entity: 'products',
      entityId: id,
      details: `Updated product ${old.name} (price: ${updated.price}, stock: ${updated.stockQuantity})`
    });

    this.saveData();
    return updated;
  }

  public adjustStock(productId: string, delta: number, actorId: string, reason: string): Product | null {
    const product = this.getProductById(productId);
    if (!product) return null;
    const newStock = Math.max(0, product.stockQuantity + delta);
    product.stockQuantity = newStock;
    product.inStock = newStock > 0;

    this.logAudit({
      actorId,
      actorRole: 'admin',
      action: 'STOCK_ADJUSTMENT',
      entity: 'inventory',
      entityId: productId,
      details: `${delta >= 0 ? '+' : ''}${delta} stock units for ${product.name}. New: ${newStock}. Reason: ${reason}`
    });

    this.saveData();
    return product;
  }

  // Orders
  public getOrders(userId?: string): Order[] {
    if (userId) {
      return this.data.orders
        .filter((o) => o.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return this.data.orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  public createOrder(order: Order): Order {
    // Deduct stock for all items
    order.items.forEach((item) => {
      if (item.type === 'single' && item.productId) {
        const prod = this.getProductById(item.productId);
        if (prod) {
          prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
          prod.inStock = prod.stockQuantity > 0;
        }
      } else if (item.type === 'custom_box' && item.boxItems) {
        item.boxItems.forEach((boxItem) => {
          const prod = this.getProductById(boxItem.productId);
          if (prod) {
            prod.stockQuantity = Math.max(0, prod.stockQuantity - boxItem.quantity * item.quantity);
            prod.inStock = prod.stockQuantity > 0;
          }
        });
      }
    });

    // Add reward points for registered users (1 AED = 1 point)
    const pointsToEarn = Math.floor(order.total);
    const userReward = this.data.rewards.find((r) => r.userId === order.userId);
    if (userReward) {
      userReward.currentPoints += pointsToEarn;
      userReward.lifetimePoints += pointsToEarn;
      userReward.transactions.unshift({
        id: `tx-${Date.now()}`,
        userId: order.userId,
        points: pointsToEarn,
        type: 'EARNED_ORDER',
        description: `Earned from Order #${order.orderNumber}`,
        createdAt: new Date().toISOString(),
      });
      // Tier upgrade check
      if (userReward.lifetimePoints >= 1000) {
        userReward.tier = 'EcoChampion';
      } else if (userReward.lifetimePoints >= 400) {
        userReward.tier = 'Bloom';
      }
    }

    this.data.orders.unshift(order);
    this.logAudit({
      actorId: order.userId,
      actorRole: 'customer',
      action: 'ORDER_PLACED',
      entity: 'orders',
      entityId: order.id,
      details: `New order ${order.orderNumber} placed. Total: AED ${order.total}`
    });

    this.saveData();
    return order;
  }

  public updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    note: string,
    actorId: string
  ): Order | null {
    const order = this.getOrderById(orderId);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    order.statusHistory.push({
      status,
      note,
      timestamp: new Date().toISOString(),
    });

    this.logAudit({
      actorId,
      actorRole: 'ops',
      action: 'ORDER_STATUS_CHANGED',
      entity: 'orders',
      entityId: order.id,
      details: `Order ${order.orderNumber} status changed to ${status}. Note: ${note}`
    });

    this.saveData();
    return order;
  }

  // Subscriptions
  public getSubscriptions(userId?: string): Subscription[] {
    if (userId) {
      return this.data.subscriptions.filter((s) => s.userId === userId);
    }
    return this.data.subscriptions;
  }

  public createSubscription(sub: Subscription): Subscription {
    this.data.subscriptions.unshift(sub);
    this.saveData();
    return sub;
  }

  public updateSubscriptionStatus(
    id: string,
    status: 'ACTIVE' | 'PAUSED' | 'SKIPPED' | 'CANCELLED'
  ): Subscription | null {
    const sub = this.data.subscriptions.find((s) => s.id === id);
    if (!sub) return null;
    sub.status = status;
    sub.updatedAt = new Date().toISOString();
    this.saveData();
    return sub;
  }

  // Rewards
  public getUserRewards(userId: string): UserReward | undefined {
    let rew = this.data.rewards.find((r) => r.userId === userId);
    if (!rew) {
      rew = {
        userId,
        currentPoints: 100,
        lifetimePoints: 100,
        tier: 'Sprout',
        transactions: [
          {
            id: `tx-welcome-${Date.now()}`,
            userId,
            points: 100,
            type: 'EARNED_REFERRAL',
            description: 'Welcome Bonus Points',
            createdAt: new Date().toISOString(),
          }
        ]
      };
      this.data.rewards.push(rew);
      this.saveData();
    }
    return rew;
  }

  public redeemReward(userId: string, points: number, rewardLabel: string): boolean {
    const rew = this.getUserRewards(userId);
    if (!rew || rew.currentPoints < points) return false;
    rew.currentPoints -= points;
    rew.transactions.unshift({
      id: `tx-rdm-${Date.now()}`,
      userId,
      points: -points,
      type: 'REDEEMED',
      description: `Redeemed: ${rewardLabel}`,
      createdAt: new Date().toISOString(),
    });
    this.saveData();
    return true;
  }

  public recordPackagingReturn(userId: string, stickCount: number): number {
    const rew = this.getUserRewards(userId);
    if (!rew) return 0;
    const earnedPoints = stickCount * 10;
    rew.currentPoints += earnedPoints;
    rew.lifetimePoints += earnedPoints;
    rew.transactions.unshift({
      id: `tx-ret-${Date.now()}`,
      userId,
      points: earnedPoints,
      type: 'EARNED_RECYCLE',
      description: `Returned ${stickCount} wooden sticks & eco wrappers for recycling`,
      createdAt: new Date().toISOString(),
    });
    this.saveData();
    return earnedPoints;
  }

  // Stores
  public getStores(): RetailStore[] {
    return this.data.stores;
  }

  // Campaigns
  public getCampaigns(): Campaign[] {
    return this.data.campaigns.filter((c) => c.active);
  }

  // Support Tickets
  public getSupportTickets(userId?: string): SupportTicket[] {
    if (userId) {
      return this.data.supportTickets.filter((t) => t.userId === userId);
    }
    return this.data.supportTickets;
  }

  public createSupportTicket(ticket: SupportTicket): SupportTicket {
    this.data.supportTickets.unshift(ticket);
    this.saveData();
    return ticket;
  }

  public addSupportMessage(
    ticketId: string,
    sender: 'customer' | 'agent',
    senderName: string,
    message: string
  ): SupportTicket | null {
    const ticket = this.data.supportTickets.find((t) => t.id === ticketId || t.ticketNumber === ticketId);
    if (!ticket) return null;
    ticket.messages.push({
      id: `msg-${Date.now()}`,
      sender,
      senderName,
      message,
      timestamp: new Date().toISOString(),
    });
    ticket.updatedAt = new Date().toISOString();
    if (sender === 'customer') {
      ticket.status = 'IN_PROGRESS';
    } else {
      ticket.status = 'WAITING_FOR_CUSTOMER';
    }
    this.saveData();
    return ticket;
  }

  // Corporate Leads
  public getCorporateLeads(): CorporateLead[] {
    return this.data.corporateLeads;
  }

  public createCorporateLead(lead: CorporateLead): CorporateLead {
    this.data.corporateLeads.unshift(lead);
    this.logAudit({
      actorId: 'guest-corporate',
      actorRole: 'lead',
      action: 'CORPORATE_INQUIRY',
      entity: 'corporate_leads',
      entityId: lead.id,
      details: `New corporate lead from ${lead.company} (${lead.quantity} pops for ${lead.eventDate})`
    });
    this.saveData();
    return lead;
  }

  // Reviews
  public getReviews(productId?: string): ProductReview[] {
    if (productId) {
      return this.data.reviews.filter((r) => r.productId === productId);
    }
    return this.data.reviews;
  }

  public addReview(review: ProductReview): ProductReview {
    this.data.reviews.unshift(review);
    // Recalculate product rating
    const prodReviews = this.data.reviews.filter((r) => r.productId === review.productId);
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    const prod = this.getProductById(review.productId);
    if (prod) {
      prod.rating = parseFloat(avg.toFixed(1));
      prod.reviewCount = prodReviews.length;
    }
    this.saveData();
    return review;
  }

  // Audit Logs
  public logAudit(log: Omit<DatabaseSchema['auditLogs'][0], 'id' | 'timestamp'>): void {
    this.data.auditLogs.unshift({
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...log,
    });
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs.pop();
    }
  }

  public getAuditLogs(): DatabaseSchema['auditLogs'] {
    return this.data.auditLogs;
  }
}

export const db = new DatabaseManager();
