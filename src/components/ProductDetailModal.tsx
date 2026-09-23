import React, { useState, useEffect } from 'react';
import { Product, ProductReview } from '../types';
import { X, Star, ShoppingBag, ShieldCheck, Heart, Sparkles, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onNavigateToBox?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'nutrition' | 'reviews'>('details');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      api.getReviews(product.id).then(setReviews).catch(console.error);
    }
  }, [product]);

  if (!product) return null;

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmittingReview(true);
    try {
      const added = await api.addReview({
        productId: product.id,
        userName: 'Verified Pop Lover',
        rating: newRating,
        comment: newComment.trim(),
      });
      setReviews([added, ...reviews]);
      setNewComment('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#FBFBFA] shadow-2xl border border-slate-200 overflow-hidden my-8 animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-sm transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Product Visual */}
          <div className="relative bg-[#F4F3EE] p-6 flex flex-col items-center justify-center min-h-[300px] md:min-h-[440px]">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="max-h-[320px] w-auto object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
            />
            {product.isBestSeller && (
              <span className="absolute top-4 left-4 text-xs font-bold text-[#1B4332] bg-[#F4B942] px-2.5 py-1 rounded-full uppercase tracking-wider">
                Best Seller
              </span>
            )}
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute bottom-4 left-4 p-2 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-[#E05A47] transition-colors"
              title="Add to favorites"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#E05A47] text-[#E05A47]' : ''}`} />
            </button>
          </div>

          {/* Right Column: Information & Purchase Module */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-[#1B4332] uppercase tracking-wider mb-1">
                {product.category}
              </div>
              <h2 className="text-2xl font-black text-slate-900 font-['Outfit'] leading-tight">
                {product.name}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5" dir="rtl">
                {product.nameAr}
              </p>

              {/* Price & Rating */}
              <div className="flex items-center justify-between mt-3 pb-3 border-b border-slate-200">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-[#1B4332] tabular-nums">
                    AED {product.price}
                  </span>
                  <span className="text-xs text-slate-500">/ pop</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Star className="w-4 h-4 fill-[#F4B942] text-[#F4B942]" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400 font-normal">({reviews.length || product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg mt-4 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`flex-1 py-1.5 rounded-md transition-colors ${
                    activeTab === 'details' ? 'bg-white text-[#1B4332] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('nutrition')}
                  className={`flex-1 py-1.5 rounded-md transition-colors ${
                    activeTab === 'nutrition' ? 'bg-white text-[#1B4332] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Nutrition Facts
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`flex-1 py-1.5 rounded-md transition-colors ${
                    activeTab === 'reviews' ? 'bg-white text-[#1B4332] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Reviews ({reviews.length})
                </button>
              </div>

              {/* Tab Content */}
              <div className="mt-4 min-h-[160px] text-xs">
                {activeTab === 'details' && (
                  <div className="space-y-3">
                    <p className="text-slate-600 leading-relaxed">{product.description}</p>
                    <div className="pt-2">
                      <div className="font-bold text-slate-900 mb-1">Pure Ingredients:</div>
                      <p className="text-slate-600">{product.ingredients.join(' · ')}</p>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 mb-1">Allergen Notice:</div>
                      <p className="text-slate-600">{product.allergens.join(', ')}</p>
                    </div>
                    {/* Dietary Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-[#1B4332] font-semibold">
                      {product.dietaryTags.map((t, idx) => (
                        <span key={idx}>
                          {t} {idx < product.dietaryTags.length - 1 ? '·' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'nutrition' && (
                  <div className="border border-slate-200 rounded-xl p-3 bg-white space-y-1.5 font-medium">
                    <div className="flex justify-between border-b pb-1 text-slate-900 font-bold">
                      <span>Serving Size</span>
                      <span>{product.nutrition.servingSize}</span>
                    </div>
                    <div className="flex justify-between text-slate-800 font-bold">
                      <span>Calories</span>
                      <span className="tabular-nums">{product.nutrition.calories} kcal</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Total Fat</span>
                      <span className="tabular-nums">{product.nutrition.totalFatG}g</span>
                    </div>
                    <div className="flex justify-between text-slate-600 pl-2">
                      <span>Saturated Fat</span>
                      <span className="tabular-nums">{product.nutrition.saturatedFatG}g</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Carbohydrates</span>
                      <span className="tabular-nums">{product.nutrition.carbsG}g</span>
                    </div>
                    <div className="flex justify-between text-slate-600 pl-2">
                      <span>Natural Sugars (No added refined)</span>
                      <span className="tabular-nums">{product.nutrition.sugarsG}g</span>
                    </div>
                    <div className="flex justify-between text-slate-600 pl-2">
                      <span>Dietary Fiber</span>
                      <span className="tabular-nums">{product.nutrition.fiberG}g</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Plant Protein</span>
                      <span className="tabular-nums">{product.nutrition.proteinG}g</span>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                    {reviews.length === 0 ? (
                      <p className="text-slate-400 italic">No reviews yet. Be the first to share your thoughts!</p>
                    ) : (
                      reviews.map((rev) => (
                        <div key={rev.id} className="p-2.5 rounded-lg bg-white border border-slate-100 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{rev.userName}</span>
                            <div className="flex text-[#F4B942]">
                              {Array.from({ length: rev.rating }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-600 text-xs">{rev.comment}</p>
                          {rev.verifiedPurchase && (
                            <div className="flex items-center gap-1 text-[10px] text-[#1B4332] font-semibold">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Verified UAE Purchase</span>
                            </div>
                          )}
                        </div>
                      ))
                    )}

                    {/* Add Review Box */}
                    <form onSubmit={handleAddReview} className="pt-2 border-t border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">Leave a review:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              type="button"
                              key={s}
                              onClick={() => setNewRating(s)}
                              className={`p-0.5 ${newRating >= s ? 'text-[#F4B942]' : 'text-slate-300'}`}
                            >
                              <Star className="w-4 h-4 fill-current" />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="How did you enjoy this pop?"
                          className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#1B4332]"
                        />
                        <button
                          type="submit"
                          disabled={isSubmittingReview}
                          className="px-3 py-1.5 bg-[#1B4332] text-white rounded-lg font-semibold text-xs hover:bg-[#133024] disabled:opacity-50"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 mt-4">
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center border border-slate-300 rounded-xl bg-white p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={() => {
                    addItem(product, quantity);
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1B4332] text-white font-bold text-sm hover:bg-[#133024] transition-colors shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag · AED {product.price * quantity}</span>
                </button>
              </div>
              <div className="mt-2 text-center text-[11px] text-slate-500">
                ⚡ Express delivery within 60 mins available across Dubai
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
