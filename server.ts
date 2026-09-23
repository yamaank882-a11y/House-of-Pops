import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { db, hashPassword } from './server/db.ts';
import { realtime, RealtimeEventType } from './server/realtime.ts';
import { Order, OrderStatus, Subscription, SupportTicket, CorporateLead, ProductReview } from './server/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // ----------------------------------------------------
  // REAL-TIME SERVER-SENT EVENTS (SSE)
  // ----------------------------------------------------
  app.get('/api/realtime', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const clientId = `client-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const userId = req.query.userId as string | undefined;
    const role = req.query.role as string | undefined;

    realtime.addClient({ id: clientId, userId, role, res });

    req.on('close', () => {
      realtime.removeClient(clientId);
    });
  });

  // ----------------------------------------------------
  // AUTHENTICATION ROUTES
  // ----------------------------------------------------
  app.post('/api/auth/register', (req: Request, res: Response) => {
    try {
      const { email, password, name, phone } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, and name are required' });
      }

      const existing = db.findUserByEmail(email);
      if (existing) {
        return res.status(409).json({ error: 'An account with this email already exists' });
      }

      const newUser = db.createUser({
        id: `user-${Date.now()}`,
        email: email.trim().toLowerCase(),
        passwordHash: hashPassword(password),
        name: name.trim(),
        phone: phone || '+971 50 000 0000',
        role: 'customer',
        createdAt: new Date().toISOString(),
      });

      // Never return passwordHash
      const { passwordHash, ...userSafe } = newUser;
      return res.status(201).json({ user: userSafe });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Registration failed' });
    }
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const user = db.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const computedHash = hashPassword(password);
      if (user.passwordHash !== computedHash) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const { passwordHash, ...userSafe } = user;
      return res.json({ user: userSafe });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Login failed' });
    }
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const user = db.findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { passwordHash, ...userSafe } = user;
    return res.json({ user: userSafe });
  });

  // ----------------------------------------------------
  // PRODUCTS & INVENTORY
  // ----------------------------------------------------
  app.get('/api/products', (req: Request, res: Response) => {
    const products = db.getProducts();
    res.json({ products });
  });

  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product });
  });

  app.patch('/api/products/:id', (req: Request, res: Response) => {
    const actorId = (req.headers['x-user-id'] as string) || 'admin';
    const updated = db.updateProduct(req.params.id, req.body, actorId);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }

    realtime.broadcast({
      type: 'INVENTORY_CHANGED',
      payload: { productId: updated.id, inStock: updated.inStock, stockQuantity: updated.stockQuantity },
      timestamp: new Date().toISOString(),
    });

    res.json({ product: updated });
  });

  app.post('/api/products/:id/stock', (req: Request, res: Response) => {
    const { delta, reason } = req.body;
    const actorId = (req.headers['x-user-id'] as string) || 'admin';
    const updated = db.adjustStock(req.params.id, Number(delta) || 0, actorId, reason || 'Manual adjustment');
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }

    realtime.broadcast({
      type: 'INVENTORY_CHANGED',
      payload: { productId: updated.id, stockQuantity: updated.stockQuantity, inStock: updated.inStock },
      timestamp: new Date().toISOString(),
    });

    res.json({ product: updated });
  });

  // ----------------------------------------------------
  // ORDERS & CHECKOUT
  // ----------------------------------------------------
  app.get('/api/orders', (req: Request, res: Response) => {
    const userId = req.query.userId as string | undefined;
    const orders = db.getOrders(userId);
    res.json({ orders });
  });

  app.get('/api/orders/:id', (req: Request, res: Response) => {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order });
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    try {
      const {
        userId,
        customerName,
        customerEmail,
        customerPhone,
        fulfillmentType,
        items,
        promoCode,
        deliveryAddress,
        pickupStoreId,
        deliverySlot,
        paymentMethod,
      } = req.body;

      if (!items || !items.length) {
        return res.status(400).json({ error: 'Order must contain items' });
      }

      // Server-side recalculation of subtotal and discounts
      let calculatedSubtotal = 0;
      for (const item of items) {
        if (item.type === 'single') {
          const product = db.getProductById(item.productId);
          if (!product) {
            return res.status(400).json({ error: `Product not found: ${item.productId}` });
          }
          if (product.stockQuantity < item.quantity) {
            return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
          }
          calculatedSubtotal += product.price * item.quantity;
        } else if (item.type === 'custom_box') {
          // Custom box pricing: box of 4, 6, 10, or 12
          const boxSize = item.boxSize || 10;
          let boxBase = 0;
          for (const boxItem of item.boxItems || []) {
            const product = db.getProductById(boxItem.productId);
            if (product) {
              boxBase += product.price * boxItem.quantity;
            }
          }
          // Volume discount for boxes
          let discountRate = 0;
          if (boxSize >= 12) discountRate = 0.20;
          else if (boxSize >= 10) discountRate = 0.15;
          else if (boxSize >= 6) discountRate = 0.10;

          const boxPriceAfterDiscount = Math.round(boxBase * (1 - discountRate));
          calculatedSubtotal += boxPriceAfterDiscount * item.quantity;
        }
      }

      // Promo codes
      let promoDiscount = 0;
      if (promoCode) {
        const codeUpper = promoCode.trim().toUpperCase();
        if (codeUpper === 'NATURAL15') {
          promoDiscount = Math.round(calculatedSubtotal * 0.15);
        } else if (codeUpper === 'POPSUMMER') {
          promoDiscount = 20;
        } else if (codeUpper === 'WELCOME10') {
          promoDiscount = Math.round(calculatedSubtotal * 0.10);
        }
      }

      const deliveryFee = fulfillmentType === 'PICKUP' || calculatedSubtotal >= 150 ? 0 : 15;
      const finalTotal = Math.max(0, calculatedSubtotal - promoDiscount + deliveryFee);

      const orderNumber = `HOP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        userId: userId || 'guest',
        customerName: customerName || 'Valued Guest',
        customerEmail: customerEmail || 'guest@houseofpops.ae',
        customerPhone: customerPhone || '+971 50 000 0000',
        fulfillmentType: fulfillmentType || 'DELIVERY',
        items,
        subtotal: calculatedSubtotal,
        discount: promoDiscount,
        promoCode,
        deliveryFee,
        total: finalTotal,
        currency: 'AED',
        status: 'ORDER_PLACED',
        paymentStatus: paymentMethod === 'cod' ? 'PENDING' : 'PAID',
        paymentMethod: paymentMethod || 'apple_pay',
        deliveryAddress,
        pickupStoreId,
        deliverySlot: deliverySlot || 'Express (Within 60 Mins)',
        statusHistory: [
          {
            status: 'ORDER_PLACED',
            note: 'Order initiated and verified by House of Pops UAE dispatch engine',
            timestamp: new Date().toISOString(),
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const created = db.createOrder(newOrder);

      // Realtime broadcast to admin and user
      realtime.broadcast({
        type: 'ORDER_CREATED',
        payload: { order: created },
        timestamp: new Date().toISOString(),
      });

      return res.status(201).json({ order: created });
    } catch (err: any) {
      console.error('Order creation error:', err);
      return res.status(500).json({ error: err.message || 'Failed to place order' });
    }
  });

  app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
    const { status, note } = req.body;
    const actorId = (req.headers['x-user-id'] as string) || 'admin';
    const updated = db.updateOrderStatus(req.params.id, status as OrderStatus, note || `Status updated to ${status}`, actorId);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Broadcast in real-time to customer and operations
    realtime.broadcast(
      {
        type: 'ORDER_STATUS_CHANGED',
        payload: {
          orderId: updated.id,
          orderNumber: updated.orderNumber,
          status: updated.status,
          note: note || '',
          timestamp: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      },
      updated.userId
    );

    res.json({ order: updated });
  });

  // ----------------------------------------------------
  // SUBSCRIPTIONS
  // ----------------------------------------------------
  app.get('/api/subscriptions', (req: Request, res: Response) => {
    const userId = req.query.userId as string | undefined;
    const subscriptions = db.getSubscriptions(userId);
    res.json({ subscriptions });
  });

  app.post('/api/subscriptions', (req: Request, res: Response) => {
    try {
      const { userId, customerName, customerEmail, planFrequency, boxSize, boxItems, deliveryAddress, deliverySlot } = req.body;
      const newSub: Subscription = {
        id: `sub-${Date.now()}`,
        userId: userId || 'user-customer-01',
        customerName: customerName || 'Valued Subscriber',
        customerEmail: customerEmail || 'subscriber@houseofpops.ae',
        planFrequency: planFrequency || 'BIWEEKLY',
        boxSize: boxSize || 10,
        boxItems: boxItems || [],
        status: 'ACTIVE',
        nextDeliveryDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
        deliveryAddress: deliveryAddress || {
          emirate: 'Dubai',
          area: 'Downtown Dubai',
          street: 'Mohammed Bin Rashid Blvd',
          building: 'The Residences',
          apartment: '1402',
        },
        deliverySlot: deliverySlot || 'Morning (10:00 AM - 1:00 PM)',
        pricePerDelivery: Math.round(boxSize * 20 * 0.85), // 15% discount
        discountPercent: 15,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const created = db.createSubscription(newSub);
      realtime.broadcast({
        type: 'SUBSCRIPTION_UPDATED',
        payload: { subscription: created },
        timestamp: new Date().toISOString(),
      });
      res.status(201).json({ subscription: created });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to create subscription' });
    }
  });

  app.patch('/api/subscriptions/:id/status', (req: Request, res: Response) => {
    const { status } = req.body;
    const updated = db.updateSubscriptionStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    realtime.broadcast({
      type: 'SUBSCRIPTION_UPDATED',
      payload: { subscription: updated },
      timestamp: new Date().toISOString(),
    });
    res.json({ subscription: updated });
  });

  // ----------------------------------------------------
  // REWARDS
  // ----------------------------------------------------
  app.get('/api/rewards/:userId', (req: Request, res: Response) => {
    const rew = db.getUserRewards(req.params.userId);
    res.json({ rewards: rew });
  });

  app.post('/api/rewards/:userId/redeem', (req: Request, res: Response) => {
    const { points, rewardLabel } = req.body;
    const success = db.redeemReward(req.params.userId, Number(points), rewardLabel || 'Eco Voucher');
    if (!success) {
      return res.status(400).json({ error: 'Insufficient reward points balance' });
    }
    const updated = db.getUserRewards(req.params.userId);
    realtime.broadcast(
      {
        type: 'REWARD_EARNED',
        payload: { message: `Redeemed ${points} points for ${rewardLabel}`, balance: updated?.currentPoints },
        timestamp: new Date().toISOString(),
      },
      req.params.userId
    );
    res.json({ success: true, rewards: updated });
  });

  app.post('/api/rewards/:userId/recycle-return', (req: Request, res: Response) => {
    const { stickCount } = req.body;
    const earned = db.recordPackagingReturn(req.params.userId, Number(stickCount) || 10);
    const updated = db.getUserRewards(req.params.userId);
    realtime.broadcast(
      {
        type: 'REWARD_EARNED',
        payload: { message: `Earned ${earned} EcoPoints for returning ${stickCount} sticks!`, balance: updated?.currentPoints },
        timestamp: new Date().toISOString(),
      },
      req.params.userId
    );
    res.json({ success: true, pointsEarned: earned, rewards: updated });
  });

  // ----------------------------------------------------
  // STORES & CAMPAIGNS
  // ----------------------------------------------------
  app.get('/api/stores', (_req: Request, res: Response) => {
    res.json({ stores: db.getStores() });
  });

  app.get('/api/campaigns', (_req: Request, res: Response) => {
    res.json({ campaigns: db.getCampaigns() });
  });

  // ----------------------------------------------------
  // CUSTOMER SUPPORT & TICKETS
  // ----------------------------------------------------
  app.get('/api/support/tickets', (req: Request, res: Response) => {
    const userId = req.query.userId as string | undefined;
    res.json({ tickets: db.getSupportTickets(userId) });
  });

  app.post('/api/support/tickets', (req: Request, res: Response) => {
    const { userId, customerName, customerEmail, subject, initialMessage } = req.body;
    const ticketNumber = `TKT-${Math.floor(100 + Math.random() * 900)}`;
    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber,
      userId: userId || 'guest',
      customerName: customerName || 'Guest User',
      customerEmail: customerEmail || 'guest@houseofpops.ae',
      subject: subject || 'General Inquiry',
      status: 'OPEN',
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'customer',
          senderName: customerName || 'Guest',
          message: initialMessage || 'Hello, I have an inquiry regarding my order.',
          timestamp: new Date().toISOString(),
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const created = db.createSupportTicket(newTicket);
    realtime.broadcast({
      type: 'SUPPORT_MESSAGE_RECEIVED',
      payload: { ticket: created },
      timestamp: new Date().toISOString(),
    });
    res.status(201).json({ ticket: created });
  });

  app.post('/api/support/tickets/:id/message', (req: Request, res: Response) => {
    const { sender, senderName, message } = req.body;
    const updated = db.addSupportMessage(req.params.id, sender || 'customer', senderName || 'User', message);
    if (!updated) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    realtime.broadcast({
      type: 'SUPPORT_MESSAGE_RECEIVED',
      payload: { ticketId: updated.id, message, sender },
      timestamp: new Date().toISOString(),
    });

    res.json({ ticket: updated });
  });

  // ----------------------------------------------------
  // CORPORATE / BULK LEADS
  // ----------------------------------------------------
  app.get('/api/corporate/leads', (_req: Request, res: Response) => {
    res.json({ leads: db.getCorporateLeads() });
  });

  app.post('/api/corporate/leads', (req: Request, res: Response) => {
    const { company, contactName, email, phone, eventDate, quantity, location, requirements } = req.body;
    if (!company || !contactName || !email) {
      return res.status(400).json({ error: 'Company, contact name, and email are required' });
    }

    const newLead: CorporateLead = {
      id: `lead-${Date.now()}`,
      company,
      contactName,
      email,
      phone: phone || '',
      eventDate: eventDate || '',
      quantity: quantity || '100-300 Pops',
      location: location || 'Dubai',
      requirements: requirements || '',
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };

    const created = db.createCorporateLead(newLead);
    res.status(201).json({ lead: created });
  });

  // ----------------------------------------------------
  // REVIEWS
  // ----------------------------------------------------
  app.get('/api/reviews', (req: Request, res: Response) => {
    const productId = req.query.productId as string | undefined;
    res.json({ reviews: db.getReviews(productId) });
  });

  app.post('/api/reviews', (req: Request, res: Response) => {
    const { productId, userId, userName, rating, comment } = req.body;
    if (!productId || !rating || !comment) {
      return res.status(400).json({ error: 'Product ID, rating, and comment are required' });
    }

    const newReview: ProductReview = {
      id: `rev-${Date.now()}`,
      productId,
      userId: userId || 'user-guest',
      userName: userName || 'House of Pops Connoisseur',
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment,
      verifiedPurchase: true,
      createdAt: new Date().toISOString(),
    };

    const created = db.addReview(newReview);
    res.status(201).json({ review: created });
  });

  // ----------------------------------------------------
  // ADMIN DASHBOARD & AUDIT LOGS
  // ----------------------------------------------------
  app.get('/api/admin/stats', (_req: Request, res: Response) => {
    const orders = db.getOrders();
    const products = db.getProducts();
    const subscriptions = db.getSubscriptions();
    const raw = db.getRawData();

    const totalRevenue = orders
      .filter((o) => o.paymentStatus === 'PAID')
      .reduce((sum, o) => sum + o.total, 0);

    const activeSubscriptions = subscriptions.filter((s) => s.status === 'ACTIVE').length;
    const lowStockProducts = products.filter((p) => p.stockQuantity < 50);

    res.json({
      totalRevenue,
      totalOrders: orders.length,
      activeSubscriptions,
      totalCustomers: raw.users.filter((u) => u.role === 'customer').length,
      lowStockCount: lowStockProducts.length,
      lowStockProducts: lowStockProducts.map((p) => ({
        id: p.id,
        name: p.name,
        stockQuantity: p.stockQuantity,
      })),
      pendingTickets: raw.supportTickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length,
      corporateLeadsCount: raw.corporateLeads.length,
      realtimeActiveClients: realtime.getActiveCount(),
    });
  });

  app.get('/api/admin/audit-logs', (_req: Request, res: Response) => {
    res.json({ auditLogs: db.getAuditLogs() });
  });

  // ----------------------------------------------------
  // VITE / STATIC MIDDLEWARE MOUNTING
  // ----------------------------------------------------
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[House of Pops Server] Listening on http://0.0.0.0:${PORT} in ${isProduction ? 'production' : 'development'} mode`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup failure:', err);
  process.exit(1);
});
