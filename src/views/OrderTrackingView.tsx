import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, AppView } from '../types';
import { api } from '../services/api';
import { useRealtime } from '../context/RealtimeContext';
import { CheckCircle2, Truck, Package, Clock, ShieldCheck, Thermometer, MapPin, RefreshCw, ArrowLeft } from 'lucide-react';

interface OrderTrackingViewProps {
  order: Order | null;
  onNavigate: (view: AppView) => void;
}

const STATUS_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'ORDER_PLACED', label: 'Order Received', desc: 'Order verified by UAE dispatch system' },
  { status: 'PAYMENT_CONFIRMED', label: 'Payment Confirmed', desc: 'Transaction verified and receipt issued' },
  { status: 'PREPARING', label: 'Insulated Packing', desc: 'Packs sealed with dry-ice thermal insulation' },
  { status: 'READY', label: 'Dispatched to Fleet', desc: 'Handed to sub-zero refrigerated courier' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Driver en route to your address' },
  { status: 'DELIVERED', label: 'Delivered Fresh', desc: 'Delivered in pristine frozen condition' },
];

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({ order: initialOrder, onNavigate }) => {
  const [order, setOrder] = useState<Order | null>(initialOrder);
  const [isLoading, setIsLoading] = useState(false);
  const { refreshKey } = useRealtime();

  // Load latest order if none provided or upon SSE refresh
  useEffect(() => {
    if (initialOrder?.id) {
      api.getOrder(initialOrder.id).then(setOrder).catch(console.error);
    } else {
      // Fetch latest order for user
      api.getOrders().then((orders) => {
        if (orders.length > 0) {
          setOrder(orders[0]);
        }
      }).catch(console.error);
    }
  }, [initialOrder, refreshKey]);

  const handleRefresh = async () => {
    if (!order) return;
    setIsLoading(true);
    try {
      const fresh = await api.getOrder(order.id);
      setOrder(fresh);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#FBFBFA]">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4">
          <h2 className="text-xl font-black text-slate-900 font-['Outfit']">No Active Order</h2>
          <p className="text-xs text-slate-500">You do not have any orders in transit right now.</p>
          <button
            onClick={() => onNavigate('shop')}
            className="w-full py-3 bg-[#1B4332] text-white rounded-xl font-bold text-xs hover:bg-[#133024]"
          >
            Start Fresh Order
          </button>
        </div>
      </div>
    );
  }

  const currentStepIdx = STATUS_STEPS.findIndex((s) => s.status === order.status);

  return (
    <div className="min-h-screen py-10 bg-[#FBFBFA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => onNavigate('home')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
                Order #{order.orderNumber}
              </h1>
              <span className="text-xs font-bold text-[#1B4332] bg-[#1B4332]/10 px-3 py-1 rounded-full uppercase">
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-AE', { dateStyle: 'medium' })} at{' '}
              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
            <div className="px-3.5 py-2 rounded-xl bg-[#52B788]/10 text-[#1B4332] border border-[#52B788]/30 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#52B788] animate-pulse" />
              <span>Live Telemetry Active</span>
            </div>
          </div>
        </div>

        {/* Cold-Chain Van Telemetry Banner */}
        <div className="bg-[#18231C] text-white rounded-3xl p-6 shadow-xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="text-xs font-bold text-[#F4B942] uppercase tracking-wider flex items-center gap-1.5">
              <Thermometer className="w-4 h-4" />
              <span>Insulated Cold-Chain Status: -18.2°C Active</span>
            </div>
            <h2 className="text-lg font-black font-['Outfit']">
              {order.status === 'DELIVERED'
                ? 'Your pops have been safely delivered!'
                : order.status === 'OUT_FOR_DELIVERY'
                ? 'Refrigerated Cold Van is on its way to you'
                : 'Packaging in sub-zero thermal dry-ice box at Al Quoz hub'}
            </h2>
            <p className="text-xs text-slate-300">
              {order.driverNotes || 'Dispatched with certified food-grade insulation for UAE heat resistance.'}
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 flex-shrink-0 text-center min-w-[180px]">
            <div className="text-[11px] text-slate-300 uppercase font-semibold">Scheduled Slot</div>
            <div className="text-sm font-black text-white mt-0.5">{order.deliverySlot}</div>
            <div className="text-[10px] text-[#F4B942] mt-1 font-medium">Guaranteed Frozen Arrival</div>
          </div>
        </div>

        {/* Order Stepper Progress */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 font-['Outfit'] mb-6">
            Live Delivery Timeline
          </h2>

          <div className="relative">
            {/* Timeline connection line */}
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200" />

            <div className="space-y-6">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={step.status} className="relative flex items-start gap-4">
                    {/* Circle icon */}
                    <div
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                        isPassed
                          ? 'bg-[#1B4332] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-400 border border-slate-300'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    <div className="flex-1 pt-0.5">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-sm font-bold ${
                            isCurrent
                              ? 'text-[#1B4332] font-black'
                              : isPassed
                              ? 'text-slate-900'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </h4>
                        {isCurrent && (
                          <span className="text-[11px] font-bold text-[#E05A47] uppercase tracking-wider animate-pulse">
                            Current Stage
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2 Columns: Order Details & Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Items Summary */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit'] pb-2 border-b border-slate-100">
              Ordered Items
            </h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{item.productName}</div>
                    {item.boxItems && (
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {item.boxItems.map((bi) => `${bi.quantity}x ${bi.productName}`).join(', ')}
                      </div>
                    )}
                    <div className="text-[11px] text-slate-500">Qty: {item.quantity}</div>
                  </div>
                  <span className="font-black text-[#1B4332] tabular-nums">
                    AED {item.totalPrice}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs font-medium">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="tabular-nums">AED {order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#1B4332]">
                  <span>Discount</span>
                  <span className="tabular-nums">- AED {order.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span className="tabular-nums">{order.deliveryFee === 0 ? 'FREE' : `AED ${order.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-100">
                <span>Total Paid</span>
                <span className="text-[#1B4332] tabular-nums">AED {order.total}</span>
              </div>
            </div>
          </div>

          {/* Delivery Destination & Support */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit'] pb-2 border-b border-slate-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1B4332]" />
                <span>Destination</span>
              </h3>
              {order.deliveryAddress ? (
                <div className="text-xs text-slate-600 space-y-1">
                  <div className="font-bold text-slate-900">{order.customerName}</div>
                  <div>{order.customerPhone}</div>
                  <div>
                    {order.deliveryAddress.building}, {order.deliveryAddress.apartment},{' '}
                    {order.deliveryAddress.street}
                  </div>
                  <div>
                    {order.deliveryAddress.area}, {order.deliveryAddress.emirate}, UAE
                  </div>
                  {order.deliveryAddress.notes && (
                    <div className="text-slate-500 italic mt-1">
                      Note: "{order.deliveryAddress.notes}"
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-slate-600">
                  <div className="font-bold text-slate-900">Pickup Location</div>
                  <div>Kiosk: {order.pickupStoreId}</div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Need help with this order?</h4>
                <p className="text-xs text-slate-500">Contact our real-time customer care team.</p>
              </div>
              <button
                onClick={() => onNavigate('support')}
                className="px-4 py-2 bg-[#1B4332] text-white text-xs font-bold rounded-xl hover:bg-[#133024] transition-colors"
              >
                Chat Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
