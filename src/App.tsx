/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LocaleProvider } from './context/LocaleContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { RealtimeProvider } from './context/RealtimeContext';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWAInstallButton } from './components/PWAInstallButton';

import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { BuildBoxView } from './views/BuildBoxView';
import { CheckoutView } from './views/CheckoutView';
import { OrderTrackingView } from './views/OrderTrackingView';
import { AccountView } from './views/AccountView';
import { AdminView } from './views/AdminView';
import { SubscriptionsView } from './views/SubscriptionsView';
import { RewardsView } from './views/RewardsView';
import { StoresView } from './views/StoresView';
import { CorporateView } from './views/CorporateView';
import { SupportView } from './views/SupportView';

import { AppView, Product, Order } from './types';

const MainApp: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTrackedOrder, setActiveTrackedOrder] = useState<Order | null>(null);

  const handleNavigate = (view: AppView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProduct = (p: Product) => {
    setSelectedProduct(p);
  };

  const handleCloseProduct = () => {
    setSelectedProduct(null);
  };

  const handleOrderCompleted = (order: Order) => {
    setActiveTrackedOrder(order);
    setActiveView('order-tracking');
  };

  const handleTrackOrder = (order: Order) => {
    setActiveTrackedOrder(order);
    setActiveView('order-tracking');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-slate-900 selection:bg-[#1B4332] selection:text-white font-sans antialiased">
      {/* Offline Status Warning */}
      <OfflineIndicator />

      {/* Primary Header */}
      <Header currentView={activeView} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onOpenProductModal={handleOpenProduct}
          />
        )}
        {activeView === 'shop' && (
          <ShopView
            onNavigate={handleNavigate}
            onOpenProductModal={handleOpenProduct}
          />
        )}
        {activeView === 'build-box' && (
          <BuildBoxView
            onNavigate={handleNavigate}
            onOpenProductModal={handleOpenProduct}
          />
        )}
        {activeView === 'checkout' && (
          <CheckoutView
            onNavigate={handleNavigate}
            onOrderCompleted={handleOrderCompleted}
          />
        )}
        {activeView === 'order-tracking' && (
          <OrderTrackingView
            order={activeTrackedOrder}
            onNavigate={handleNavigate}
          />
        )}
        {activeView === 'account' && (
          <AccountView
            onNavigate={handleNavigate}
            onTrackOrder={handleTrackOrder}
          />
        )}
        {activeView === 'subscriptions' && (
          <SubscriptionsView
            onNavigate={handleNavigate}
          />
        )}
        {activeView === 'rewards' && (
          <RewardsView
            onNavigate={handleNavigate}
          />
        )}
        {activeView === 'stores' && (
          <StoresView
            onNavigate={handleNavigate}
          />
        )}
        {activeView === 'corporate' && (
          <CorporateView
            onNavigate={handleNavigate}
          />
        )}
        {activeView === 'support' && (
          <SupportView
            onNavigate={handleNavigate}
          />
        )}
        {activeView === 'admin' && (
          <AdminView
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={handleCloseProduct}
        onNavigateToBox={() => handleNavigate('build-box')}
      />

      {/* Persistent Shopping Drawer */}
      <CartDrawer onNavigate={handleNavigate} />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating PWA Install Prompt */}
      <PWAInstallButton />
    </div>
  );
};

export default function App() {
  return (
    <LocaleProvider>
      <AuthProvider>
        <RealtimeProvider>
          <CartProvider>
            <MainApp />
          </CartProvider>
        </RealtimeProvider>
      </AuthProvider>
    </LocaleProvider>
  );
}
