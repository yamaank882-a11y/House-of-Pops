import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-[#E05A47] px-3.5 py-2 text-xs font-semibold text-white shadow-xl animate-fade-in"
    >
      <WifiOff className="w-4 h-4" />
      <span>Offline Mode — Browsing cached pops catalog. Reconnecting...</span>
    </div>
  );
};
