export * from '../../server/types.ts';

export type AppView =
  | 'home'
  | 'shop'
  | 'build-box'
  | 'subscriptions'
  | 'rewards'
  | 'stores'
  | 'corporate'
  | 'support'
  | 'account'
  | 'checkout'
  | 'order-tracking'
  | 'admin';

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  activeSubscriptions: number;
  totalCustomers: number;
  lowStockCount: number;
  lowStockProducts: { id: string; name: string; stockQuantity: number }[];
  pendingTickets: number;
  corporateLeadsCount: number;
  realtimeActiveClients: number;
}
