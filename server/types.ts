/**
 * House of Pops - Database Types & Relational Interfaces
 */

export type UserRole = 'customer' | 'admin' | 'ops';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  preferredLanguage: 'en' | 'ar';
  preferredEmirate: string;
  marketingConsent: boolean;
  packagingReturnsCount: number;
}

export interface Address {
  id: string;
  userId: string;
  title: string; // 'Home', 'Office', etc.
  emirate: string;
  area: string;
  street: string;
  building: string;
  apartment: string;
  notes?: string;
  isDefault: boolean;
}

export interface ProductNutrition {
  servingSize: string;
  calories: number;
  totalFatG: number;
  saturatedFatG: number;
  carbsG: number;
  sugarsG: number;
  fiberG: number;
  proteinG: number;
  sodiumMg: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  category: 'Fruit Pops' | 'Creamy Pops' | 'Dipped & Bites' | 'Special Edition';
  price: number; // in AED
  description: string;
  descriptionAr: string;
  image: string;
  ingredients: string[];
  allergens: string[];
  dietaryTags: string[];
  nutrition: ProductNutrition;
  stockQuantity: number;
  reservedStock: number;
  inStock: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  rating: number;
  reviewCount: number;
}

export interface CustomBoxItem {
  productId: string;
  productName: string;
  quantity: number;
  image: string;
}

export interface CartItem {
  id: string;
  type: 'single' | 'custom_box';
  productId?: string;
  product?: Product;
  boxSize?: number;
  boxItems?: CustomBoxItem[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderItem {
  id: string;
  type: 'single' | 'custom_box';
  productId?: string;
  productName: string;
  productImage: string;
  boxSize?: number;
  boxItems?: CustomBoxItem[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus =
  | 'ORDER_PLACED'
  | 'PAYMENT_CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  note: string;
  timestamp: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fulfillmentType: 'DELIVERY' | 'PICKUP';
  items: OrderItem[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  deliveryFee: number;
  total: number;
  currency: 'AED';
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'card' | 'apple_pay' | 'tabby' | 'tamara' | 'cod';
  deliveryAddress?: {
    emirate: string;
    area: string;
    street: string;
    building: string;
    apartment: string;
    notes?: string;
  };
  pickupStoreId?: string;
  deliverySlot: string;
  statusHistory: OrderStatusHistoryItem[];
  driverNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  planFrequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  boxSize: number;
  boxItems: CustomBoxItem[];
  status: 'ACTIVE' | 'PAUSED' | 'SKIPPED' | 'CANCELLED';
  nextDeliveryDate: string;
  deliveryAddress: {
    emirate: string;
    area: string;
    street: string;
    building: string;
    apartment: string;
  };
  deliverySlot: string;
  pricePerDelivery: number;
  discountPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface RewardTransaction {
  id: string;
  userId: string;
  points: number;
  type: 'EARNED_ORDER' | 'EARNED_RECYCLE' | 'EARNED_REFERRAL' | 'REDEEMED';
  description: string;
  createdAt: string;
}

export interface UserReward {
  userId: string;
  currentPoints: number;
  lifetimePoints: number;
  tier: 'Sprout' | 'Bloom' | 'EcoChampion';
  transactions: RewardTransaction[];
}

export interface RetailStore {
  id: string;
  name: string;
  nameAr: string;
  emirate: string;
  area: string;
  locationDetails: string;
  openingHours: string;
  phone: string;
  lat: number;
  lng: number;
  image: string;
  hasPickup: boolean;
}

export interface Campaign {
  id: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  badge: string;
  ctaText: string;
  ctaLink: string;
  weatherCondition?: 'HOT' | 'EXTREME' | 'ANY';
  temperatureThresholdC?: number;
  active: boolean;
}

export interface SupportMessage {
  id: string;
  sender: 'customer' | 'agent';
  senderName: string;
  message: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_CUSTOMER' | 'RESOLVED';
  messages: SupportMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface CorporateLead {
  id: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  eventDate: string;
  quantity: string;
  location: string;
  requirements: string;
  status: 'NEW' | 'CONTACTED' | 'PROPOSAL_SENT' | 'CONFIRMED';
  createdAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorRole: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export interface DatabaseSchema {
  users: User[];
  userProfiles: UserProfile[];
  addresses: Address[];
  products: Product[];
  orders: Order[];
  subscriptions: Subscription[];
  rewards: UserReward[];
  stores: RetailStore[];
  campaigns: Campaign[];
  supportTickets: SupportTicket[];
  corporateLeads: CorporateLead[];
  reviews: ProductReview[];
  auditLogs: AuditLog[];
}
