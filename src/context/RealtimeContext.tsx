import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

export interface LiveNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'inventory' | 'reward' | 'support' | 'info';
  timestamp: string;
}

interface RealtimeContextType {
  isConnected: boolean;
  notifications: LiveNotification[];
  dismissNotification: (id: string) => void;
  triggerRefresh: () => void;
  refreshKey: number;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<LiveNotification[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  useEffect(() => {
    const sseUrl = user ? `/api/realtime?userId=${user.id}&role=${user.role}` : '/api/realtime';
    const eventSource = new EventSource(sseUrl);

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onerror = () => {
      setIsConnected(false);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const newNotif: LiveNotification = {
          id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          title: 'Live Operational Update',
          message: '',
          type: 'info',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        if (data.type === 'ORDER_STATUS_CHANGED') {
          newNotif.title = `Order #${data.payload.orderNumber}`;
          newNotif.message = `Status updated to ${data.payload.status.replace(/_/g, ' ')}. ${data.payload.note || ''}`;
          newNotif.type = 'order';
          triggerRefresh();
        } else if (data.type === 'ORDER_CREATED') {
          newNotif.title = 'Order Dispatched';
          newNotif.message = `New order #${data.payload.order.orderNumber} placed successfully!`;
          newNotif.type = 'order';
          triggerRefresh();
        } else if (data.type === 'REWARD_EARNED') {
          newNotif.title = 'EcoPoints Update';
          newNotif.message = data.payload.message;
          newNotif.type = 'reward';
          triggerRefresh();
        } else if (data.type === 'INVENTORY_CHANGED') {
          newNotif.title = 'Stock Synchronization';
          newNotif.message = `Inventory stock levels refreshed at UAE central cold hub.`;
          newNotif.type = 'inventory';
          triggerRefresh();
        } else if (data.type === 'SUPPORT_MESSAGE_RECEIVED') {
          newNotif.title = 'Customer Care Chat';
          newNotif.message = data.payload.message || 'New response received from House of Pops concierge.';
          newNotif.type = 'support';
          triggerRefresh();
        } else if (data.type === 'DELIVERY_STATUS_CHANGED') {
          // Silent or low-key connection acknowledgment
          return;
        }

        if (newNotif.message) {
          setNotifications((prev) => [newNotif, ...prev.slice(0, 4)]);
          // Auto dismiss after 6 seconds
          setTimeout(() => {
            dismissNotification(newNotif.id);
          }, 6000);
        }
      } catch (err) {
        console.error('Failed parsing real-time SSE packet:', err);
      }
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, [user, triggerRefresh, dismissNotification]);

  return (
    <RealtimeContext.Provider
      value={{
        isConnected,
        notifications,
        dismissNotification,
        triggerRefresh,
        refreshKey,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) throw new Error('useRealtime must be used within a RealtimeProvider');
  return context;
};
