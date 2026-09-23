import { Product, Order, Subscription, RetailStore, Campaign, SupportTicket, CorporateLead, ProductReview, User, AdminStats, AuditLog } from '../types';

const API_BASE = '/api';

class ApiService {
  private userId: string | null = null;

  public setUserId(id: string | null) {
    this.userId = id;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.userId) {
      headers['x-user-id'] = this.userId;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let errorMsg = `API Error ${res.status}: ${res.statusText}`;
      try {
        const body = await res.json();
        if (body.error) errorMsg = body.error;
      } catch (_) {}
      throw new Error(errorMsg);
    }

    return res.json();
  }

  // Auth
  public async register(payload: { email: string; password: string; name: string; phone?: string }) {
    return this.request<{ user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async login(payload: { email: string; password: string }) {
    return this.request<{ user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async getMe() {
    return this.request<{ user: User }>('/auth/me');
  }

  // Products
  public async getProducts(): Promise<Product[]> {
    const res = await this.request<{ products: Product[] }>('/products');
    return res.products;
  }

  public async getProduct(id: string): Promise<Product> {
    const res = await this.request<{ product: Product }>(`/products/${id}`);
    return res.product;
  }

  public async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const res = await this.request<{ product: Product }>(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return res.product;
  }

  public async adjustStock(productId: string, delta: number, reason: string): Promise<Product> {
    const res = await this.request<{ product: Product }>(`/products/${productId}/stock`, {
      method: 'POST',
      body: JSON.stringify({ delta, reason }),
    });
    return res.product;
  }

  // Orders
  public async getOrders(userId?: string): Promise<Order[]> {
    const url = userId ? `/orders?userId=${encodeURIComponent(userId)}` : '/orders';
    const res = await this.request<{ orders: Order[] }>(url);
    return res.orders;
  }

  public async getOrder(id: string): Promise<Order> {
    const res = await this.request<{ order: Order }>(`/orders/${id}`);
    return res.order;
  }

  public async createOrder(orderPayload: any): Promise<Order> {
    const res = await this.request<{ order: Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderPayload),
    });
    return res.order;
  }

  public async updateOrderStatus(orderId: string, status: string, note?: string): Promise<Order> {
    const res = await this.request<{ order: Order }>(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    });
    return res.order;
  }

  // Subscriptions
  public async getSubscriptions(userId?: string): Promise<Subscription[]> {
    const url = userId ? `/subscriptions?userId=${encodeURIComponent(userId)}` : '/subscriptions';
    const res = await this.request<{ subscriptions: Subscription[] }>(url);
    return res.subscriptions;
  }

  public async createSubscription(payload: any): Promise<Subscription> {
    const res = await this.request<{ subscription: Subscription }>('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.subscription;
  }

  public async updateSubscriptionStatus(id: string, status: string): Promise<Subscription> {
    const res = await this.request<{ subscription: Subscription }>(`/subscriptions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return res.subscription;
  }

  // Rewards
  public async getRewards(userId: string) {
    const res = await this.request<{ rewards: any }>(`/rewards/${userId}`);
    return res.rewards;
  }

  public async redeemReward(userId: string, points: number, rewardLabel: string) {
    return this.request<{ success: boolean; rewards: any }>(`/rewards/${userId}/redeem`, {
      method: 'POST',
      body: JSON.stringify({ points, rewardLabel }),
    });
  }

  public async recordPackagingReturn(userId: string, stickCount: number) {
    return this.request<{ success: boolean; pointsEarned: number; rewards: any }>(`/rewards/${userId}/recycle-return`, {
      method: 'POST',
      body: JSON.stringify({ stickCount }),
    });
  }

  // Stores & Campaigns
  public async getStores(): Promise<RetailStore[]> {
    const res = await this.request<{ stores: RetailStore[] }>('/stores');
    return res.stores;
  }

  public async getCampaigns(): Promise<Campaign[]> {
    const res = await this.request<{ campaigns: Campaign[] }>('/campaigns');
    return res.campaigns;
  }

  // Support
  public async getSupportTickets(userId?: string): Promise<SupportTicket[]> {
    const url = userId ? `/support/tickets?userId=${encodeURIComponent(userId)}` : '/support/tickets';
    const res = await this.request<{ tickets: SupportTicket[] }>(url);
    return res.tickets;
  }

  public async createSupportTicket(payload: any): Promise<SupportTicket> {
    const res = await this.request<{ ticket: SupportTicket }>('/support/tickets', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.ticket;
  }

  public async addSupportMessage(ticketId: string, sender: string, senderName: string, message: string): Promise<SupportTicket> {
    const res = await this.request<{ ticket: SupportTicket }>(`/support/tickets/${ticketId}/message`, {
      method: 'POST',
      body: JSON.stringify({ sender, senderName, message }),
    });
    return res.ticket;
  }

  // Corporate Leads
  public async getCorporateLeads(): Promise<CorporateLead[]> {
    const res = await this.request<{ leads: CorporateLead[] }>('/corporate/leads');
    return res.leads;
  }

  public async createCorporateLead(payload: any): Promise<CorporateLead> {
    const res = await this.request<{ lead: CorporateLead }>('/corporate/leads', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.lead;
  }

  // Reviews
  public async getReviews(productId?: string): Promise<ProductReview[]> {
    const url = productId ? `/reviews?productId=${encodeURIComponent(productId)}` : '/reviews';
    const res = await this.request<{ reviews: ProductReview[] }>(url);
    return res.reviews;
  }

  public async addReview(payload: any): Promise<ProductReview> {
    const res = await this.request<{ review: ProductReview }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.review;
  }

  // Admin
  public async getAdminStats(): Promise<AdminStats> {
    return this.request<AdminStats>('/admin/stats');
  }

  public async getAuditLogs(): Promise<AuditLog[]> {
    const res = await this.request<{ auditLogs: AuditLog[] }>('/admin/audit-logs');
    return res.auditLogs;
  }
}

export const api = new ApiService();
