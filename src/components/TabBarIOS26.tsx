import React from 'react';
import { Trophy, Swords, BarChart3, History, Crown, Settings } from 'lucide-react';
import { playHapticSound } from '../utils/audio';

export type TabKey = 'leaderboard' | 'duels' | 'analytics' | 'history' | 'pro' | 'settings';

interface TabBarIOS26Props {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  isProUnlocked: boolean;
  soundEnabled: boolean;
  logCount?: number;
}

interface TabDef {
  key: TabKey;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
}

export const TabBarIOS26: React.FC<TabBarIOS26Props> = ({
  activeTab,
  onTabChange,
  isProUnlocked,
  soundEnabled,
  logCount = 0
}) => {
  const tabs: TabDef[] = [
    { key: 'leaderboard', label: 'Tabela', icon: Trophy },
    { key: 'duels', label: 'Pojedynki', icon: Swords },
    { key: 'analytics', label: 'Wykresy', icon: BarChart3 },
    { key: 'history', label: 'Historia', icon: History, badge: logCount > 0 ? logCount : undefined },
    { key: 'pro', label: isProUnlocked ? 'PRO' : 'PRO (0 zł)', icon: Crown },
    { key: 'settings', label: 'Opcje', icon: Settings }
  ];

  const handleSelect = (key: TabKey) => {
    if (soundEnabled) {
      playHapticSound('tap');
    }
    onTabChange(key);
  };

  return (
    <div className="fixed bottom-3 inset-x-0 z-50 px-3 max-w-md mx-auto pointer-events-none">
      <nav
        id="ios26-tabview-bar"
        className="pointer-events-auto p-1.5 rounded-full bg-[#0d121e]/90 backdrop-blur-md border border-white/[0.12] shadow-[0_12px_36px_rgba(0,0,0,0.7)] flex items-center justify-between relative overflow-hidden"
      >
        {/* Subtle Crystal Edge Lighting */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent pointer-events-none" />

        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          const isProTab = tab.key === 'pro';

          return (
            <button
              key={tab.key}
              id={`tab-${tab.key}-btn`}
              onClick={() => handleSelect(tab.key)}
              className={`relative flex-1 py-1.5 px-1 rounded-full flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
                isActive
                  ? isProTab
                    ? 'bg-amber-400/20 text-amber-300 shadow-inner'
                    : 'bg-white/[0.12] text-white shadow-inner font-bold'
                  : isProTab
                  ? 'text-amber-400/70 hover:text-amber-300'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2.5 px-1 min-w-[14px] h-[14px] text-[9px] font-black bg-blue-500 text-white rounded-full flex items-center justify-center border border-[#0d121e]">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[9px] mt-0.5 tracking-tight truncate max-w-[50px] leading-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
