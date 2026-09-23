import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { RetailStore, AppView } from '../types';
import { MapPin, Phone, Clock, ShoppingBag, ExternalLink } from 'lucide-react';

interface StoresViewProps {
  onNavigate: (view: AppView) => void;
}

export const StoresView: React.FC<StoresViewProps> = ({ onNavigate }) => {
  const [stores, setStores] = useState<RetailStore[]>([]);
  const [selectedEmirate, setSelectedEmirate] = useState<string>('All');

  useEffect(() => {
    api.getStores().then(setStores).catch(console.error);
  }, []);

  const emirates = ['All', 'Dubai', 'Abu Dhabi'];
  const filtered = selectedEmirate === 'All'
    ? stores
    : stores.filter((s) => s.emirate === selectedEmirate);

  return (
    <div className="min-h-screen py-10 bg-[#FBFBFA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#1B4332] uppercase tracking-wider bg-[#1B4332]/10 px-3 py-1 rounded-full">
            UAE Retail Discovery
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-['Outfit']">
            Find House of Pops Near You
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Visit our branded pop kiosks across premier UAE malls and beach boardwalks. Grab an ice-cold pop or collect your pre-ordered online box.
          </p>
        </div>

        {/* Emirate filter */}
        <div className="flex justify-center gap-2 text-xs font-bold">
          {emirates.map((em) => (
            <button
              key={em}
              onClick={() => setSelectedEmirate(em)}
              className={`px-4 py-2 rounded-xl transition-colors ${
                selectedEmirate === em
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {em}
            </button>
          ))}
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="h-48 bg-[#F4F3EE] relative overflow-hidden">
                <img
                  src={store.image}
                  alt={store.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 text-[10px] font-bold text-white bg-[#1B4332] px-3 py-1 rounded-full uppercase tracking-wider">
                  {store.emirate}
                </span>
                {store.hasPickup && (
                  <span className="absolute top-4 right-4 text-[10px] font-bold text-[#1B4332] bg-[#F4B942] px-3 py-1 rounded-full uppercase tracking-wider">
                    Store Pickup Available
                  </span>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-['Outfit']">{store.name}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5" dir="rtl">{store.nameAr}</p>
                  <p className="text-xs text-slate-600 mt-2 flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-[#1B4332] flex-shrink-0 mt-0.5" />
                    <span>{store.locationDetails}, {store.area}</span>
                  </p>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{store.openingHours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{store.phone}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('build-box')}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#1B4332] text-white text-xs font-bold hover:bg-[#133024] transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Order Online For Pickup Here</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
