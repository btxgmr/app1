import React from 'react';
import { History, RotateCcw, Trash2, ArrowUpRight, ArrowDownRight, Swords, RefreshCw } from 'lucide-react';
import { ActivityLog } from '../types';
import { playHapticSound } from '../utils/audio';

interface HistoryTabProps {
  logs: ActivityLog[];
  unit: string;
  soundEnabled: boolean;
  onUndoLatest: () => void;
  onClearLogs: () => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  logs,
  unit,
  soundEnabled,
  onUndoLatest,
  onClearLogs
}) => {
  const handleUndo = () => {
    if (soundEnabled) {
      playHapticSound('undo');
    }
    onUndoLatest();
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black flex items-center space-x-2">
            <History className="w-5 h-5 text-blue-400" />
            <span>Dziennik Zdarzeń i Historia</span>
          </h2>
          <p className="text-xs text-neutral-400">Śledzenie wszystkich zmian punktów i pojedynków</p>
        </div>

        {logs.length > 0 && (
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleUndo}
              className="py-1 px-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-xs font-bold flex items-center space-x-1 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Cofnij</span>
            </button>
            <button
              onClick={onClearLogs}
              className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 border border-white/[0.08] transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[#0e131f]/80 border border-white/[0.08] text-center text-neutral-400 space-y-1">
          <p className="font-bold text-white text-sm">Brak zdarzeń w historii</p>
          <p className="text-xs">Wszelkie zmiany punktów i wyniki pojedynków pojawią się w tym miejscu.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => {
            const timeStr = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            return (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-[#0e131f]/90 border border-white/[0.06] shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      log.type === 'duel'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : log.type === 'modify' && log.description.includes('+')
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : log.type === 'modify'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {log.type === 'duel' ? (
                      <Swords className="w-4 h-4" />
                    ) : log.type === 'modify' && log.description.includes('+') ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : log.type === 'modify' ? (
                      <ArrowDownRight className="w-4 h-4" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{log.title}</p>
                    <p className="text-[11px] text-neutral-400">{log.description}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-neutral-500 block">{timeStr}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
