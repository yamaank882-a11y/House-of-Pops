import React, { useState } from 'react';
import { X, Trash2, ArrowRight, Sparkles, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { AppView } from '../types';

interface CartDrawerProps {
  onNavigate: (view: AppView) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    subtotal,
    promoCode,
    promoDiscount,
    deliveryFee,
    total,
    applyPromoCode,
    fulfillmentType,
    setFulfillmentType,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ success: boolean; text: string } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode) return;
    const res = applyPromoCode(inputCode);
    setPromoMessage({ success: res.success, text: res.message });
  };

  const freeDeliveryThreshold = 150;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const deliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FBFBFA] shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#1B4332]" />
              <h2 className="text-lg font-black text-slate-900 font-['Outfit']">Your Frozen Bag</h2>
              <span className="text-xs font-bold text-[#1B4332] bg-[#1B4332]/10 px-2 py-0.5 rounded-full">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              aria-label="Close cart"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          <div className="bg-[#1B4332]/5 p-3.5 border-b border-[#1B4332]/10">
            {fulfillmentType === 'PICKUP' ? (
              <div className="text-xs font-semibold text-[#1B4332] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#52B788]" />
                <span>Store Pickup Selected — AED 0 Delivery Fee!</span>
              </div>
            ) : remainingForFreeDelivery === 0 ? (
              <div className="text-xs font-semibold text-[#1B4332] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#52B788]" />
                <span>You unlocked FREE Sub-Zero Insulated UAE Delivery!</span>
              </div>
            ) : (
              <div>
                <div className="text-xs text-slate-700 mb-1.5 font-medium flex justify-between">
                  <span>Add <strong>AED {remainingForFreeDelivery}</strong> for FREE Delivery</span>
                  <span className="text-slate-500 font-bold">{Math.round(deliveryProgress)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1B4332] transition-all duration-300 rounded-full"
                    style={{ width: `${deliveryProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Fulfillment Toggle */}
          <div className="px-5 pt-3 pb-1 flex gap-2">
            <button
              onClick={() => setFulfillmentType('DELIVERY')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                fulfillmentType === 'DELIVERY'
                  ? 'bg-[#1B4332] text-white border-[#1B4332]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Cold Van Delivery
            </button>
            <button
              onClick={() => setFulfillmentType('PICKUP')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                fulfillmentType === 'PICKUP'
                  ? 'bg-[#1B4332] text-white border-[#1B4332]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Store Pickup
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Your bag is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  Treat yourself to 100% natural, plant-based ice pops or build your own custom variety box.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigate('build-box');
                  }}
                  className="mt-2 px-5 py-2.5 bg-[#1B4332] text-white text-xs font-bold rounded-xl hover:bg-[#133024] transition-colors"
                >
                  Build Your Own Box
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex gap-3.5"
                >
                  {/* Item Image */}
                  <div className="w-18 h-18 rounded-xl bg-[#F4F3EE] p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={
                        item.type === 'single'
                          ? item.product?.image
                          : '/src/assets/images/pop_box_assorted_1790195069629.jpg'
                      }
                      alt="Item preview"
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {item.type === 'single'
                            ? item.product?.name
                            : `Custom ${item.boxSize}-Pop Happiness Box`}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-[#E05A47] p-0.5"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.type === 'custom_box' && item.boxItems && (
                        <div className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                          {item.boxItems.map((bi) => `${bi.quantity}x ${bi.productName}`).join(', ')}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-[#FBFBFA]">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 font-bold text-xs"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-[#1B4332] tabular-nums">
                          AED {item.totalPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Controls */}
          {items.length > 0 && (
            <div className="p-5 bg-white border-t border-slate-200 space-y-3">
              {/* Promo code form */}
              <form onSubmit={handleApplyCode} className="space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Promo code (e.g. NATURAL15)"
                    className="flex-1 uppercase px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#1B4332]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p
                    className={`text-[11px] font-semibold ${
                      promoMessage.success ? 'text-[#1B4332]' : 'text-[#E05A47]'
                    }`}
                  >
                    {promoMessage.text}
                  </p>
                )}
              </form>

              {/* Cost summary table */}
              <div className="space-y-1 text-xs pt-1 border-t border-slate-100 font-medium">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="tabular-nums">AED {subtotal}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-[#1B4332] font-semibold">
                    <span>Promo Discount ({promoCode})</span>
                    <span className="tabular-nums">- AED {promoDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Delivery (UAE)</span>
                  <span className="tabular-nums">
                    {deliveryFee === 0 ? (
                      <strong className="text-[#1B4332]">FREE</strong>
                    ) : (
                      `AED ${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-[#1B4332] tabular-nums text-base">AED {total}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onNavigate('checkout');
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-[#1B4332] text-white font-bold text-sm hover:bg-[#133024] transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Proceed to UAE Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
