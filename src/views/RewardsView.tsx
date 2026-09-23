import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { UserReward, AppView } from '../types';
import { Award, Leaf, Recycle, Gift, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface RewardsViewProps {
  onNavigate: (view: AppView) => void;
}

export const RewardsView: React.FC<RewardsViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<UserReward | null>(null);
  const [stickCount, setStickCount] = useState(10);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.id) {
      api.getRewards(user.id).then(setRewards).catch(console.error);
    }
  }, [user]);

  const handleReturnSticks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onNavigate('account');
      return;
    }
    try {
      const res = await api.recordPackagingReturn(user.id, stickCount);
      setRewards(res.rewards);
      setMessage(`Earned ${res.pointsEarned} EcoPoints for recycling ${stickCount} wooden sticks!`);
      setTimeout(() => setMessage(''), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen py-10 bg-[#FBFBFA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Banner */}
        <div className="bg-[#1B4332] text-white rounded-3xl p-8 sm:p-12 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#52B788]">
            <Recycle className="w-3.5 h-3.5" />
            <span>Zero Plastic Mission</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-['Outfit']">
            Eco Rewards: Happiness That Gives Back
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto leading-relaxed">
            Every stick counts. Earn points on orders, subscriptions, and by bringing back your compostable sticks to any House of Pops kiosk in UAE.
          </p>
        </div>

        {/* User Current Tier Status */}
        {user && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Current Tier: {rewards?.tier || 'Sprout'}
                </span>
                <div className="text-2xl font-black text-slate-900 font-['Outfit']">
                  {rewards?.currentPoints || 0} Available Points
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('account')}
              className="px-5 py-2.5 rounded-xl bg-[#1B4332] text-white text-xs font-bold hover:bg-[#133024] transition-colors"
            >
              View Points History & Vouchers
            </button>
          </div>
        )}

        {/* How To Earn Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center font-bold">
              1x
            </div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Earn on Every AED</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Receive 1 EcoPoint for every 1 AED spent on individual pops, party boxes, and corporate catering.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#52B788]/10 text-[#52B788] flex items-center justify-center font-bold">
              10x
            </div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Recycle Wooden Sticks</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Return 10 sticks to any of our UAE kiosks and get 100 EcoPoints credited directly to your account.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#F4B942]/10 text-[#F4B942] flex items-center justify-center font-bold">
              🎁
            </div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Redeem for Free Pops</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every 100 EcoPoints = 1 Free handcrafted fruit pop, or stack points for discounts on 12-pop boxes.
            </p>
          </div>
        </div>

        {/* Recycling Simulator Form */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
            Recycle Wooden Sticks & Wrapper Logger
          </h3>
          <p className="text-xs text-slate-500">
            Select the number of clean FSC wooden sticks and compostable wrappers dropped off at our retail kiosks:
          </p>

          <form onSubmit={handleReturnSticks} className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">Quantity of Sticks:</span>
              <input
                type="number"
                min="1"
                max="100"
                value={stickCount}
                onChange={(e) => setStickCount(Number(e.target.value))}
                className="w-24 px-3 py-2 text-xs font-bold rounded-xl border border-slate-300"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-[#1B4332] text-white text-xs font-bold hover:bg-[#133024] transition-colors"
            >
              Log Drop-off (+{stickCount * 10} EcoPoints)
            </button>
          </form>

          {message && (
            <div className="p-3 rounded-xl bg-[#52B788]/20 text-[#1B4332] text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
