import React from 'react';
import { AppView } from '../types';
import { Leaf, Award, Recycle, ShieldCheck, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#18231C] text-slate-300 pt-16 pb-12 border-t border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/5 text-[#F4B942]">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">100% Natural</h4>
              <p className="text-xs text-slate-400">Pure cold-pressed whole fruit</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/5 text-[#E05A47]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">No Refined Sugar</h4>
              <p className="text-xs text-slate-400">Sweetened naturally with agaves & dates</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/5 text-[#52B788]">
              <Recycle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Zero Plastic Guarantee</h4>
              <p className="text-xs text-slate-400">Compostable wooden sticks & film</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/5 text-[#F4B942]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Sub-Zero UAE Delivery</h4>
              <p className="text-xs text-slate-400">Insulated dry-ice vans across UAE</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white font-['Outfit']">HOUSE OF POPS</span>
              <span className="w-2 h-2 rounded-full bg-[#E05A47]" />
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Pioneering natural happiness on a stick across the United Arab Emirates. Handcrafted with passion, pure fruit, and an uncompromising commitment to clean health and our planet.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <MapPin className="w-4 h-4 text-[#F4B942]" />
              <span>Dubai Central Cold Kitchen, Al Quoz Industrial 4, UAE</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Discover</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  All Artisanal Pops
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('build-box')} className="hover:text-white transition-colors">
                  Build Your Own Box
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('subscriptions')} className="hover:text-white transition-colors">
                  Subscribe & Save 15%
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('rewards')} className="hover:text-white transition-colors">
                  Eco Rewards Program
                </button>
              </li>
            </ul>
          </div>

          {/* Retail & Business */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Ecosystem</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('stores')} className="hover:text-white transition-colors">
                  UAE Kiosks & Stores
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('corporate')} className="hover:text-white transition-colors">
                  Corporate & Event Catering
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support')} className="hover:text-white transition-colors">
                  Concierge Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-[#F4B942] transition-colors">
                  Operations Console
                </button>
              </li>
            </ul>
          </div>

          {/* Compliance & Market */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">UAE Coverage</h5>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Daily refrigerated delivery across Dubai, Abu Dhabi, Sharjah, Ajman, RAK, UAQ, and Fujairah.
            </p>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs space-y-1">
              <div className="font-semibold text-white">Cold Chain Certified</div>
              <div className="text-slate-400">Guaranteed -18°C arrival temperature with reusable thermal liners.</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} House of Pops UAE. All rights reserved. 100% Plant-Based & Clean Label.
          </div>
          <div className="flex items-center gap-4">
            <span>Dubai Municipality Food Safety Certified</span>
            <span>·</span>
            <span>Halal Certified</span>
            <span>·</span>
            <span>Zero Single-Use Plastics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
