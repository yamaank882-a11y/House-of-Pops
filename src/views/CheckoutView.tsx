import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AppView, Order } from '../types';
import { ShieldCheck, Truck, Store, CreditCard, Lock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface CheckoutViewProps {
  onNavigate: (view: AppView) => void;
  onOrderCompleted: (order: Order) => void;
}

const UAE_EMIRATES = [
  'Dubai',
  'Abu Dhabi',
  'Sharjah',
  'Ajman',
  'Ras Al Khaimah',
  'Umm Al Quwain',
  'Fujairah',
];

const DELIVERY_SLOTS = [
  'Express Delivery (Within 60 mins) — Dubai Only',
  'Morning (10:00 AM - 1:00 PM)',
  'Afternoon (2:00 PM - 6:00 PM)',
  'Evening (7:00 PM - 10:00 PM)',
  'Tomorrow Morning (10:00 AM - 1:00 PM)',
];

export const CheckoutView: React.FC<CheckoutViewProps> = ({ onNavigate, onOrderCompleted }) => {
  const { items, subtotal, promoCode, promoDiscount, deliveryFee, total, clearCart, fulfillmentType, setFulfillmentType } = useCart();
  const { user } = useAuth();

  // Form State
  const [customerName, setCustomerName] = useState(user?.name || 'Fatima Al Mansoori');
  const [customerEmail, setCustomerEmail] = useState(user?.email || 'guest@houseofpops.ae');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+971 52 987 6543');

  const [emirate, setEmirate] = useState('Dubai');
  const [area, setArea] = useState('Al Wasl / Jumeirah 2');
  const [street, setStreet] = useState('Street 14B');
  const [building, setBuilding] = useState('Villa 28');
  const [apartment, setApartment] = useState('Villa');
  const [notes, setNotes] = useState('Sub-zero courier box. Ring doorbell.');
  const [deliverySlot, setDeliverySlot] = useState(DELIVERY_SLOTS[0]);
  const [pickupStoreId, setPickupStoreId] = useState('store-dubai-mall');

  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'card' | 'tabby' | 'tamara' | 'cod'>('apple_pay');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#FBFBFA]">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4">
          <h2 className="text-xl font-black text-slate-900 font-['Outfit']">Your Bag is Empty</h2>
          <p className="text-xs text-slate-500">Add products or build a custom box before checking out.</p>
          <button
            onClick={() => onNavigate('shop')}
            className="w-full py-3 bg-[#1B4332] text-white rounded-xl font-bold text-xs hover:bg-[#133024]"
          >
            Browse All Pops
          </button>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const orderPayload = {
        userId: user?.id || 'guest',
        customerName,
        customerEmail,
        customerPhone,
        fulfillmentType,
        items,
        promoCode: promoDiscount > 0 ? promoCode : undefined,
        deliverySlot,
        paymentMethod,
        pickupStoreId: fulfillmentType === 'PICKUP' ? pickupStoreId : undefined,
        deliveryAddress:
          fulfillmentType === 'DELIVERY'
            ? {
                emirate,
                area,
                street,
                building,
                apartment,
                notes,
              }
            : undefined,
      };

      const created = await api.createOrder(orderPayload);
      clearCart();
      onOrderCompleted(created);
      onNavigate('order-tracking');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please review your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 bg-[#FBFBFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold text-[#1B4332] uppercase tracking-wider">
            Safe & Encrypted Checkout
          </span>
          <h1 className="text-3xl font-black text-slate-900 font-['Outfit'] mt-1">
            Complete Your Order
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Checkout Inputs (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Customer Contact */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xs">
                  1
                </span>
                <span>Contact & Account Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#1B4332]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#1B4332]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">UAE Phone (WhatsApp)</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+971 50 123 4567"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#1B4332]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Fulfillment & Address */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <h2 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xs">
                  2
                </span>
                <span>Delivery & Fulfillment</span>
              </h2>

              {/* Delivery / Pickup Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFulfillmentType('DELIVERY')}
                  className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-colors ${
                    fulfillmentType === 'DELIVERY'
                      ? 'border-[#1B4332] bg-[#1B4332]/5 ring-1 ring-[#1B4332]'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <Truck className="w-5 h-5 text-[#1B4332]" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Cold-Van UAE Delivery</div>
                    <div className="text-[11px] text-slate-500">Sub-zero refrigerated vans</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillmentType('PICKUP')}
                  className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-colors ${
                    fulfillmentType === 'PICKUP'
                      ? 'border-[#1B4332] bg-[#1B4332]/5 ring-1 ring-[#1B4332]'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <Store className="w-5 h-5 text-[#1B4332]" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Store Pickup (Kiosk)</div>
                    <div className="text-[11px] text-slate-500">Pick up ready in 15 mins</div>
                  </div>
                </button>
              </div>

              {fulfillmentType === 'DELIVERY' ? (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Emirate</label>
                      <select
                        value={emirate}
                        onChange={(e) => setEmirate(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#1B4332]"
                      >
                        {UAE_EMIRATES.map((em) => (
                          <option key={em} value={em}>
                            {em}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Community / Area</label>
                      <input
                        type="text"
                        required
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="e.g. Downtown, JBR, Yas Island, Al Zahia"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#1B4332]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Street</label>
                      <input
                        type="text"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#1B4332]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Building / Villa</label>
                      <input
                        type="text"
                        required
                        value={building}
                        onChange={(e) => setBuilding(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#1B4332]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Apartment / Unit</label>
                      <input
                        type="text"
                        required
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#1B4332]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Scheduled Delivery Window</label>
                    <select
                      value={deliverySlot}
                      onChange={(e) => setDeliverySlot(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#1B4332]"
                    >
                      {DELIVERY_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Courier Instructions (Optional)</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Ring intercom, leave with concierge"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#1B4332]"
                    />
                  </div>
                </div>
              ) : (
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select Pickup Kiosk</label>
                  <select
                    value={pickupStoreId}
                    onChange={(e) => setPickupStoreId(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#1B4332]"
                  >
                    <option value="store-dubai-mall">The Dubai Mall (Ground Floor Aquarium Promenade)</option>
                    <option value="store-kite-beach">Kite Beach Boardwalk (Kiosk #7)</option>
                    <option value="store-bluewaters">Bluewaters Island (Waterfront Esplanade)</option>
                    <option value="store-yas-mall">Yas Mall Abu Dhabi (Fashion Avenue Atrium)</option>
                    <option value="store-al-qana">Al Qana Marina Abu Dhabi</option>
                  </select>
                </div>
              )}
            </div>

            {/* Step 3: Payment Method Architecture */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xs">
                  3
                </span>
                <span>Payment Architecture</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { id: 'apple_pay', label: 'Apple Pay' },
                  { id: 'card', label: 'Credit Card' },
                  { id: 'tabby', label: 'Tabby (4x)' },
                  { id: 'tamara', label: 'Tamara' },
                  { id: 'cod', label: 'Cash / POS' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`py-3 px-2 rounded-xl border text-center text-xs font-bold transition-all ${
                      paymentMethod === m.id
                        ? 'border-[#1B4332] bg-[#1B4332] text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Payment Details Area */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#1B4332]" />
                    <span>256-Bit SSL Encrypted Card Payment</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">CVV</label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'tabby' && (
                <div className="p-4 rounded-xl bg-[#29e7b2]/10 border border-[#29e7b2]/30 text-xs text-slate-800 space-y-1">
                  <div className="font-bold text-slate-900">Split into 4 interest-free payments of AED {(total / 4).toFixed(2)}</div>
                  <div className="text-slate-600">No interest. No fees. Sharia-compliant with Tabby UAE.</div>
                </div>
              )}

              {paymentMethod === 'apple_pay' && (
                <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1B4332]" />
                  <span>Instant 1-touch checkout with Apple Pay (Face ID / Touch ID).</span>
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="p-4 rounded-xl bg-[#E05A47]/10 border border-[#E05A47]/30 text-[#E05A47] text-xs font-semibold">
                {errorMessage}
              </div>
            )}
          </div>

          {/* Right Column: Order Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit'] pb-3 border-b border-slate-100">
                Order Summary
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <div className="flex-1 pr-2">
                      <div className="font-bold text-slate-900 line-clamp-1">
                        {item.type === 'single'
                          ? item.product?.name
                          : `${item.boxSize}-Pop Custom Box`}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Qty: {item.quantity} · AED {item.unitPrice} each
                      </div>
                    </div>
                    <span className="font-black text-[#1B4332] tabular-nums">
                      AED {item.totalPrice}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs font-medium">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="tabular-nums">AED {subtotal}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-[#1B4332] font-semibold">
                    <span>Discount ({promoCode})</span>
                    <span className="tabular-nums">- AED {promoDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Delivery (UAE)</span>
                  <span className="tabular-nums">
                    {deliveryFee === 0 ? <strong className="text-[#1B4332]">FREE</strong> : `AED ${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span className="text-[#1B4332] tabular-nums">AED {total}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-4 rounded-xl bg-[#1B4332] text-white font-bold text-sm hover:bg-[#133024] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Securing Order & Reserving Cold Chain...</span>
                ) : (
                  <>
                    <span>Confirm Order · AED {total}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center pt-2">
                <ShieldCheck className="w-4 h-4 text-[#1B4332]" />
                <span>Certified Sub-Zero Cold Delivery Guarantee</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
