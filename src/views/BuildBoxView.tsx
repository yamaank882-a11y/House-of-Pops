import React, { useState, useEffect } from 'react';
import { Product, CustomBoxItem, AppView } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { Plus, Minus, Check, Sparkles, ShoppingBag, ArrowRight, RotateCcw, ShieldCheck } from 'lucide-react';

interface BuildBoxViewProps {
  onNavigate: (view: AppView) => void;
  onOpenProductModal: (p: Product) => void;
}

const BOX_TIERS = [
  { size: 4, name: 'Taster Pack', discountRate: 0, tag: 'Quick Treat' },
  { size: 6, name: 'Family Six', discountRate: 0.10, tag: 'Save 10%' },
  { size: 10, name: 'Happiness Box', discountRate: 0.15, tag: 'Most Popular · Save 15%' },
  { size: 12, name: 'Party Feast', discountRate: 0.20, tag: 'Best Value · Save 20%' },
];

export const BuildBoxView: React.FC<BuildBoxViewProps> = ({ onNavigate, onOpenProductModal }) => {
  const { addCustomBox } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedBoxSize, setSelectedBoxSize] = useState<number>(10);
  const [boxSlots, setBoxSlots] = useState<{ productId: string; productName: string; image: string; price: number }[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    api.getProducts().then((res) => {
      setProducts(res);
      // Pre-seed 3 pops for instant delight
      if (res.length >= 3) {
        setBoxSlots([
          { productId: res[0].id, productName: res[0].name, image: res[0].image, price: res[0].price },
          { productId: res[1].id, productName: res[1].name, image: res[1].image, price: res[1].price },
          { productId: res[2].id, productName: res[2].name, image: res[2].image, price: res[2].price },
        ]);
      }
    }).catch(console.error);
  }, []);

  const currentTier = BOX_TIERS.find((t) => t.size === selectedBoxSize) || BOX_TIERS[2];

  const handleSelectBoxSize = (newSize: number) => {
    setSelectedBoxSize(newSize);
    // Trim if over capacity
    if (boxSlots.length > newSize) {
      setBoxSlots((prev) => prev.slice(0, newSize));
    }
  };

  const handleAddPopToBox = (product: Product) => {
    if (boxSlots.length >= selectedBoxSize) {
      return;
    }
    setBoxSlots((prev) => [
      ...prev,
      { productId: product.id, productName: product.name, image: product.image, price: product.price },
    ]);
  };

  const handleRemoveSlot = (index: number) => {
    setBoxSlots((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleClearBox = () => {
    setBoxSlots([]);
  };

  const handleAutofillBestSellers = () => {
    if (!products.length) return;
    const bestSellers = products.filter((p) => p.isBestSeller);
    const pool = bestSellers.length ? bestSellers : products;
    const newSlots = [];
    for (let i = 0; i < selectedBoxSize; i++) {
      const prod = pool[i % pool.length];
      newSlots.push({ productId: prod.id, productName: prod.name, image: prod.image, price: prod.price });
    }
    setBoxSlots(newSlots);
  };

  // Calculations
  const rawTotal = boxSlots.reduce((sum, s) => sum + s.price, 0);
  // Extrapolate remaining slots at average AED 22 to show estimated final price
  const filledCount = boxSlots.length;
  const isFull = filledCount === selectedBoxSize;
  const estimatedFullRaw = isFull
    ? rawTotal
    : rawTotal + (selectedBoxSize - filledCount) * 22;

  const currentDiscountAmount = Math.round(rawTotal * currentTier.discountRate);
  const currentBoxPrice = rawTotal - currentDiscountAmount;

  const fullDiscountAmount = Math.round(estimatedFullRaw * currentTier.discountRate);
  const estimatedFullPrice = estimatedFullRaw - fullDiscountAmount;

  const handleAddToCart = () => {
    if (!isFull) return;

    // Aggregate into CustomBoxItem[]
    const map: Record<string, CustomBoxItem> = {};
    boxSlots.forEach((slot) => {
      if (!map[slot.productId]) {
        map[slot.productId] = {
          productId: slot.productId,
          productName: slot.productName,
          quantity: 0,
          image: slot.image,
        };
      }
      map[slot.productId].quantity += 1;
    });

    const boxItems = Object.values(map);
    addCustomBox(selectedBoxSize, boxItems);
  };

  const categories = ['All', 'Fruit Pops', 'Creamy Pops', 'Special Edition'];
  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen py-10 bg-[#FBFBFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1B4332] bg-[#1B4332]/10 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#F4B942]" />
            <span>Interactive Box Builder</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-['Outfit']">
            Build Your Custom Happiness Box
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Mix and match your favorite 100% natural fruit and creamy plant-based pops. Packed in dry-ice thermal insulation for guaranteed sub-zero arrival.
          </p>
        </div>

        {/* Step 1: Box Size Selector Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                Step 1: Choose Your Box Size
              </h3>
              <p className="text-xs text-slate-500">
                Larger boxes unlock higher volume discounts automatically.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAutofillBestSellers}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F4B942]" />
                <span>Fill With Best Sellers</span>
              </button>
              <button
                onClick={handleClearBox}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {BOX_TIERS.map((tier) => {
              const isSelected = selectedBoxSize === tier.size;
              return (
                <button
                  key={tier.size}
                  onClick={() => handleSelectBoxSize(tier.size)}
                  className={`p-4 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? 'border-[#1B4332] bg-[#1B4332]/5 ring-2 ring-[#1B4332]/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="text-[11px] font-bold text-[#1B4332] uppercase tracking-wider block mb-1">
                    {tier.tag}
                  </span>
                  <div className="text-lg font-black text-slate-900 font-['Outfit']">
                    {tier.size} Pops
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{tier.name}</div>
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#1B4332] text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main 2-Column Interface: Left = Box Visual Tray, Right = Flavor Catalog */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Real-Time Box Visual Tray (Sticky on Desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="bg-[#18231C] text-white rounded-3xl p-6 shadow-xl border border-white/5">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-lg font-black font-['Outfit']">Your Box Tray</h3>
                  <div className="text-xs text-slate-300">
                    {filledCount} of {selectedBoxSize} slots placed
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Total</div>
                  <div className="text-xl font-black text-[#F4B942] tabular-nums">
                    AED {isFull ? currentBoxPrice : estimatedFullPrice}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="my-4">
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F4B942] transition-all duration-300 rounded-full"
                    style={{ width: `${(filledCount / selectedBoxSize) * 100}%` }}
                  />
                </div>
                {currentTier.discountRate > 0 && (
                  <div className="mt-2 text-xs text-[#52B788] font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>
                      {Math.round(currentTier.discountRate * 100)}% Volume Discount Active (Save AED {isFull ? currentDiscountAmount : fullDiscountAmount})
                    </span>
                  </div>
                )}
              </div>

              {/* Isometric / Visual Box Grid */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="grid grid-cols-5 gap-2.5">
                  {Array.from({ length: selectedBoxSize }).map((_, slotIdx) => {
                    const slot = boxSlots[slotIdx];
                    return (
                      <div
                        key={slotIdx}
                        className={`aspect-[3/4] rounded-xl flex flex-col items-center justify-center p-1.5 transition-all relative border ${
                          slot
                            ? 'bg-white/15 border-white/20 shadow-inner'
                            : 'bg-white/5 border-dashed border-white/15'
                        }`}
                      >
                        {slot ? (
                          <>
                            <img
                              src={slot.image}
                              alt={slot.productName}
                              referrerPolicy="no-referrer"
                              className="w-full h-10 object-contain drop-shadow-md"
                            />
                            {/* Wooden stick visual */}
                            <div className="w-1.5 h-3 bg-[#E8BD8C] rounded-b-xs -mt-0.5" />
                            <span className="text-[9px] text-white/80 font-medium truncate w-full text-center mt-1">
                              {slot.productName.split(' ')[0]}
                            </span>
                            <button
                              onClick={() => handleRemoveSlot(slotIdx)}
                              className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#E05A47] text-white rounded-full flex items-center justify-center text-[10px] font-black hover:scale-110 transition-transform"
                              title="Remove from slot"
                            >
                              ×
                            </button>
                          </>
                        ) : (
                          <div className="text-center text-white/30 text-xs font-bold">
                            #{slotIdx + 1}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Box Action Button */}
              <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!isFull}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    isFull
                      ? 'bg-[#F4B942] text-[#1B4332] hover:bg-[#e5ac38] shadow-lg cursor-pointer'
                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {isFull
                      ? `Add ${selectedBoxSize}-Pop Box to Bag · AED ${currentBoxPrice}`
                      : `Pick ${selectedBoxSize - filledCount} More Pops To Complete Box`}
                  </span>
                </button>
                <p className="text-center text-[11px] text-slate-400">
                  Sub-zero thermal packaging included with temperature seal.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Flavor Selection Catalog */}
          <div className="lg:col-span-7 space-y-6">
            {/* Filter Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-semibold">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-[#1B4332] text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Flavor Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.map((product) => {
                const countInBox = boxSlots.filter((s) => s.productId === product.id).length;
                const isBoxFull = boxSlots.length >= selectedBoxSize;

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div>
                      {/* Product Header */}
                      <div className="flex gap-3">
                        <div
                          onClick={() => onOpenProductModal(product)}
                          className="w-20 h-24 bg-[#F4F3EE] rounded-xl p-2 flex items-center justify-center flex-shrink-0 cursor-pointer group"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="max-h-full w-auto object-contain group-hover:scale-105 transition-transform"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-[#1B4332] uppercase tracking-wider block">
                            {product.category}
                          </span>
                          <h4
                            onClick={() => onOpenProductModal(product)}
                            className="text-sm font-bold text-slate-900 hover:text-[#1B4332] cursor-pointer line-clamp-1 mt-0.5"
                          >
                            {product.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                            {product.description}
                          </p>
                          <div className="mt-2 text-xs font-black text-[#1B4332] tabular-nums">
                            AED {product.price}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Add to Box Button & Count Controller */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">
                        {countInBox > 0 ? (
                          <span className="font-bold text-[#1B4332]">{countInBox} in your box</span>
                        ) : (
                          'Not in box yet'
                        )}
                      </span>

                      <button
                        onClick={() => handleAddPopToBox(product)}
                        disabled={isBoxFull}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isBoxFull
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-[#1B4332] text-white hover:bg-[#133024]'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add To Slot</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
