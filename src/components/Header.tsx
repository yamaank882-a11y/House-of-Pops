import React, { useState } from 'react';
import { ShoppingBag, User as UserIcon, Menu, X, ShieldAlert } from 'lucide-react';
import { AppView } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '../context/LocaleContext';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const { totalItemCount, setIsCartOpen } = useCart();
  const { user, isAdmin, switchUser } = useAuth();
  const { lang, setLang, t } = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; view: AppView }[] = [
    { label: t('shopPops'), view: 'shop' },
    { label: t('buildBox'), view: 'build-box' },
    { label: t('subscriptions'), view: 'subscriptions' },
    { label: t('rewards'), view: 'rewards' },
    { label: t('stores'), view: 'stores' },
    { label: t('corporate'), view: 'corporate' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBFA]/95 backdrop-blur-md border-b border-[#1B4332]/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="text-xl sm:text-2xl font-black tracking-tight text-[#1B4332] font-['Outfit'] hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <span>HOUSE OF POPS</span>
              <span className="w-2 h-2 rounded-full bg-[#E05A47] inline-block" />
            </button>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
            {navItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => onNavigate(item.view)}
                  className={`relative py-1 transition-colors whitespace-nowrap hover:text-[#1B4332] ${
                    isActive ? 'text-[#1B4332] font-semibold' : 'text-slate-600'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B4332] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 primary actions & utility controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* PWA Install Button */}
            <div className="hidden sm:block">
              <PWAInstallButton />
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="px-2 py-1 text-xs font-bold text-[#1B4332] rounded-md border border-[#1B4332]/20 hover:bg-[#1B4332]/5 transition-colors uppercase"
              title="Switch Language"
            >
              {lang === 'en' ? 'العربية' : 'EN'}
            </button>

            {/* Admin Switcher Quick Pill */}
            <button
              onClick={() => {
                if (isAdmin) {
                  onNavigate('admin');
                } else {
                  switchUser('admin');
                  onNavigate('admin');
                }
              }}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                isAdmin
                  ? 'bg-[#1B4332] text-white hover:bg-[#133024]'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
              title="Operations & Admin Portal"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            {/* Account Icon */}
            <button
              onClick={() => onNavigate('account')}
              className={`p-2 rounded-lg text-slate-700 hover:text-[#1B4332] hover:bg-slate-100 transition-colors relative ${
                currentView === 'account' ? 'text-[#1B4332] bg-slate-100' : ''
              }`}
              title={user ? `${user.name} (${user.role})` : 'Account'}
            >
              <UserIcon className="w-5 h-5" />
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-lg bg-[#1B4332] text-white hover:bg-[#133024] transition-colors"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-[#E05A47] text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-[#FBFBFA]">
                  {totalItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-[#1B4332] rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1B4332]/10 bg-[#FBFBFA] px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs text-slate-500 font-medium">
              Signed in as: <strong>{user?.name || 'Guest'}</strong>
            </span>
            <button
              onClick={() => {
                switchUser(isAdmin ? 'customer' : 'admin');
              }}
              className="text-xs font-semibold text-[#1B4332] underline"
            >
              Switch to {isAdmin ? 'Customer' : 'Admin'}
            </button>
          </div>
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => {
                  onNavigate(item.view);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
                  currentView === item.view ? 'bg-[#1B4332] text-white' : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-[#1B4332] hover:bg-slate-100"
            >
              Operations & Admin Console
            </button>
          </div>
          <div className="pt-2">
            <PWAInstallButton />
          </div>
        </div>
      )}
    </header>
  );
};
