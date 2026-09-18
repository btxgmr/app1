import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Trophy,
  Plus,
  Search,
  ChevronDown,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Crown,
  Volume2,
  VolumeX,
  RotateCcw,
  Flame,
  X,
  Code2,
  Copy,
  Check,
  Dices,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { Player, ActivityLog, LeaderboardSettings, SortMode } from './types';
import { RollingNumber } from './components/RollingNumber';
import { TabBarIOS26, TabKey } from './components/TabBarIOS26';
import { DuelsTab } from './components/DuelsTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { HistoryTab } from './components/HistoryTab';
import { ProStoreTab } from './components/ProStoreTab';
import { SettingsTab } from './components/SettingsTab';
import { EditPlayerModal } from './components/EditPlayerModal';
import { AddPlayerModal } from './components/AddPlayerModal';
import { ApplePayModal } from './components/ApplePayModal';
import { playHapticSound } from './utils/audio';

const DEFAULT_PLAYERS: Player[] = [
  { id: '1', name: 'Alex Rivera', score: 1250, avatarEmoji: '🔥', avatarColorHex: '#FF9F0A', category: 'Siłownia', wins: 8, losses: 2, streak: 4 },
  { id: '2', name: 'Sarah Chen', score: 980, avatarEmoji: '⚡️', avatarColorHex: '#FFD60A', category: 'Cardio', wins: 6, losses: 3, streak: 2 },
  { id: '3', name: 'Marcus Vance', score: 840, avatarEmoji: '🚴‍♂️', avatarColorHex: '#30D158', category: 'Cardio', wins: 5, losses: 4, streak: 1 },
  { id: '4', name: 'Elena Rostova', score: 620, avatarEmoji: '🥊', avatarColorHex: '#0A84FF', category: 'Siłownia', wins: 4, losses: 5, streak: 0 },
  { id: '5', name: 'David Kim', score: 450, avatarEmoji: '🏃‍♂️', avatarColorHex: '#BF5AF2', category: 'Gaming', wins: 2, losses: 6, streak: 0 }
];

const PRESET_UNITS = ['PKT', 'KCAL', 'PTS', 'KM', 'KG', 'REP', '$', 'XP'];
const CATEGORIES = ['Wszystkie', 'Siłownia', 'Cardio', 'Gaming', 'Praca'];

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('leaderboard');
  const [players, setPlayers] = useState<Player[]>(() => {
    try {
      const saved = localStorage.getItem('liquid_leaderboard_players_v2');
      return saved ? JSON.parse(saved) : DEFAULT_PLAYERS;
    } catch {
      return DEFAULT_PLAYERS;
    }
  });

  const [settings, setSettings] = useState<LeaderboardSettings>(() => {
    try {
      const saved = localStorage.getItem('liquid_leaderboard_settings_v2');
      return saved ? JSON.parse(saved) : {
        unit: 'PKT',
        quickDeltas: [10, 50, 100, -10],
        soundEnabled: true,
        activeCategory: 'Wszystkie',
        sortMode: 'score_desc' as SortMode,
        tabStyle: 'ios26'
      };
    } catch {
      return {
        unit: 'PKT',
        quickDeltas: [10, 50, 100, -10],
        soundEnabled: true,
        activeCategory: 'Wszystkie',
        sortMode: 'score_desc' as SortMode,
        tabStyle: 'ios26'
      };
    }
  });

  const [isProUnlocked, setIsProUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('liquid_leaderboard_pro') === 'true';
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem('liquid_leaderboard_logs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isApplePayOpen, setIsApplePayOpen] = useState(false);
  const [isUnitOpen, setIsUnitOpen] = useState(false);
  const [isDeltasOpen, setIsDeltasOpen] = useState(false);
  const [isSwiftCodeOpen, setIsSwiftCodeOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; showUndo?: boolean } | null>(null);

  useEffect(() => {
    localStorage.setItem('liquid_leaderboard_players_v2', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('liquid_leaderboard_settings_v2', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('liquid_leaderboard_pro', String(isProUnlocked));
  }, [isProUnlocked]);

  useEffect(() => {
    localStorage.setItem('liquid_leaderboard_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  const showToast = useCallback((text: string, showUndo = false) => {
    setToastMessage({ text, showUndo });
    setTimeout(() => {
      setToastMessage(prev => (prev?.text === text ? null : prev));
    }, 3200);
  }, []);

  const addLog = useCallback((
    type: ActivityLog['type'],
    title: string,
    description: string,
    playerIds: string[],
    previousScores?: Record<string, number>,
    newScores?: Record<string, number>
  ) => {
    const newLog: ActivityLog = {
      id: String(Date.now()),
      timestamp: Date.now(),
      type,
      title,
      description,
      playerIds,
      previousScores,
      newScores
    };
    setActivityLogs(prev => [newLog, ...prev].slice(0, 50));
  }, []);

  // Sorted and filtered players
  const sortedAndFilteredPlayers = useMemo(() => {
    let result = [...players];

    // Filter by Category
    if (settings.activeCategory && settings.activeCategory !== 'Wszystkie') {
      result = result.filter(p => p.category === settings.activeCategory);
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => p.name.toLowerCase().includes(q));
    }

    // Sorting
    result.sort((a, b) => {
      if (settings.sortMode === 'score_desc') {
        if (b.score !== a.score) return b.score - a.score;
        return a.name.localeCompare(b.name);
      }
      if (settings.sortMode === 'score_asc') {
        if (a.score !== b.score) return a.score - b.score;
        return a.name.localeCompare(b.name);
      }
      if (settings.sortMode === 'name_asc') {
        return a.name.localeCompare(b.name);
      }
      if (settings.sortMode === 'streak_desc') {
        return (b.streak || 0) - (a.streak || 0);
      }
      return b.score - a.score;
    });

    return result;
  }, [players, searchQuery, settings.activeCategory, settings.sortMode]);

  // Handle Score Delta
  const handleModifyScore = (id: string, delta: number) => {
    const target = players.find(p => p.id === id);
    if (!target) return;

    const prevScore = target.score;
    const newScore = target.score + delta;

    setPlayers(prev =>
      prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            score: newScore,
            lastDelta: delta,
            lastDeltaTime: Date.now()
          };
        }
        return p;
      })
    );

    if (settings.soundEnabled) {
      playHapticSound(delta > 0 ? 'score_up' : 'score_down');
    }

    addLog(
      'modify',
      `${delta > 0 ? '+' : ''}${delta} ${settings.unit}`,
      `${target.name} (${prevScore} → ${newScore} ${settings.unit})`,
      [id],
      { [id]: prevScore },
      { [id]: newScore }
    );

    showToast(`${target.name}: ${delta > 0 ? '+' : ''}${delta} ${settings.unit}`, true);
  };

  // Handle Duel Outcome
  const handleExecuteDuel = (winnerId: string, loserId: string, stake: number) => {
    const winner = players.find(p => p.id === winnerId);
    const loser = players.find(p => p.id === loserId);
    if (!winner || !loser) return;

    const prevScores = {
      [winnerId]: winner.score,
      [loserId]: loser.score
    };

    const newWinnerScore = winner.score + stake;
    const newLoserScore = Math.max(0, loser.score - stake);

    setPlayers(prev =>
      prev.map(p => {
        if (p.id === winnerId) {
          return {
            ...p,
            score: newWinnerScore,
            wins: (p.wins || 0) + 1,
            streak: (p.streak || 0) + 1,
            lastDelta: stake,
            lastDeltaTime: Date.now()
          };
        }
        if (p.id === loserId) {
          return {
            ...p,
            score: newLoserScore,
            losses: (p.losses || 0) + 1,
            streak: 0,
            lastDelta: -stake,
            lastDeltaTime: Date.now()
          };
        }
        return p;
      })
    );

    addLog(
      'duel',
      `Pojedynek: ${winner.name} pokonał ${loser.name}`,
      `Stawka ±${stake} ${settings.unit}`,
      [winnerId, loserId],
      prevScores,
      { [winnerId]: newWinnerScore, [loserId]: newLoserScore }
    );

    showToast(`👑 ${winner.name} wygrał pojedynek (+${stake} ${settings.unit})!`, true);
  };

  // Undo Last Action
  const handleUndoLatest = () => {
    if (activityLogs.length === 0) return;
    const latest = activityLogs[0];

    if (latest.previousScores) {
      setPlayers(prev =>
        prev.map(p => {
          if (latest.previousScores && latest.previousScores[p.id] !== undefined) {
            return {
              ...p,
              score: latest.previousScores[p.id]
            };
          }
          return p;
        })
      );
    }

    setActivityLogs(prev => prev.slice(1));
    showToast(`Cofnięto: ${latest.title}`);
  };

  // Lucky Draw / MVP of the day bonus
  const handleLuckyDraw = () => {
    if (players.length === 0) return;
    const randomIndex = Math.floor(Math.random() * players.length);
    const lucky = players[randomIndex];
    const bonus = 50;

    handleModifyScore(lucky.id, bonus);
    if (settings.soundEnabled) {
      playHapticSound('victory');
    }
    showToast(`🎲 MVP Dnia: ${lucky.name} otrzymał +${bonus} ${settings.unit}!`);
  };

  return (
    <div className="relative min-h-screen bg-[#07090e] text-white font-sans overflow-x-hidden selection:bg-amber-500/30">
      {/* Sleek Obsidian Background Lighting - Zero blurry lag or white artifacts */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage: `
              radial-gradient(circle at 15% 15%, rgba(14, 165, 233, 0.09) 0%, transparent 40%),
              radial-gradient(circle at 85% 35%, rgba(168, 85, 247, 0.08) 0%, transparent 45%),
              radial-gradient(circle at 50% 85%, rgba(245, 158, 11, 0.07) 0%, transparent 40%)
            `
          }}
        />
      </div>

      {/* Main App Container */}
      <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col px-3.5 pb-28 pt-3">
        {/* Top Header */}
        <header className="flex items-center justify-between py-2 mb-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-[1px] shadow-sm">
              <div className="w-full h-full bg-[#0d121e] rounded-xl flex items-center justify-center">
                <Trophy className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-lg font-black tracking-tight text-white">Leaderboard</h1>
                {isProUnlocked && (
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300">
                    PRO
                  </span>
                )}
              </div>
              <p className="text-[10px] text-neutral-400 font-medium">Apple iOS 26 TabView</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Lucky Draw Button */}
            <button
              id="lucky-draw-btn"
              onClick={handleLuckyDraw}
              title="Losuj MVP dnia (+50 pkt)"
              className="w-8 h-8 rounded-xl bg-[#0f1422] border border-white/[0.08] hover:border-amber-400/50 text-amber-400 flex items-center justify-center active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <Dices className="w-4 h-4" />
            </button>

            {/* Sound Mute Toggle */}
            <button
              id="sound-toggle-btn"
              onClick={() => {
                const next = !settings.soundEnabled;
                setSettings(prev => ({ ...prev, soundEnabled: next }));
                if (next) playHapticSound('tap');
              }}
              className="w-8 h-8 rounded-xl bg-[#0f1422] border border-white/[0.08] text-neutral-400 hover:text-white flex items-center justify-center active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Unit Selector Pill */}
            <button
              id="unit-selector-btn"
              onClick={() => setIsUnitOpen(true)}
              className="flex items-center space-x-1 text-xs font-bold px-2.5 py-1.5 rounded-xl bg-[#0f1422] border border-white/[0.08] hover:border-white/[0.15] transition-all shadow-sm cursor-pointer"
            >
              <span className="text-amber-400 font-mono">{settings.unit}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {/* Swift Code Viewer */}
            <button
              id="view-swift-code-btn"
              onClick={() => setIsSwiftCodeOpen(true)}
              className="w-8 h-8 rounded-xl bg-[#0f1422] border border-white/[0.08] text-neutral-400 hover:text-white flex items-center justify-center active:scale-95 transition-all shadow-sm cursor-pointer"
              title="Zobacz kod Swift iOS 26"
            >
              <Code2 className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Global Toast with Undo option */}
        {toastMessage && (
          <div className="mb-2.5 p-2.5 rounded-xl bg-[#141a29] border border-cyan-500/30 shadow-lg flex items-center justify-between text-xs animate-in slide-in-from-top duration-200">
            <span className="font-medium text-neutral-200 truncate mr-2">{toastMessage.text}</span>
            {toastMessage.showUndo && (
              <button
                onClick={handleUndoLatest}
                className="px-2 py-0.5 rounded-lg bg-amber-400/20 text-amber-300 font-bold hover:bg-amber-400/30 text-[11px] flex items-center space-x-1 shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Cofnij</span>
              </button>
            )}
          </div>
        )}

        {/* TAB VIEWS */}
        <div className="flex-1 flex flex-col">
          {/* TAB 1: LEADERBOARD */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              {/* Category Pills & Sort Bar */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSettings(prev => ({ ...prev, activeCategory: cat }))}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      settings.activeCategory === cat
                        ? 'bg-blue-600 text-white font-bold shadow-md'
                        : 'bg-[#0f1422] text-neutral-400 hover:text-white border border-white/[0.05]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search & Action Bar */}
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Szukaj zawodnika..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0f1422] border border-white/[0.08] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-400"
                  />
                </div>

                {/* Sort Mode Cycle */}
                <button
                  id="sort-toggle-btn"
                  onClick={() => {
                    const modes: SortMode[] = ['score_desc', 'score_asc', 'name_asc', 'streak_desc'];
                    const nextIndex = (modes.indexOf(settings.sortMode) + 1) % modes.length;
                    setSettings(prev => ({ ...prev, sortMode: modes[nextIndex] }));
                  }}
                  title="Zmień tryb sortowania"
                  className="px-2.5 py-2 rounded-xl bg-[#0f1422] border border-white/[0.08] hover:border-white/[0.15] text-xs font-bold text-neutral-300 flex items-center space-x-1 cursor-pointer"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-[10px]">
                    {settings.sortMode === 'score_desc' ? 'Pkt ↓' : settings.sortMode === 'score_asc' ? 'Pkt ↑' : settings.sortMode === 'name_asc' ? 'A-Z' : 'Seria'}
                  </span>
                </button>

                {/* Add Athlete Button */}
                <button
                  id="add-athlete-top-btn"
                  onClick={() => setIsAddOpen(true)}
                  className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-1 shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Dodaj</span>
                </button>
              </div>

              {/* Obsidian Glass Podium Top 3 (shown when not searching and at least 3 players) */}
              {!searchQuery && settings.activeCategory === 'Wszystkie' && sortedAndFilteredPlayers.length >= 3 && (
                <div className="p-3.5 rounded-2xl bg-[#0e131f]/95 border border-white/[0.08] shadow-[0_6px_24px_rgba(0,0,0,0.6)]">
                  <div className="text-[10px] font-bold text-neutral-400 mb-2 uppercase tracking-wider text-center">
                    Podium Ligi Apple
                  </div>
                  <div className="flex items-end justify-center gap-2 pt-1">
                    {/* 2nd Place */}
                    <div
                      onClick={() => setEditingPlayer(sortedAndFilteredPlayers[1])}
                      className="flex-1 flex flex-col items-center cursor-pointer group"
                    >
                      <span className="text-xl mb-0.5 group-hover:scale-110 transition-transform">
                        {sortedAndFilteredPlayers[1].avatarEmoji}
                      </span>
                      <span className="text-xs font-bold truncate max-w-[70px]">
                        {sortedAndFilteredPlayers[1].name.split(' ')[0]}
                      </span>
                      <span className="text-xs font-black text-neutral-300 font-mono">
                        <RollingNumber value={sortedAndFilteredPlayers[1].score} />
                      </span>
                      <div className="w-full h-14 mt-1.5 rounded-xl bg-gradient-to-t from-[#141a29] to-[#1f283d] border border-cyan-500/20 flex items-center justify-center font-black text-neutral-300 text-base shadow-sm">
                        2
                      </div>
                    </div>

                    {/* 1st Place */}
                    <div
                      onClick={() => setEditingPlayer(sortedAndFilteredPlayers[0])}
                      className="flex-1 flex flex-col items-center -mt-3 cursor-pointer group"
                    >
                      <Crown className="w-4 h-4 text-amber-400 animate-bounce mb-0.5" />
                      <span className="text-2xl mb-0.5 group-hover:scale-110 transition-transform">
                        {sortedAndFilteredPlayers[0].avatarEmoji}
                      </span>
                      <span className="text-xs font-bold text-amber-300 truncate max-w-[80px]">
                        {sortedAndFilteredPlayers[0].name.split(' ')[0]}
                      </span>
                      <span className="text-sm font-black text-amber-400 font-mono">
                        <RollingNumber value={sortedAndFilteredPlayers[0].score} />
                      </span>
                      <div className="w-full h-20 mt-1.5 rounded-xl bg-gradient-to-t from-[#1a160d] via-[#2a2010] to-[#3a2c14] border border-amber-400/40 flex items-center justify-center font-black text-amber-300 text-xl shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                        1
                      </div>
                    </div>

                    {/* 3rd Place */}
                    <div
                      onClick={() => setEditingPlayer(sortedAndFilteredPlayers[2])}
                      className="flex-1 flex flex-col items-center cursor-pointer group"
                    >
                      <span className="text-xl mb-0.5 group-hover:scale-110 transition-transform">
                        {sortedAndFilteredPlayers[2].avatarEmoji}
                      </span>
                      <span className="text-xs font-bold truncate max-w-[70px]">
                        {sortedAndFilteredPlayers[2].name.split(' ')[0]}
                      </span>
                      <span className="text-xs font-black text-amber-600 font-mono">
                        <RollingNumber value={sortedAndFilteredPlayers[2].score} />
                      </span>
                      <div className="w-full h-11 mt-1.5 rounded-xl bg-gradient-to-t from-[#161219] to-[#251b27] border border-amber-700/30 flex items-center justify-center font-black text-amber-500 text-sm shadow-sm">
                        3
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Athletes List */}
              <div className="space-y-2">
                {sortedAndFilteredPlayers.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-[#0e131f]/90 border border-white/[0.08] text-neutral-400 space-y-2">
                    <Trophy className="w-8 h-8 mx-auto text-amber-400/40" />
                    <p className="font-bold text-white text-sm">Brak wyników</p>
                    <p className="text-xs">Zmień kategorię lub dodaj nowego zawodnika.</p>
                  </div>
                ) : (
                  sortedAndFilteredPlayers.map((player) => {
                    const rank = players.filter(p => p.score > player.score).length + 1;
                    const isTop3 = rank <= 3;
                    const hasRecentDelta = player.lastDeltaTime && Date.now() - player.lastDeltaTime < 2500;

                    return (
                      <div
                        key={player.id}
                        className={`p-3.5 rounded-2xl transition-all duration-150 ${
                          isTop3
                            ? 'bg-[#0f1423]/95 border border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.5)]'
                            : 'bg-[#0e131f]/90 border border-white/[0.06] hover:bg-[#121827]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2.5">
                          <div
                            onClick={() => setEditingPlayer(player)}
                            className="flex items-center space-x-2.5 cursor-pointer group flex-1 min-w-0 mr-2"
                          >
                            {/* Rank Badge */}
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-[11px] shrink-0 ${
                                rank === 1
                                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                  : rank === 2
                                  ? 'bg-neutral-300/15 text-neutral-200 border border-neutral-300/30'
                                  : rank === 3
                                  ? 'bg-amber-700/20 text-amber-500 border border-amber-600/30'
                                  : 'bg-white/[0.04] text-neutral-400 border border-white/[0.05]'
                              }`}
                            >
                              {getOrdinal(rank)}
                            </div>

                            {/* Avatar */}
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-inner shrink-0 group-hover:scale-105 transition-transform"
                              style={{
                                backgroundColor: `${player.avatarColorHex}25`,
                                border: `1.5px solid ${player.avatarColorHex}70`
                              }}
                            >
                              {player.avatarEmoji}
                            </div>

                            {/* Name, Category, Streak & Delta */}
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-xs text-white truncate flex items-center space-x-1.5">
                                <span className="group-hover:text-blue-400 transition-colors truncate">{player.name}</span>
                                {player.streak >= 2 && (
                                  <span className="text-[10px] text-amber-400 font-extrabold flex items-center shrink-0">
                                    <Flame className="w-3 h-3" />
                                    <span>{player.streak}W</span>
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 text-[10px] text-neutral-400">
                                <span>{player.category || 'Ogólna'}</span>
                                {hasRecentDelta && player.lastDelta !== undefined && (
                                  <span
                                    className={`inline-flex items-center font-bold font-mono px-1 py-0.2 rounded ${
                                      player.lastDelta > 0
                                        ? 'text-green-400 bg-green-500/10'
                                        : 'text-rose-400 bg-rose-500/10'
                                    }`}
                                  >
                                    {player.lastDelta > 0 ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
                                    <span>{player.lastDelta > 0 ? `+${player.lastDelta}` : player.lastDelta}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Score */}
                          <div className="text-right shrink-0">
                            <div className="text-lg font-black text-white flex items-center justify-end space-x-1">
                              <RollingNumber value={player.score} className="text-xl" />
                              <span className="text-[10px] font-bold text-neutral-400">{settings.unit}</span>
                            </div>
                          </div>
                        </div>

                        {/* Quick Modification Obsidian Buttons */}
                        <div className="flex items-center space-x-1.5 pt-1 border-t border-white/[0.04]">
                          {settings.quickDeltas.map(delta => (
                            <button
                              key={delta}
                              onClick={() => handleModifyScore(player.id, delta)}
                              className={`flex-1 py-1 rounded-lg font-mono text-xs font-bold transition-all active:scale-95 flex items-center justify-center cursor-pointer ${
                                delta > 0
                                  ? 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20'
                                  : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20'
                              }`}
                            >
                              {delta > 0 ? `+${delta}` : delta}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DUELS */}
          {activeTab === 'duels' && (
            <DuelsTab
              players={players}
              unit={settings.unit}
              soundEnabled={settings.soundEnabled}
              onExecuteDuel={handleExecuteDuel}
            />
          )}

          {/* TAB 3: ANALYTICS */}
          {activeTab === 'analytics' && (
            <AnalyticsTab players={players} unit={settings.unit} />
          )}

          {/* TAB 4: HISTORY */}
          {activeTab === 'history' && (
            <HistoryTab
              logs={activityLogs}
              unit={settings.unit}
              soundEnabled={settings.soundEnabled}
              onUndoLatest={handleUndoLatest}
              onClearLogs={() => setActivityLogs([])}
            />
          )}

          {/* TAB 5: PRO STORE */}
          {activeTab === 'pro' && (
            <ProStoreTab
              isProUnlocked={isProUnlocked}
              onTriggerApplePay={() => setIsApplePayOpen(true)}
            />
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <SettingsTab
              settings={settings}
              players={players}
              onUpdateSettings={newS => setSettings(prev => ({ ...prev, ...newS }))}
              onResetDefaults={() => {
                setPlayers(DEFAULT_PLAYERS);
                setSettings(prev => ({ ...prev, unit: 'PKT', quickDeltas: [10, 50, 100, -10] }));
                showToast('Przywrócono domyślnych sportowców');
              }}
              onImportPlayers={imported => {
                setPlayers(imported);
                showToast(`Zaimportowano ${imported.length} zawodników`);
              }}
              onOpenUnitModal={() => setIsUnitOpen(true)}
              onOpenDeltasModal={() => setIsDeltasOpen(true)}
            />
          )}
        </div>

        {/* MODERN iOS 26 FLOATING LIQUID GLASS TAB BAR */}
        <TabBarIOS26
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isProUnlocked={isProUnlocked}
          soundEnabled={settings.soundEnabled}
          logCount={activityLogs.length}
        />
      </div>

      {/* MODAL: ADD ATHLETE */}
      {isAddOpen && (
        <AddPlayerModal
          unit={settings.unit}
          onClose={() => setIsAddOpen(false)}
          onAdd={newP => {
            const added: Player = { ...newP, id: String(Date.now()) };
            setPlayers(prev => [...prev, added]);
            addLog('add', `Dodano zawodnika: ${added.name}`, `Wynik początkowy: ${added.score} ${settings.unit}`, [added.id]);
            showToast(`Dodano ${added.name}`);
          }}
        />
      )}

      {/* MODAL: EDIT ATHLETE */}
      {editingPlayer && (
        <EditPlayerModal
          player={editingPlayer}
          unit={settings.unit}
          onClose={() => setEditingPlayer(null)}
          onSave={updated => {
            setPlayers(prev => prev.map(p => (p.id === updated.id ? updated : p)));
            addLog('edit', `Zaktualizowano: ${updated.name}`, `Wynik: ${updated.score} ${settings.unit}`, [updated.id]);
            showToast(`Zapisano dane ${updated.name}`);
          }}
          onDelete={id => {
            const p = players.find(x => x.id === id);
            setPlayers(prev => prev.filter(x => x.id !== id));
            showToast(`Usunięto ${p?.name || 'zawodnika'}`);
          }}
        />
      )}

      {/* MODAL: APPLE PAY 0 ZŁ */}
      {isApplePayOpen && (
        <ApplePayModal
          onClose={() => setIsApplePayOpen(false)}
          soundEnabled={settings.soundEnabled}
          onSuccess={() => {
            setIsProUnlocked(true);
            setIsApplePayOpen(false);
            showToast('👑 Licencja PRO została aktywowana na stałe!');
          }}
        />
      )}

      {/* MODAL: UNIT SELECTOR */}
      {isUnitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xs p-5 rounded-3xl bg-[#0e131f] border border-white/[0.12] shadow-2xl space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-white/[0.08]">
              <h3 className="text-sm font-black text-white">Wybierz jednostkę</h3>
              <button onClick={() => setIsUnitOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_UNITS.map(u => (
                <button
                  key={u}
                  onClick={() => {
                    setSettings(prev => ({ ...prev, unit: u }));
                    setIsUnitOpen(false);
                    if (settings.soundEnabled) playHapticSound('tap');
                  }}
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                    settings.unit === u
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#151b2c] text-neutral-300 hover:bg-[#1b233a]'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: QUICK DELTAS SELECTOR */}
      {isDeltasOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xs p-5 rounded-3xl bg-[#0e131f] border border-white/[0.12] shadow-2xl space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-white/[0.08]">
              <h3 className="text-sm font-black text-white">Szybkie przyciski +/-</h3>
              <button onClick={() => setIsDeltasOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {[
                [10, 50, 100, -10],
                [1, 5, 10, -1],
                [25, 50, 250, -25],
                [100, 500, 1000, -100]
              ].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSettings(prev => ({ ...prev, quickDeltas: preset }));
                    setIsDeltasOpen(false);
                    if (settings.soundEnabled) playHapticSound('tap');
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#151b2c] hover:bg-[#1b233a] font-mono text-xs flex justify-between items-center transition-all"
                >
                  <span className="text-neutral-300 font-sans font-bold">Zestaw #{idx + 1}</span>
                  <span className="text-amber-400 font-bold">{preset.map(d => (d > 0 ? `+${d}` : d)).join(', ')}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SWIFT CODE VIEWER */}
      {isSwiftCodeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md p-5 rounded-3xl bg-[#0e131f] border border-white/[0.12] shadow-2xl space-y-3 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center pb-2 border-b border-white/[0.08]">
              <div>
                <h3 className="text-sm font-black text-white">Natywny Kod Swift (iOS 26 TabView)</h3>
                <p className="text-[10px] text-neutral-400">SwiftUI • Modern TabView • .numericText()</p>
              </div>
              <button onClick={() => setIsSwiftCodeOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto font-mono text-[11px] text-neutral-300 bg-[#080b11] p-3 rounded-2xl border border-white/[0.06] space-y-2">
              <div className="text-cyan-400 font-bold">// Sources/Leaderboard/Views/MainTabView.swift (iOS 26 TabView)</div>
              <pre className="text-neutral-400 whitespace-pre-wrap">{`TabView(selection: $selectedTab) {
    Tab("Tabela", systemImage: "trophy.fill", value: .leaderboard) {
        LeaderboardView(viewModel: viewModel)
    }
    Tab("Pojedynki", systemImage: "swords", value: .duels) {
        DuelsView(viewModel: viewModel)
    }
    Tab("Wykresy", systemImage: "chart.bar.xaxis", value: .analytics) {
        AnalyticsView(viewModel: viewModel)
    }
    Tab("Historia", systemImage: "clock.arrow.circlepath", value: .history) {
        HistoryView(viewModel: viewModel)
    }
    Tab("PRO (0 zł)", systemImage: "crown.fill", value: .store) {
        PremiumStoreView(viewModel: viewModel)
    }
    Tab("Opcje", systemImage: "gearshape.fill", value: .settings) {
        SettingsView(viewModel: viewModel)
    }
}
.tabViewStyle(.sidebarAdaptable)`}</pre>

              <div className="text-amber-400 font-bold pt-2">// Content Transition (Apple Numeric Text)</div>
              <pre className="text-neutral-400 whitespace-pre-wrap">{`Text(formattedScore)
    .contentTransition(.numericText(value: Double(score)))
    .monospacedDigit()
    .animation(.spring(response: 0.42, dampingFraction: 0.82), value: score)`}</pre>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(`// iOS 18/26 Modern TabView in SwiftUI
import SwiftUI
import Charts

@main
struct LeaderboardApp: App {
    var body: some Scene {
        WindowGroup {
            MainTabView()
                .preferredColorScheme(.dark)
        }
    }
}`);
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2000);
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-green-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Skopiowano kod do schowka!' : 'Kopiuj kod Swift'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
