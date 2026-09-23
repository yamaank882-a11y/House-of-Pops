import React, { useState, useEffect } from 'react';
import { AppView, Product, Campaign } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { Sparkles, ArrowRight, ShieldCheck, Leaf, Sun, Award, Star, ShoppingBag, MapPin, CheckCircle2 } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: AppView) => void;
  onOpenProductModal: (p: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenProductModal }) => {
  const { addItem } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    api.getProducts().then((res) => {
      setFeaturedProducts(res.filter((p) => p.isFeatured || p.isBestSeller).slice(0, 4));
    }).catch(console.error);

    api.getCampaigns().then(setCampaigns).catch(console.error);
  }, []);

  return (
    <div className="space-y-16 pb-20 bg-[#FBFBFA]">
      {/* UAE Weather Trigger & Seasonal Campaign Bar */}
      {campaigns.length > 0 && (
        <div className="bg-[#18231C] text-white py-3 px-4 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-[#F4B942]" />
              <span className="font-bold text-[#F4B942]">Dubai Current Temp: 38°C</span>
              <span className="hidden sm:inline text-white/50">|</span>
              <span className="text-slate-300 font-medium">
                {campaigns[0].title}
              </span>
            </div>
            <button
              onClick={() => onNavigate('build-box')}
              className="text-[#F4B942] hover:text-white font-bold flex items-center gap-1 transition-colors"
            >
              <span>{campaigns[0].ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Editorial Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative rounded-3xl bg-[#1B4332] text-white overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[540px]">
            {/* Left Copy Column */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 space-y-6 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#F4B942] backdrop-blur-xs">
                <Leaf className="w-3.5 h-3.5" />
                <span>100% Natural · UAE Plant-Based Ice Pops</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-['Outfit'] tracking-tight leading-[1.08]">
                Happiness on a stick, crafted with pure fruit.
              </h1>

              <p className="text-sm sm:text-base text-slate-200 max-w-lg leading-relaxed">
                Handcrafted in Dubai from cold-pressed ripe fruits. Zero refined sugar, zero preservatives, and zero single-use plastics. Delivered frozen in dry-ice thermal packs across the UAE.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('build-box')}
                  className="py-4 px-8 rounded-xl bg-[#F4B942] text-[#1B4332] font-black text-sm hover:bg-[#e8af38] transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Build Custom Box (Save 15%)</span>
                </button>

                <button
                  onClick={() => onNavigate('shop')}
                  className="py-4 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all border border-white/20 text-center"
                >
                  Browse All Pops
                </button>
              </div>

              {/* Fast Delivery Proof */}
              <div className="flex items-center gap-6 pt-4 border-t border-white/10 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#52B788]" />
                  <span>60-Min Express in Dubai</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#F4B942]" />
                  <span>Sub-Zero Cold Chain -18°C</span>
                </div>
              </div>
            </div>

            {/* Right Photography Column */}
            <div className="lg:col-span-5 h-full min-h-[380px] lg:min-h-[540px] relative">
              <img
                src="/src/assets/images/hero_house_of_pops_1790195019900.jpg"
                alt="House of Pops Natural Flavors"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#1B4332] via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Brand Value Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center font-bold">
              100%
            </div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Whole Real Fruit</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real Alfonso mangoes, freshly squeezed lemons, and wild berries. No concentrates or purees with added syrup.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#E05A47]/10 text-[#E05A47] flex items-center justify-center font-bold">
              0%
            </div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">No Refined Sugar</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sweetened gently with natural organic agave nectar and sweet dates. Guilt-free indulgence for families and kids.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#52B788]/10 text-[#52B788] flex items-center justify-center font-bold">
              🌱
            </div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Zero Plastic Packaging</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Natural FSC-certified wooden sticks and 100% compostable cellulose wrapping that returns harmlessly to the earth.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#F4B942]/10 text-[#F4B942] flex items-center justify-center font-bold">
              -18°
            </div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Sub-Zero Fleet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Specially equipped refrigerated logistics across all 7 UAE Emirates to guarantee pops arrive in rock-solid frozen state.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#1B4332] uppercase tracking-wider">
              Artisanal Selection
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit'] mt-1">
              UAE's Favorite Pops
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold text-[#1B4332] hover:underline flex items-center gap-1"
          >
            <span>View All Flavors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              <div
                onClick={() => onOpenProductModal(product)}
                className="bg-[#F4F3EE] p-6 flex items-center justify-center cursor-pointer min-h-[200px]"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="max-h-[160px] w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                />
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span className="font-bold text-[#1B4332] uppercase">{product.category}</span>
                    <span className="tabular-nums font-semibold">{product.nutrition.calories} kcal</span>
                  </div>
                  <h3
                    onClick={() => onOpenProductModal(product)}
                    className="text-sm font-bold text-slate-900 group-hover:text-[#1B4332] cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {product.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-base font-black text-[#1B4332] tabular-nums">
                      AED {product.price}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Star className="w-3 h-3 fill-[#F4B942] text-[#F4B942]" />
                      <span>{product.rating}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => addItem(product, 1)}
                    className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-[#1B4332] text-white text-xs font-bold hover:bg-[#133024] transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Build Your Own Box Banner Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#18231C] text-white p-8 sm:p-12 border border-white/5 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 z-10 relative">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F4B942]">
                Custom Box Experience
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-['Outfit']">
                Fill Your Freezer With 100% Pure Happiness.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Choose 4, 6, 10, or 12 pops with interactive flavor slotting. Unlock up to 20% savings and free sub-zero insulated home delivery.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('build-box')}
                  className="py-3.5 px-8 rounded-xl bg-[#F4B942] text-[#1B4332] font-black text-sm hover:bg-[#e8af38] transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Building Box Now</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <img
                src="/src/assets/images/pop_box_assorted_1790195069629.jpg"
                alt="Custom Box Assortment"
                referrerPolicy="no-referrer"
                className="max-h-72 w-auto object-contain rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* UAE Retail Presence & Kiosks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#1B4332] uppercase tracking-wider">
              Experience In Person
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit'] mt-1">
              Visit House of Pops Kiosks
            </h2>
          </div>
          <button
            onClick={() => onNavigate('stores')}
            className="text-xs font-bold text-[#1B4332] hover:underline flex items-center gap-1"
          >
            <span>All UAE Locations & Store Pickup</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'The Dubai Mall', area: 'Downtown Dubai', hours: '10 AM - 11 PM', note: 'Ground Floor Aquarium Promenade' },
            { name: 'Kite Beach Boardwalk', area: 'Jumeirah', hours: '9 AM - Midnight', note: 'Kiosk #7 Beachfront' },
            { name: 'Yas Mall', area: 'Abu Dhabi', hours: '10 AM - 10 PM', note: 'Fashion Avenue Atrium' },
          ].map((loc, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1B4332]">
                <MapPin className="w-4 h-4" />
                <span>{loc.area}</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 font-['Outfit']">{loc.name}</h4>
              <p className="text-xs text-slate-500">{loc.note}</p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                Hours: {loc.hours} · <strong>Store Pickup Ready</strong>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
