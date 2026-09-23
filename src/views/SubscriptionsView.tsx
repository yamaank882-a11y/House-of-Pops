import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AppView, Product, CustomBoxItem } from '../types';
import { Repeat, ShieldCheck, Check, Sparkles, Truck, Clock, Calendar } from 'lucide-react';

interface SubscriptionsViewProps {
  onNavigate: (view: AppView) => void;
}

export const SubscriptionsView: React.FC<SubscriptionsViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [frequency, setFrequency] = useState<'WEEKLY' | 'BIWEEKLY' | 'MONTHLY'>('BIWEEKLY');
  const [boxSize, setBoxSize] = useState<number>(10);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  const [deliverySlot, setDeliverySlot] = useState('Morning (10:00 AM - 1:00 PM)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    api.getProducts().then((res) => {
      setProducts(res);
      // Pre-select 4 mango, 3 choco, 3 coconut
      if (res.length >= 3) {
        setSelectedItems({
          [res[0].id]: 4,
          [res[1].id]: 3,
          [res[2].id]: 3,
        });
      }
    }).catch(console.error);
  }, []);

  const totalAssorted = Object.values(selectedItems).reduce((sum, n) => sum + n, 0);

  const handleUpdateItem = (productId: string, delta: number) => {
    const cur = selectedItems[productId] || 0;
    const next = Math.max(0, cur + delta);
    if (delta > 0 && totalAssorted >= boxSize) return;

    setSelectedItems((prev) => ({
      ...prev,
      [productId]: next,
    }));
  };

  const basePrice = boxSize * 22;
  const subscriptionDiscount = Math.round(basePrice * 0.15);
  const pricePerDelivery = basePrice - subscriptionDiscount;

  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalAssorted !== boxSize) {
      alert(`Please pick exactly ${boxSize} pops to complete your recurring subscription box.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const boxItems: CustomBoxItem[] = Object.entries(selectedItems)
        .filter(([_, q]) => q > 0)
        .map(([id, q]) => {
          const prod = products.find((p) => p.id === id);
          return {
            productId: id,
            productName: prod?.name || 'Artisanal Pop',
            quantity: q,
            image: prod?.image || '',
          };
        });

      await api.createSubscription({
        userId: user?.id || 'guest',
        customerName: user?.name || 'Valued Subscriber',
        customerEmail: user?.email || 'subscriber@houseofpops.ae',
        planFrequency: frequency,
        boxSize,
        boxItems,
        deliverySlot,
      });

      setSuccessMessage('Your recurring subscription has been activated! Managed effortlessly from your account.');
      setTimeout(() => {
        onNavigate('account');
      }, 2000);
    } catch (e: any) {
      alert(e.message || 'Failed to initialize subscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 bg-[#FBFBFA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Banner */}
        <div className="bg-[#1B4332] text-white rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#F4B942]">
            <Repeat className="w-3.5 h-3.5" />
            <span>House of Pops Club</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-['Outfit']">
            Subscribe & Save 15% on Every Delivery
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto leading-relaxed">
            Never run out of pure, healthy frozen treats. Flexible recurring deliveries across the UAE with complimentary sub-zero dry-ice shipping. Pause, edit, or cancel anytime with one click.
          </p>
        </div>

        {successMessage && (
          <div className="max-w-xl mx-auto p-4 rounded-2xl bg-[#52B788]/20 border border-[#52B788]/40 text-[#1B4332] text-xs font-bold text-center">
            {successMessage}
          </div>
        )}

        {/* Configuration Matrix */}
        <form onSubmit={handleCreateSubscription} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Frequency */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                Step 1: Choose Delivery Cadence
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'WEEKLY', label: 'Weekly', desc: 'Every 7 days' },
                  { id: 'BIWEEKLY', label: 'Bi-Weekly', desc: 'Every 14 days (Most Popular)' },
                  { id: 'MONTHLY', label: 'Monthly', desc: 'Every 30 days' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFrequency(f.id as any)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      frequency === f.id
                        ? 'border-[#1B4332] bg-[#1B4332]/5 ring-1 ring-[#1B4332]'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-sm font-bold text-slate-900 font-['Outfit']">{f.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{f.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Box Size */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                Step 2: Choose Box Size
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { size: 6, label: '6-Pop Box', desc: 'Couples / Small household' },
                  { size: 10, label: '10-Pop Box', desc: 'Family favorite' },
                  { size: 12, label: '12-Pop Box', desc: 'Daily wellness pack' },
                ].map((b) => (
                  <button
                    key={b.size}
                    type="button"
                    onClick={() => setBoxSize(b.size)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      boxSize === b.size
                        ? 'border-[#1B4332] bg-[#1B4332]/5 ring-1 ring-[#1B4332]'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-sm font-bold text-slate-900 font-['Outfit']">{b.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{b.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Flavors Selection */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                    Step 3: Select Your Recurring Flavors
                  </h3>
                  <p className="text-xs text-slate-500">
                    Selected: {totalAssorted} of {boxSize} pops
                  </p>
                </div>
                <div
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    totalAssorted === boxSize
                      ? 'bg-[#52B788]/20 text-[#1B4332]'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {totalAssorted === boxSize ? 'Box Complete' : `Need ${boxSize - totalAssorted} more`}
                </div>
              </div>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
                {products.map((p) => {
                  const qty = selectedItems[p.id] || 0;
                  return (
                    <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 object-contain bg-[#F4F3EE] p-1 rounded-lg"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{p.name}</div>
                          <div className="text-[11px] text-slate-400">{p.category}</div>
                        </div>
                      </div>

                      <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                        <button
                          type="button"
                          onClick={() => handleUpdateItem(p.id, -1)}
                          className="w-7 h-7 flex items-center justify-center font-bold text-slate-600 hover:text-slate-900"
                        >
                          -
                        </button>
                        <span className="w-7 text-center font-bold text-slate-900 tabular-nums">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateItem(p.id, 1)}
                          disabled={totalAssorted >= boxSize}
                          className="w-7 h-7 flex items-center justify-center font-bold text-slate-600 hover:text-slate-900 disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Subscription Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 lg:sticky lg:top-24">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit'] pb-2 border-b border-slate-100">
                Subscription Plan Summary
              </h3>

              <div className="space-y-2 text-xs font-medium text-slate-600">
                <div className="flex justify-between">
                  <span>Frequency</span>
                  <strong className="text-slate-900">{frequency}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Box Size</span>
                  <strong className="text-slate-900">{boxSize} Pops</strong>
                </div>
                <div className="flex justify-between">
                  <span>Base Price</span>
                  <span className="tabular-nums">AED {basePrice}</span>
                </div>
                <div className="flex justify-between text-[#1B4332] font-bold">
                  <span>Club Member Discount (15%)</span>
                  <span className="tabular-nums">- AED {subscriptionDiscount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sub-Zero Home Delivery</span>
                  <strong className="text-[#1B4332]">FREE</strong>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                  <span>Per Delivery</span>
                  <span className="text-[#1B4332] tabular-nums">AED {pricePerDelivery}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={totalAssorted !== boxSize || isSubmitting}
                className="w-full py-4 px-4 rounded-xl bg-[#1B4332] text-white font-bold text-sm hover:bg-[#133024] transition-colors shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Starting Plan...' : 'Activate Subscription Plan'}
              </button>

              <div className="text-[11px] text-slate-400 text-center space-y-1 pt-1">
                <div>No lock-in commitments.</div>
                <div>Skip a delivery or cancel anytime in your account.</div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
