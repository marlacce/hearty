import React from 'react';
import { Home, PlusCircle, Pill, MessageSquare } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'log', label: 'Log', icon: PlusCircle, path: '/log' },
    { id: 'meds', label: 'Meds', icon: Pill, path: '/meds' },
    { id: 'chat', label: 'Chat', icon: MessageSquare, path: '/chat' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2 bg-background/80 backdrop-blur-xl border-t border-secondary-container/30 shadow-[0_-8px_24px_rgba(27,28,25,0.04)] z-50 rounded-t-3xl">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={cn(
              "flex flex-col items-center justify-center px-5 py-1.5 rounded-2xl transition-all duration-200 active:scale-90",
              isActive 
                ? "bg-primary/10 text-primary" 
                : "text-secondary hover:bg-secondary-container/20"
            )}
          >
            <tab.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="font-sans font-medium text-[11px] mt-1">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
