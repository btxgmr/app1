import React, { useState } from 'react';
import { Settings, Volume2, VolumeX, RotateCcw, Share2, Download, Upload, Check, ChevronDown, Sparkles } from 'lucide-react';
import { LeaderboardSettings, Player } from '../types';
import { playHapticSound } from '../utils/audio';

interface SettingsTabProps {
  settings: LeaderboardSettings;
  players: Player[];
  onUpdateSettings: (newSettings: Partial<LeaderboardSettings>) => void;
  onResetDefaults: () => void;
  onImportPlayers: (imported: Player[]) => void;
  onOpenUnitModal: () => void;
  onOpenDeltasModal: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  settings,
  players,
  onUpdateSettings,
  onResetDefaults,
  onImportPlayers,
  onOpenUnitModal,
  onOpenDeltasModal
}) => {
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedCsv, setCopiedCsv] = useState(false);

  const handleShareToClipboard = () => {
    const sorted = [...players].sort((a, b) => b.score - a.score);
    const text = [
      `🏆 AKTUALNA TABLICA LIDERÓW (${settings.unit})`,
      '--------------------------------',
      ...sorted.map((p, idx) => {
        const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
        return `${medal} ${p.name} - ${p.score} ${settings.unit} ${p.avatarEmoji}`;
      }),
      '--------------------------------',
      `Wygenerowano przez Leaderboard iOS 26`
    ].join('\n');

    navigator.clipboard.writeText(text);
    if (settings.soundEnabled) {
      playHapticSound('tap');
    }
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleExportCsv = () => {
    const sorted = [...players].sort((a, b) => b.score - a.score);
    const csvContent = [
      'Miejsce,Imię,Punkty,Jednostka,Kategoria,Emoji,Seria,Wygrane,Przegrane',
      ...sorted.map((p, idx) => `${idx + 1},"${p.name}",${p.score},${settings.unit},"${p.category || 'Ogólna'}","${p.avatarEmoji}",${p.streak || 0},${p.wins || 0},${p.losses || 0}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leaderboard_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (settings.soundEnabled) {
      playHapticSound('tap');
    }
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 2000);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-black">Ustawienia i Narzędzia</h2>
        <p className="text-xs text-neutral-400">Konfiguracja reguł, dźwięku i eksportu</p>
      </div>

      {/* Main Settings Group */}
      <div className="p-4 rounded-2xl bg-[#0e131f]/95 border border-white/[0.08] shadow-lg space-y-3">
        {/* Unit Selector */}
        <div
          onClick={onOpenUnitModal}
          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.04] cursor-pointer transition-all"
        >
          <span className="text-sm font-semibold">Jednostka punktacji</span>
          <span className="text-xs font-bold text-amber-400 flex items-center space-x-1">
            <span>{settings.unit}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="h-[1px] bg-white/[0.05]" />

        {/* Quick Deltas */}
        <div
          onClick={onOpenDeltasModal}
          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.04] cursor-pointer transition-all"
        >
          <span className="text-sm font-semibold">Szybkie przyciski +/-</span>
          <span className="text-xs font-bold text-neutral-300 font-mono flex items-center space-x-1">
            <span>{settings.quickDeltas.map(d => (d > 0 ? `+${d}` : d)).join(', ')}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="h-[1px] bg-white/[0.05]" />

        {/* Sound Effects Toggle */}
        <div className="flex items-center justify-between p-2.5 rounded-xl">
          <div>
            <span className="text-sm font-semibold block">Dźwięki Haptic (Web Audio)</span>
            <span className="text-[10px] text-neutral-400">Natywne kliknięcia i fanfary zwycięstwa</span>
          </div>
          <button
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`p-2 rounded-xl transition-all ${
              settings.soundEnabled
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-white/[0.05] text-neutral-500 border border-white/[0.05]'
            }`}
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Sharing & Export */}
      <div className="p-4 rounded-2xl bg-[#0e131f]/95 border border-white/[0.08] shadow-lg space-y-2">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
          Eksport i Dzielenie Się
        </h3>

        <button
          onClick={handleShareToClipboard}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold transition-all text-neutral-200"
        >
          <span className="flex items-center space-x-2">
            <Share2 className="w-4 h-4 text-blue-400" />
            <span>Kopiuj sformatowaną tabelę do schowka</span>
          </span>
          {copiedShare ? (
            <span className="text-green-400 flex items-center space-x-1">
              <Check className="w-3.5 h-3.5" />
              <span>Skopiowano!</span>
            </span>
          ) : (
            <span className="text-neutral-500">Tekst / Discord</span>
          )}
        </button>

        <button
          onClick={handleExportCsv}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold transition-all text-neutral-200"
        >
          <span className="flex items-center space-x-2">
            <Download className="w-4 h-4 text-purple-400" />
            <span>Eksportuj ligę do pliku CSV</span>
          </span>
          {copiedCsv ? (
            <span className="text-green-400 flex items-center space-x-1">
              <Check className="w-3.5 h-3.5" />
              <span>Pobrano!</span>
            </span>
          ) : (
            <span className="text-neutral-500">Arkusz Excel</span>
          )}
        </button>
      </div>

      {/* Reset Section */}
      <div className="p-4 rounded-2xl bg-[#0e131f]/95 border border-white/[0.08] shadow-lg">
        <button
          id="reset-defaults-btn"
          onClick={onResetDefaults}
          className="w-full flex items-center justify-between p-2.5 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all text-xs font-bold"
        >
          <span className="flex items-center space-x-2">
            <RotateCcw className="w-4 h-4" />
            <span>Przywróć domyślnych zawodników Apple</span>
          </span>
        </button>
      </div>

      {/* Bundle Info - Untouched */}
      <div className="p-3.5 rounded-2xl bg-[#0b0e17] border border-white/[0.05] text-center space-y-1">
        <p className="text-[11px] font-bold text-neutral-500">Bundle Identifier (NIETKNIĘTY):</p>
        <code className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
          com.leaderboard.app
        </code>
      </div>
    </div>
  );
};
