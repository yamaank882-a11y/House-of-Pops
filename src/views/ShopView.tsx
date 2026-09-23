import React, { useState, useEffect, useMemo } from 'react';
import { Product, AppView } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { Search, ShoppingBag, Star, Sparkles, Filter, Check, Eye } from 'lucide-react';

interface ShopViewProps {
  onNavigate: (view: AppView) => void;
  onOpenProductModal: (p: Product) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({ onNavigate, onOpenProductModal }) => {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'price-asc' | 'price-desc'>('featured');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getProducts()
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const dietaryOptions = ['100% Natural', 'Plant-Based / Vegan', 'No Added Sugar', 'Gluten Free'];

  const toggleDietary = (opt: string) => {
    setSelectedDietary((prev) =>
      prev.includes(opt) ? prev.filter((d) => d !== opt) : [...prev, opt]
    );
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.ingredients.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCat =
          selectedCategory === 'All' || p.category === selectedCategory;

        const matchesDietary =
          selectedDietary.length === 0 ||
          selectedDietary.every((d) => p.dietaryTags.some((tag) => tag.includes(d)));

        return matchesSearch && matchesCat && matchesDietary;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, searchQuery, selectedCategory, selectedDietary, sortBy]);

  const categories = ['All', 'Fruit Pops', 'Creamy Pops', 'Special Edition'];

  return (
    <div className="min-h-screen py-10 bg-[#FBFBFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Promo Callout */}
        <div className="bg-[#1B4332] text-white rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 z-10 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F4B942]">
              100% Natural UAE Cold-Pressed Pops
            </span>
            <h1 className="text-3xl sm:text-4xl font-black font-['Outfit']">
              Pure Ingredients. Zero Regrets.
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Explore our full collection of artisanal fruit and creamy plant-based pops. Sweetened naturally, delivered sub-zero.
            </p>
          </div>
          <div className="z-10 flex-shrink-0">
            <button
              onClick={() => onNavigate('build-box')}
              className="py-3 px-6 rounded-xl bg-[#F4B942] text-[#1B4332] font-black text-sm hover:bg-[#e8af38] transition-colors flex items-center gap-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>Build Custom Box (Save 15%)</span>
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search mango, cacao, passionfruit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#1B4332]"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#1B4332] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <span className="text-xs text-slate-500 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-semibold text-slate-800 bg-slate-100 rounded-lg px-3 py-1.5 border-none focus:ring-1 focus:ring-[#1B4332]"
              >
                <option value="featured">Featured First</option>
                <option value="rating">Top Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Dietary Filters */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Dietary:</span>
            </span>
            {dietaryOptions.map((opt) => {
              const active = selectedDietary.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => toggleDietary(opt)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    active
                      ? 'bg-[#1B4332]/10 text-[#1B4332] border border-[#1B4332]'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {active && <Check className="w-3 h-3" />}
                  <span>{opt}</span>
                </button>
              );
            })}
            {selectedDietary.length > 0 && (
              <button
                onClick={() => setSelectedDietary([])}
                className="text-xs text-[#E05A47] font-semibold hover:underline ml-2"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Product Catalog Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
            <h3 className="text-base font-bold text-slate-800">No pops found matching your search</h3>
            <p className="text-xs text-slate-500">Try adjusting your filters or search keywords.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedDietary([]);
              }}
              className="px-4 py-2 bg-[#1B4332] text-white rounded-xl text-xs font-bold hover:bg-[#133024]"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group"
              >
                {/* Visual Header */}
                <div
                  onClick={() => onOpenProductModal(product)}
                  className="relative bg-[#F4F3EE] p-6 flex items-center justify-center cursor-pointer overflow-hidden min-h-[220px]"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="max-h-[170px] w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                  />
                  {product.isBestSeller && (
                    <span className="absolute top-3 left-3 text-[10px] font-bold text-[#1B4332] bg-[#F4B942] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Best Seller
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenProductModal(product);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-600 shadow-xs transition-colors"
                    title="Quick preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="font-bold text-[#1B4332] uppercase">{product.category}</span>
                      <span className="tabular-nums font-semibold">{product.nutrition.calories} kcal</span>
                    </div>

                    <h3
                      onClick={() => onOpenProductModal(product)}
                      className="text-sm font-bold text-slate-900 group-hover:text-[#1B4332] transition-colors cursor-pointer line-clamp-1"
                    >
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium" dir="rtl">
                      {product.nameAr}
                    </p>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-base font-black text-[#1B4332] tabular-nums">
                        AED {product.price}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                        <Star className="w-3 h-3 fill-[#F4B942] text-[#F4B942]" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => addItem(product, 1)}
                      className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-[#1B4332] text-white text-xs font-bold hover:bg-[#133024] transition-colors shadow-2xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
