import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useRealtime } from '../context/RealtimeContext';
import { Order, OrderStatus, Product, CorporateLead, AuditLog, AdminStats, AppView } from '../types';
import {
  TrendingUp,
  Package,
  Repeat,
  Users,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Minus
} from 'lucide-react';

interface AdminViewProps {
  onNavigate: (view: AppView) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onNavigate }) => {
  const { refreshKey, triggerRefresh } = useRealtime();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [leads, setCorporateLeads] = useState<CorporateLead[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'leads' | 'logs'>('orders');
  const [orderFilter, setOrderFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusNote, setStatusNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadData = async () => {
    try {
      const [s, o, p, l, a] = await Promise.all([
        api.getAdminStats(),
        api.getOrders(),
        api.getProducts(),
        api.getCorporateLeads(),
        api.getAuditLogs(),
      ]);
      setStats(s);
      setOrders(o);
      setProducts(p);
      setCorporateLeads(l);
      setAuditLogs(a);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const handleUpdateOrderStatus = async (orderId: string, nextStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      const updated = await api.updateOrderStatus(orderId, nextStatus, statusNote || `Advanced to ${nextStatus}`);
      setStatusNote('');
      setSelectedOrder(updated);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      triggerRefresh();
    } catch (e: any) {
      alert(e.message || 'Failed to update order');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAdjustStock = async (productId: string, delta: number, reason: string) => {
    try {
      const updated = await api.adjustStock(productId, delta, reason);
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      triggerRefresh();
    } catch (e: any) {
      alert(e.message || 'Failed to adjust stock');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'ALL') return true;
    return o.status === orderFilter;
  });

  return (
    <div className="min-h-screen py-10 bg-[#F4F3EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#52B788] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">
                Real-Time Operations Console
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit'] mt-1">
              House of Pops Command Center
            </h1>
            <p className="text-xs text-slate-500">
              Live fulfillment, sub-zero cold-chain dispatch, inventory telemetry, and customer CRM.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Telemetry</span>
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2 rounded-xl bg-[#1B4332] text-white text-xs font-bold hover:bg-[#133024] transition-colors"
            >
              Customer Storefront →
            </button>
          </div>
        </div>

        {/* Top KPI Cards (Real Data) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-slate-500">Gross Revenue</span>
              <TrendingUp className="w-4 h-4 text-[#1B4332]" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-['Outfit'] tabular-nums">
              AED {stats?.totalRevenue.toLocaleString() || '0'}
            </div>
            <span className="text-[11px] text-[#52B788] font-bold">100% Verified Paid</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-slate-500">Total Orders</span>
              <Package className="w-4 h-4 text-[#1B4332]" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-['Outfit'] tabular-nums">
              {stats?.totalOrders || 0}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">UAE Cold Chain</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-slate-500">Subscriptions</span>
              <Repeat className="w-4 h-4 text-[#1B4332]" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-['Outfit'] tabular-nums">
              {stats?.activeSubscriptions || 0}
            </div>
            <span className="text-[11px] text-[#52B788] font-bold">Active Recurring</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-slate-500">Low Stock</span>
              <AlertTriangle className="w-4 h-4 text-[#E05A47]" />
            </div>
            <div className="text-2xl font-black text-[#E05A47] font-['Outfit'] tabular-nums">
              {stats?.lowStockCount || 0}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">&lt; 50 units threshold</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-slate-500">Live SSE Connections</span>
              <Radio className="w-4 h-4 text-[#52B788] animate-pulse" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-['Outfit'] tabular-nums">
              {stats?.realtimeActiveClients || 1}
            </div>
            <span className="text-[11px] text-[#52B788] font-bold">Real-Time Sync Active</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-300 pb-3 text-xs font-bold">
          {[
            { id: 'orders', label: `Orders Fulfillment (${orders.length})` },
            { id: 'inventory', label: `Inventory Hub (${products.length} flavors)` },
            { id: 'leads', label: `Corporate CRM Leads (${leads.length})` },
            { id: 'logs', label: `System Audit Logs (${auditLogs.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Orders Fulfillment */}
        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Orders Table (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                  Orders Pipeline
                </h3>
                <div className="flex gap-1.5 overflow-x-auto text-[11px] font-bold">
                  {['ALL', 'ORDER_PLACED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        orderFilter === st
                          ? 'bg-[#1B4332] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {filteredOrders.map((ord) => {
                  const isSelected = selectedOrder?.id === ord.id;
                  return (
                    <div
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#1B4332] bg-[#1B4332]/5 ring-1 ring-[#1B4332]'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-900 font-['Outfit']">
                          #{ord.orderNumber}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1B4332]/10 text-[#1B4332] uppercase">
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-slate-500 mt-1 flex justify-between">
                        <span>{ord.customerName} ({ord.customerPhone})</span>
                        <strong className="text-slate-900 tabular-nums">AED {ord.total}</strong>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 truncate">
                        {ord.items.map((i) => `${i.quantity}x ${i.productName}`).join(' · ')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Order Action Panel (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 lg:sticky lg:top-24">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit'] pb-2 border-b border-slate-100">
                Fulfillment Dispatch Controls
              </h3>

              {selectedOrder ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-slate-400">Order Reference:</span>
                    <div className="text-base font-black text-[#1B4332] font-['Outfit']">
                      #{selectedOrder.orderNumber}
                    </div>
                    <div className="text-slate-500">
                      Destination: {selectedOrder.deliveryAddress?.emirate || 'Store Pickup'} · Slot: {selectedOrder.deliverySlot}
                    </div>
                  </div>

                  {/* Status Progression Buttons */}
                  <div className="space-y-2 pt-2">
                    <label className="font-bold text-slate-700 block">
                      Advance Status (Pushes Live SSE to Customer):
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'PREPARING')}
                        disabled={isUpdating}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 text-left"
                      >
                        1. Packing Dry-Ice
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'READY')}
                        disabled={isUpdating}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 text-left"
                      >
                        2. Fleet Dispatched
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'OUT_FOR_DELIVERY')}
                        disabled={isUpdating}
                        className="p-2 rounded-xl bg-[#F4B942]/20 hover:bg-[#F4B942]/30 font-bold text-[#1B4332] text-left"
                      >
                        3. Out For Delivery
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'DELIVERED')}
                        disabled={isUpdating}
                        className="p-2 rounded-xl bg-[#52B788]/20 hover:bg-[#52B788]/30 font-bold text-[#1B4332] text-left"
                      >
                        4. Mark Delivered
                      </button>
                    </div>

                    <div className="pt-2">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Driver / Dispatch Note (Sent to Customer):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Courier Ahmed in Cold Van #04 - ETA 15 mins"
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  {/* Order History Timeline */}
                  <div className="pt-4 border-t border-slate-100 space-y-1.5">
                    <span className="font-bold text-slate-700 block">Telemetry Log:</span>
                    <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                      {selectedOrder.statusHistory.map((h, i) => (
                        <div key={i} className="text-[11px] text-slate-500 py-1 border-b border-slate-50">
                          <strong className="text-slate-800">{h.status}:</strong> {h.note}
                          <div className="text-[10px] text-slate-400">
                            {new Date(h.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  Select an order on the left to inspect and advance fulfillment.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Inventory Hub */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                  Central UAE Cold Inventory Manager
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time stock reservation and safety replenishment thresholds.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {products.map((p) => (
                <div key={p.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-contain bg-[#F4F3EE] p-1 rounded-xl"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                      <p className="text-xs text-slate-500">
                        {p.category} · Price: AED {p.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Current Stock</div>
                      <div
                        className={`text-lg font-black tabular-nums ${
                          p.stockQuantity < 50 ? 'text-[#E05A47]' : 'text-[#1B4332]'
                        }`}
                      >
                        {p.stockQuantity} units
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleAdjustStock(p.id, -10, 'Fulfillment batch dispatch')}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                        title="Reduce 10"
                      >
                        -10
                      </button>
                      <button
                        onClick={() => handleAdjustStock(p.id, 25, 'Fresh batch received from kitchen')}
                        className="px-2.5 py-1.5 rounded-lg bg-[#1B4332] text-white text-xs font-bold hover:bg-[#133024]"
                        title="Add 25"
                      >
                        +25 Restock
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Corporate CRM Leads */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
              B2B Corporate & Event Catering Leads
            </h3>
            <div className="space-y-3">
              {leads.map((lead) => (
                <div key={lead.id} className="p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-base text-slate-900 font-['Outfit']">{lead.company}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F4B942]/20 text-[#1B4332] uppercase">
                      {lead.status}
                    </span>
                  </div>
                  <div className="text-slate-600">
                    Contact: {lead.contactName} ({lead.email} · {lead.phone})
                  </div>
                  <div className="text-slate-500">
                    Event Date: <strong>{lead.eventDate}</strong> · Volume: <strong>{lead.quantity}</strong> · Location: <strong>{lead.location}</strong>
                  </div>
                  <div className="text-slate-600 italic bg-slate-50 p-2 rounded-lg mt-2">
                    "{lead.requirements}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Audit Logs */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
              System Operations Audit Log
            </h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="text-xs p-3 rounded-xl border border-slate-100 bg-[#FBFBFA] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#1B4332]">{log.action}</span>
                    <span className="text-slate-500 ml-2">[{log.entity}] {log.details}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
