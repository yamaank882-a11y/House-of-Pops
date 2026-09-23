import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Order, Subscription, UserReward, AppView } from '../types';
import { Package, Repeat, Award, MapPin, User, LogOut, ShieldAlert, CheckCircle2, ChevronRight, Recycle, ArrowUpRight } from 'lucide-react';

interface AccountViewProps {
  onNavigate: (view: AppView) => void;
  onTrackOrder: (order: Order) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({ onNavigate, onTrackOrder }) => {
  const { user, logout, switchUser, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'subscriptions' | 'rewards' | 'profile'>('orders');

  const [orders, setOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [rewards, setRewards] = useState<UserReward | null>(null);

  const [recycleCount, setRecycleCount] = useState(10);
  const [recycleSuccess, setRecycleSuccess] = useState('');
  const [redeemSuccess, setRedeemSuccess] = useState('');

  useEffect(() => {
    if (user?.id) {
      api.getOrders(user.id).then(setOrders).catch(console.error);
      api.getSubscriptions(user.id).then(setSubscriptions).catch(console.error);
      api.getRewards(user.id).then(setRewards).catch(console.error);
    }
  }, [user]);

  const handleUpdateSubscription = async (id: string, status: string) => {
    try {
      const updated = await api.updateSubscriptionStatus(id, status);
      setSubscriptions((prev) => prev.map((s) => (s.id === id ? updated : s)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRecycleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const res = await api.recordPackagingReturn(user.id, recycleCount);
      setRewards(res.rewards);
      setRecycleSuccess(`Earned ${res.pointsEarned} EcoPoints for returning ${recycleCount} sticks & wrappers!`);
      setTimeout(() => setRecycleSuccess(''), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRedeemPoints = async (points: number, label: string) => {
    if (!user) return;
    try {
      const res = await api.redeemReward(user.id, points, label);
      setRewards(res.rewards);
      setRedeemSuccess(`Successfully redeemed ${points} points for "${label}"!`);
      setTimeout(() => setRedeemSuccess(''), 4000);
    } catch (e: any) {
      alert(e.message || 'Could not redeem points');
    }
  };

  return (
    <div className="min-h-screen py-10 bg-[#FBFBFA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* User Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center text-2xl font-black font-['Outfit']">
              {user?.name.charAt(0) || 'H'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
                  {user?.name || 'Valued Guest'}
                </h1>
                <span className="text-[11px] font-bold text-[#1B4332] bg-[#1B4332]/10 px-2.5 py-0.5 rounded-full uppercase">
                  {user?.role || 'Customer'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email} · {user?.phone}</p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                switchUser(isAdmin ? 'customer' : 'admin');
              }}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#1B4332]" />
              <span>Switch to {isAdmin ? 'Customer Account' : 'Admin Operations'}</span>
            </button>
            <button
              onClick={logout}
              className="px-3.5 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto text-xs font-bold">
          {[
            { id: 'orders', label: `My Orders (${orders.length})`, icon: Package },
            { id: 'subscriptions', label: `Subscriptions (${subscriptions.length})`, icon: Repeat },
            { id: 'rewards', label: `Eco Rewards (${rewards?.currentPoints || 0} pts)`, icon: Award },
            { id: 'profile', label: 'Addresses & Settings', icon: MapPin },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1B4332] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
                <Package className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No orders placed yet</h3>
                <p className="text-xs text-slate-500">Order handcrafted 100% natural pops or build a box.</p>
                <button
                  onClick={() => onNavigate('shop')}
                  className="px-4 py-2 bg-[#1B4332] text-white text-xs font-bold rounded-xl"
                >
                  Shop Now
                </button>
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 font-['Outfit']">
                        #{ord.orderNumber}
                      </span>
                      <span className="text-[11px] font-bold text-[#1B4332] bg-[#1B4332]/10 px-2 py-0.5 rounded-full uppercase">
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(ord.createdAt).toLocaleDateString('en-AE', { dateStyle: 'medium' })} ·{' '}
                      {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'} · Total: AED {ord.total}
                    </div>
                    <div className="text-[11px] text-slate-600 line-clamp-1">
                      {ord.items.map((i) => i.productName).join(', ')}
                    </div>
                  </div>

                  <button
                    onClick={() => onTrackOrder(ord)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B4332] text-white text-xs font-bold hover:bg-[#133024] transition-colors"
                  >
                    <span>Track Live Delivery</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Subscriptions */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                  Your Active Recurring Plans
                </h3>
                <p className="text-xs text-slate-500">Save 15% on regular insulated box deliveries across UAE.</p>
              </div>
              <button
                onClick={() => onNavigate('subscriptions')}
                className="px-4 py-2 bg-[#1B4332] text-white text-xs font-bold rounded-xl hover:bg-[#133024]"
              >
                + New Subscription
              </button>
            </div>

            {subscriptions.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
                <Repeat className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No active subscriptions</h3>
                <p className="text-xs text-slate-500">Enjoy automated scheduled delivery and 15% discount.</p>
                <button
                  onClick={() => onNavigate('subscriptions')}
                  className="px-4 py-2 bg-[#1B4332] text-white text-xs font-bold rounded-xl"
                >
                  Explore Plans
                </button>
              </div>
            ) : (
              subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900 font-['Outfit']">
                          {sub.boxSize}-Pop Custom Variety Box
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            sub.status === 'ACTIVE'
                              ? 'bg-[#52B788]/20 text-[#1B4332]'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Frequency: <strong>{sub.planFrequency}</strong> · Next Dispatch:{' '}
                        <strong>{sub.nextDeliveryDate}</strong>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500">Price per dispatch</div>
                      <div className="text-lg font-black text-[#1B4332] tabular-nums">
                        AED {sub.pricePerDelivery}
                      </div>
                    </div>
                  </div>

                  {/* Flavor breakdown */}
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-900">Configured Pops: </span>
                    {sub.boxItems.map((bi) => `${bi.quantity}x ${bi.productName}`).join(', ')}
                  </div>

                  {/* Subscription Controls */}
                  <div className="pt-2 flex flex-wrap gap-2">
                    {sub.status === 'ACTIVE' ? (
                      <>
                        <button
                          onClick={() => handleUpdateSubscription(sub.id, 'SKIPPED')}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Skip Next Delivery
                        </button>
                        <button
                          onClick={() => handleUpdateSubscription(sub.id, 'PAUSED')}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-amber-700 hover:bg-amber-50"
                        >
                          Pause Plan
                        </button>
                        <button
                          onClick={() => handleUpdateSubscription(sub.id, 'CANCELLED')}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleUpdateSubscription(sub.id, 'ACTIVE')}
                        className="px-4 py-1.5 rounded-lg bg-[#1B4332] text-white text-xs font-bold hover:bg-[#133024]"
                      >
                        Resume Subscription
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Eco Rewards */}
        {activeTab === 'rewards' && (
          <div className="space-y-6">
            {/* Rewards Banner */}
            <div className="bg-[#1B4332] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">
                  Tier: {rewards?.tier || 'Sprout'}
                </span>
                <h3 className="text-2xl font-black font-['Outfit']">
                  {rewards?.currentPoints || 0} EcoPoints Available
                </h3>
                <p className="text-xs text-slate-200">
                  Lifetime earned: {rewards?.lifetimePoints || 0} points · Every 100 points = AED 10 savings
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleRedeemPoints(100, 'Free Classic Fruit Pop')}
                  disabled={(rewards?.currentPoints || 0) < 100}
                  className="px-4 py-2.5 rounded-xl bg-[#F4B942] text-[#1B4332] text-xs font-black hover:bg-[#e8af38] disabled:opacity-40 transition-colors"
                >
                  Redeem 100 pts (Free Pop)
                </button>
              </div>
            </div>

            {redeemSuccess && (
              <div className="p-4 rounded-xl bg-[#52B788]/20 border border-[#52B788]/40 text-[#1B4332] text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{redeemSuccess}</span>
              </div>
            )}

            {/* Packaging Recycling Logger */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#1B4332]/10 text-[#1B4332]">
                  <Recycle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 font-['Outfit']">
                    Log Wooden Sticks & Eco Wrapper Return
                  </h4>
                  <p className="text-xs text-slate-500">
                    Drop your biodegradable sticks at any House of Pops kiosk in UAE to earn 10 points per stick.
                  </p>
                </div>
              </div>

              <form onSubmit={handleRecycleSubmit} className="flex items-center gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700">Sticks Returned:</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={recycleCount}
                    onChange={(e) => setRecycleCount(Number(e.target.value))}
                    className="w-20 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1B4332] text-white text-xs font-bold hover:bg-[#133024]"
                >
                  Record Recycling (+{recycleCount * 10} pts)
                </button>
              </form>

              {recycleSuccess && (
                <div className="text-xs font-bold text-[#1B4332] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#52B788]" />
                  <span>{recycleSuccess}</span>
                </div>
              )}
            </div>

            {/* History Table */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-slate-900 font-['Outfit'] pb-2 border-b border-slate-100">
                Points Activity Log
              </h4>
              <div className="space-y-2">
                {rewards?.transactions?.map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-50">
                    <div>
                      <span className="font-semibold text-slate-900">{tx.description}</span>
                      <div className="text-[11px] text-slate-400">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      className={`font-black tabular-nums ${
                        tx.points > 0 ? 'text-[#1B4332]' : 'text-[#E05A47]'
                      }`}
                    >
                      {tx.points > 0 ? `+${tx.points}` : tx.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Profile & Addresses */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
              Saved UAE Addresses & Delivery Notes
            </h3>

            <div className="p-4 rounded-2xl border border-slate-200 bg-[#FBFBFA] flex items-start justify-between">
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">Home Villa (Default)</span>
                  <span className="text-[10px] bg-[#1B4332]/10 text-[#1B4332] px-2 py-0.5 rounded-full font-bold">
                    Primary
                  </span>
                </div>
                <div className="text-slate-600">Villa 28, Street 14B, Al Wasl / Jumeirah 2, Dubai, UAE</div>
                <div className="text-slate-400 italic">"Leave sub-zero box in shaded porch"</div>
              </div>
              <span className="text-xs text-[#1B4332] font-bold">Active</span>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
              Need to update your preferred language or phone number? Contact our concierge team anytime.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
