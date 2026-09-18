import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Plus,
  SlidersHorizontal,
  Search,
  Trash2,
  Check,
  Copy,
  Code2,
  Smartphone,
  ChevronDown,
  RotateCcw,
  Sparkles,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Crown,
  Settings,
  Flame,
  ShieldCheck,
  X,
  CreditCard,
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
  Layers
} from 'lucide-react';

interface Player {
  id: string;
  name: string;
  score: number;
  avatarEmoji: string;
  avatarColorHex: string;
  lastDelta?: number;
  lastDeltaTime?: number;
}

interface LeaderboardSettings {
  unit: string;
  quickDeltas: number[];
}

const DEFAULT_PLAYERS: Player[] = [
  { id: '1', name: 'Alex Rivera', score: 1250, avatarEmoji: '🔥', avatarColorHex: '#FF9F0A' },
  { id: '2', name: 'Sarah Chen', score: 980, avatarEmoji: '⚡️', avatarColorHex: '#FFD60A' },
  { id: '3', name: 'Marcus Vance', score: 840, avatarEmoji: '🚴‍♂️', avatarColorHex: '#30D158' },
  { id: '4', name: 'Elena Rostova', score: 620, avatarEmoji: '🥊', avatarColorHex: '#0A84FF' },
  { id: '5', name: 'David Kim', score: 450, avatarEmoji: '🏃‍♂️', avatarColorHex: '#BF5AF2' }
];

const PRESET_UNITS = ['PKT', 'KCAL', 'PTS', 'KM', 'KG', 'REP', '$', 'XP'];

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Rolling Number Animated Component (iOS .numericText() visual equivalent)
const RollingNumber: React.FC<{ value: number; className?: string }> = ({ value, className = '' }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current === value) return;
    const start = prevValue.current;
    const end = value;
    const duration = 400;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Apple ease-out timing
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * easeOut);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
        prevValue.current = end;
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span className={`tabular-nums font-mono transition-all duration-200 ${className}`}>
      {displayValue.toLocaleString('pl-PL')}
    </span>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'analytics' | 'pro' | 'settings' | 'code'>('leaderboard');
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem('liquid_leaderboard_players');
    return saved ? JSON.parse(saved) : DEFAULT_PLAYERS;
  });
  const [settings, setSettings] = useState<LeaderboardSettings>(() => {
    const saved = localStorage.getItem('liquid_leaderboard_settings');
    return saved ? JSON.parse(saved) : { unit: 'PKT', quickDeltas: [10, 50, 100, -10] };
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isProUnlocked, setIsProUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('liquid_leaderboard_pro') === 'true';
  });

  // Modal states
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
  const [isApplePayModalOpen, setIsApplePayModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isUnitSelectorOpen, setIsUnitSelectorOpen] = useState(false);
  const [isQuickDeltasOpen, setIsQuickDeltasOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // New Player Form State
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerScore, setNewPlayerScore] = useState('100');
  const [newPlayerEmoji, setNewPlayerEmoji] = useState('🔥');
  const [newPlayerColor, setNewPlayerColor] = useState('#FF9F0A');

  const emojis = ['🔥', '⚡️', '🏃‍♂️', '🚴‍♀️', '🥊', '🧘', '🏆', '💎', '🦁', '🚀', '⭐️', '🎯'];
  const colors = ['#FF453A', '#FF9F0A', '#FFD60A', '#30D158', '#0A84FF', '#5E5CE6', '#BF5AF2'];

  useEffect(() => {
    localStorage.setItem('liquid_leaderboard_players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('liquid_leaderboard_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('liquid_leaderboard_pro', String(isProUnlocked));
  }, [isProUnlocked]);

  // Sorted and filtered players
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });

  const filteredPlayers = sortedPlayers.filter(p =>
    p.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const totalScore = players.reduce((acc, p) => acc + p.score, 0);
  const averageScore = players.length > 0 ? Math.round(totalScore / players.length) : 0;
  const topScore = sortedPlayers.length > 0 ? sortedPlayers[0].score : 0;

  const handleModifyScore = (id: string, delta: number) => {
    setPlayers(prev =>
      prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            score: p.score + delta,
            lastDelta: delta,
            lastDeltaTime: Date.now()
          };
        }
        return p;
      })
    );
  };

  const handleDeletePlayer = (id: string) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;
    const newP: Player = {
      id: String(Date.now()),
      name: newPlayerName.trim(),
      score: parseInt(newPlayerScore) || 0,
      avatarEmoji: newPlayerEmoji,
      avatarColorHex: newPlayerColor
    };
    setPlayers(prev => [...prev, newP]);
    setNewPlayerName('');
    setIsAddPlayerOpen(false);
  };

  const handleTriggerApplePay = () => {
    setIsApplePayModalOpen(true);
    setPaymentSuccess(false);
    setIsProcessingPayment(false);
  };

  const handleProcessApplePay = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      setIsProUnlocked(true);
      setTimeout(() => {
        setIsApplePayModalOpen(false);
        setPaymentSuccess(false);
      }, 1200);
    }, 1400);
  };

  return (
    <div className="relative min-h-screen bg-[#07090E] text-white font-sans overflow-x-hidden selection:bg-amber-500/30">
      {/* Background Liquid Glass Mesh Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 -right-32 w-[28rem] h-[28rem] bg-purple-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-amber-500/15 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col px-4 pb-28 pt-4">
        {/* Top Floating App Bar */}
        <header className="flex items-center justify-between py-3 mb-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-[1px] shadow-[0_0_20px_rgba(251,191,36,0.3)]">
              <div className="w-full h-full bg-black/70 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-white to-neutral-400 bg-clip-text text-transparent">
                  Leaderboard
                </h1>
                {isProUnlocked && (
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300">
                    PRO
                  </span>
                )}
              </div>
              <p className="text-[11px] font-medium text-neutral-400">Apple Liquid Glass HIG</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Unit Selector Badge */}
            <button
              id="unit-selector-btn"
              onClick={() => setIsUnitSelectorOpen(true)}
              className="flex items-center space-x-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/[0.18] hover:bg-white/[0.14] transition-all shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
            >
              <span>{settings.unit}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {/* Quick Add Button */}
            <button
              id="add-athlete-top-btn"
              onClick={() => setIsAddPlayerOpen(true)}
              className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-400 flex items-center justify-center hover:bg-blue-500/30 transition-all shadow-[0_0_15px_rgba(59,130,246,0.25)]"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* TAB CONTENT */}
        <div className="flex-1 flex flex-col">
          {/* TAB 1: LEADERBOARD */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Szukaj zawodnika..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.06] backdrop-blur-2xl border border-white/[0.14] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-400/60 focus:bg-white/[0.09] transition-all"
                />
              </div>

              {/* Liquid Glass Podium Top 3 (shown when not searching and at least 3 players) */}
              {!searchQuery && filteredPlayers.length >= 3 && (
                <div className="p-4 rounded-3xl bg-white/[0.05] backdrop-blur-2xl border border-white/[0.18] shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
                  <div className="text-[11px] font-bold text-neutral-400 mb-3 uppercase tracking-wider text-center">
                    Podium Liderów
                  </div>
                  <div className="flex items-end justify-center gap-2 pt-2">
                    {/* 2nd Place */}
                    <div className="flex-1 flex flex-col items-center">
                      <span className="text-2xl mb-1">{filteredPlayers[1].avatarEmoji}</span>
                      <span className="text-xs font-bold truncate max-w-[70px]">{filteredPlayers[1].name}</span>
                      <span className="text-xs font-black text-neutral-300">
                        <RollingNumber value={filteredPlayers[1].score} />
                      </span>
                      <div className="w-full h-16 mt-2 rounded-2xl bg-gradient-to-t from-neutral-400/20 to-neutral-400/40 border border-neutral-300/40 flex items-center justify-center font-black text-neutral-300 text-lg shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        2
                      </div>
                    </div>

                    {/* 1st Place */}
                    <div className="flex-1 flex flex-col items-center -mt-4">
                      <Crown className="w-4 h-4 text-amber-400 animate-bounce mb-0.5" />
                      <span className="text-3xl mb-1">{filteredPlayers[0].avatarEmoji}</span>
                      <span className="text-xs font-bold text-amber-300 truncate max-w-[80px]">{filteredPlayers[0].name}</span>
                      <span className="text-sm font-black text-amber-400">
                        <RollingNumber value={filteredPlayers[0].score} />
                      </span>
                      <div className="w-full h-24 mt-2 rounded-2xl bg-gradient-to-t from-amber-500/20 via-amber-400/30 to-yellow-300/50 border border-amber-400/60 flex items-center justify-center font-black text-amber-300 text-2xl shadow-[0_0_25px_rgba(251,191,36,0.3)]">
                        1
                      </div>
                    </div>

                    {/* 3rd Place */}
                    <div className="flex-1 flex flex-col items-center">
                      <span className="text-2xl mb-1">{filteredPlayers[2].avatarEmoji}</span>
                      <span className="text-xs font-bold truncate max-w-[70px]">{filteredPlayers[2].name}</span>
                      <span className="text-xs font-black text-amber-600">
                        <RollingNumber value={filteredPlayers[2].score} />
                      </span>
                      <div className="w-full h-12 mt-2 rounded-2xl bg-gradient-to-t from-amber-700/20 to-amber-600/40 border border-amber-600/40 flex items-center justify-center font-black text-amber-500 text-base shadow-[0_0_15px_rgba(217,119,6,0.15)]">
                        3
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Athletes List with Smooth Card Sliding Layout Animation */}
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {filteredPlayers.length === 0 ? (
                    <div className="p-8 text-center rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.1] text-neutral-400 space-y-2">
                      <Trophy className="w-10 h-10 mx-auto text-amber-400/50" />
                      <p className="font-bold text-white">Brak zawodników</p>
                      <p className="text-xs">Dodaj zawodników lub zresetuj listę w ustawieniach.</p>
                    </div>
                  ) : (
                    filteredPlayers.map((player) => {
                      const rank = sortedPlayers.findIndex(p => p.id === player.id) + 1;
                      const isTop3 = rank <= 3;
                      const hasRecentDelta = player.lastDeltaTime && Date.now() - player.lastDeltaTime < 2500;

                      return (
                        <motion.div
                          key={player.id}
                          layout
                          layoutId={player.id}
                          transition={{
                            type: 'spring',
                            stiffness: 380,
                            damping: 30,
                            mass: 0.9
                          }}
                          className={`p-4 rounded-3xl backdrop-blur-2xl transition-all duration-300 relative overflow-hidden ${
                            isTop3
                              ? 'bg-white/[0.08] border border-white/[0.22] shadow-[0_8px_30px_rgba(0,0,0,0.35)]'
                              : 'bg-white/[0.04] border border-white/[0.12] hover:bg-white/[0.06]'
                          }`}
                        >
                          {/* Liquid Glass Specular Top Highlight */}
                          <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              {/* Rank Badge */}
                              <div
                                className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs ${
                                  rank === 1
                                    ? 'bg-amber-400/20 border border-amber-400/50 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                                    : rank === 2
                                    ? 'bg-neutral-300/20 border border-neutral-300/50 text-neutral-200'
                                    : rank === 3
                                    ? 'bg-amber-700/20 border border-amber-600/50 text-amber-500'
                                    : 'bg-white/[0.06] border border-white/[0.1] text-neutral-400'
                                }`}
                              >
                                {getOrdinal(rank)}
                              </div>

                              {/* Avatar */}
                              <div
                                className="w-11 h-11 rounded-full flex items-center justify-center text-xl shadow-inner relative"
                                style={{ backgroundColor: `${player.avatarColorHex}25`, border: `1.5px solid ${player.avatarColorHex}70` }}
                              >
                                {player.avatarEmoji}
                              </div>

                              {/* Name & Delta */}
                              <div>
                                <div className="font-bold text-sm text-white flex items-center space-x-2">
                                  <span>{player.name}</span>
                                </div>
                                {hasRecentDelta && player.lastDelta !== undefined && (
                                  <div
                                    className={`inline-flex items-center space-x-0.5 text-[11px] font-black px-1.5 py-0.2 rounded-md ${
                                      player.lastDelta > 0
                                        ? 'text-green-400 bg-green-500/10'
                                        : 'text-rose-400 bg-rose-500/10'
                                    }`}
                                  >
                                    {player.lastDelta > 0 ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
                                    <span>{player.lastDelta > 0 ? `+${player.lastDelta}` : player.lastDelta}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Score with Rolling Digit Animation */}
                            <div className="text-right">
                              <div className="text-xl font-black tracking-tight text-white flex items-center justify-end space-x-1">
                                <RollingNumber value={player.score} className="text-2xl" />
                                <span className="text-xs font-bold text-neutral-400">{settings.unit}</span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Modification Liquid Pill Buttons */}
                          <div className="flex items-center space-x-2 pt-1 border-t border-white/[0.06]">
                            {settings.quickDeltas.map(delta => (
                              <button
                                key={delta}
                                onClick={() => handleModifyScore(player.id, delta)}
                                className={`flex-1 py-1.5 rounded-xl font-black text-xs backdrop-blur-md transition-all active:scale-95 flex items-center justify-center ${
                                  delta > 0
                                    ? 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/25'
                                    : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25'
                                }`}
                              >
                                {delta > 0 ? `+${delta}` : delta}
                              </button>
                            ))}

                            <button
                              onClick={() => handleDeletePlayer(player.id)}
                              className="p-1.5 px-2.5 rounded-xl bg-white/[0.05] hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 border border-white/[0.08] transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* TAB 2: ANALYTICS & WYKRESY */}
          {activeTab === 'analytics' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black">Wykresy i Statystyki</h2>
                  <p className="text-xs text-neutral-400">Apple Charts & Liquid Glass Analytics</p>
                </div>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3.5 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.16] shadow-lg">
                  <div className="text-amber-400 text-xs font-bold flex items-center space-x-1 mb-1">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Lider</span>
                  </div>
                  <div className="text-lg font-black text-white">
                    <RollingNumber value={topScore} />
                  </div>
                  <div className="text-[10px] text-neutral-400">{settings.unit}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.16] shadow-lg">
                  <div className="text-blue-400 text-xs font-bold flex items-center space-x-1 mb-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Średnia</span>
                  </div>
                  <div className="text-lg font-black text-white">
                    <RollingNumber value={averageScore} />
                  </div>
                  <div className="text-[10px] text-neutral-400">{settings.unit}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.16] shadow-lg">
                  <div className="text-purple-400 text-xs font-bold flex items-center space-x-1 mb-1">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Razem</span>
                  </div>
                  <div className="text-lg font-black text-white">
                    <RollingNumber value={totalScore} />
                  </div>
                  <div className="text-[10px] text-neutral-400">{settings.unit}</div>
                </div>
              </div>

              {/* Comparative Bar Chart in Liquid Glass */}
              <div className="p-4 rounded-3xl bg-white/[0.06] backdrop-blur-2xl border border-white/[0.18] shadow-[0_8px_32px_rgba(0,0,0,0.37)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold flex items-center space-x-1.5">
                    <BarChart3 className="w-4 h-4 text-green-400" />
                    <span>Porównanie Wyników</span>
                  </span>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{settings.unit}</span>
                </div>

                <div className="space-y-2.5 pt-2">
                  {sortedPlayers.map((player) => {
                    const percentage = topScore > 0 ? Math.max(8, (player.score / topScore) * 100) : 0;
                    return (
                      <div key={player.id} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="flex items-center space-x-1.5 truncate">
                            <span>{player.avatarEmoji}</span>
                            <span className="text-neutral-200">{player.name}</span>
                          </span>
                          <span className="font-bold text-white">
                            <RollingNumber value={player.score} /> {settings.unit}
                          </span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-white/[0.08] overflow-hidden p-0.5 border border-white/[0.05]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="h-full rounded-full shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                            style={{
                              background: `linear-gradient(90deg, ${player.avatarColorHex}99, ${player.avatarColorHex})`
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Gap to Leader Chart */}
              <div className="p-4 rounded-3xl bg-white/[0.06] backdrop-blur-2xl border border-white/[0.18] shadow-[0_8px_32px_rgba(0,0,0,0.37)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold flex items-center space-x-1.5">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span>Dystans do Lidera (Strata)</span>
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  {sortedPlayers.map((player, idx) => {
                    const gap = topScore - player.score;
                    return (
                      <div key={player.id} className="flex items-center justify-between text-xs py-1 border-b border-white/[0.04]">
                        <span className="text-neutral-300">#{idx + 1} {player.name}</span>
                        <span className="font-bold font-mono text-purple-300">
                          {gap === 0 ? '👑 Lider' : `-${gap} ${settings.unit}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRO STORE (0 ZŁ APPLE PAY) */}
          {activeTab === 'pro' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Holographic Liquid Glass Card */}
              <div className="relative p-6 rounded-3xl bg-gradient-to-br from-amber-500/20 via-purple-600/20 to-blue-600/20 backdrop-blur-2xl border border-amber-400/40 shadow-[0_8px_32px_rgba(251,191,36,0.25)] overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-amber-300 uppercase">
                      DOŻYWOTNIA SUBSKRYPCJA
                    </span>
                    <h3 className="text-2xl font-black text-white">LEADERBOARD PRO</h3>
                  </div>
                  <Crown className="w-7 h-7 text-amber-400" />
                </div>

                <div className="space-y-1 mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm line-through text-neutral-400">49,99 zł</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/40 text-green-300">
                      100% RABATU
                    </span>
                  </div>
                  <div className="text-4xl font-black text-white flex items-baseline space-x-2">
                    <span>0,00 zł</span>
                    <span className="text-xs font-bold text-neutral-400">/ na zawsze</span>
                  </div>
                </div>

                {isProUnlocked ? (
                  <div className="flex items-center space-x-2 text-green-400 font-bold text-sm bg-green-500/20 border border-green-500/30 p-3 rounded-2xl">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Posiadasz aktywną licencję PRO!</span>
                  </div>
                ) : (
                  <button
                    id="buy-apple-pay-btn"
                    onClick={handleTriggerApplePay}
                    className="w-full py-3.5 px-4 rounded-2xl bg-white text-black font-extrabold flex items-center justify-center space-x-2 shadow-xl hover:bg-neutral-100 active:scale-95 transition-all"
                  >
                    <span>Kup z</span>
                    <span className="font-black text-base flex items-center">Pay</span>
                    <span className="text-xs font-medium ml-2 px-2 py-0.5 rounded-md bg-black/10">0,00 zł</span>
                  </button>
                )}
              </div>

              {/* Features List */}
              <div className="p-4 rounded-3xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.14] space-y-3">
                <h4 className="text-xs font-black text-neutral-300 uppercase tracking-wider">
                  W pakiecie PRO otrzymujesz:
                </h4>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center space-x-2 text-neutral-200">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Nielimitowana liczba zawodników</span>
                  </div>
                  <div className="flex items-center space-x-2 text-neutral-200">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <span>Złoty i Chromatyczny motyw Liquid Glass</span>
                  </div>
                  <div className="flex items-center space-x-2 text-neutral-200">
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                    <span>Pełne wykresy luki punktowej i postępów</span>
                  </div>
                  <div className="flex items-center space-x-2 text-neutral-200">
                    <ShieldCheck className="w-4 h-4 text-green-400" />
                    <span>Prawdziwa kompilacja natywna `.ipa` pod Apple iOS</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-black">Ustawienia</h2>
                <p className="text-xs text-neutral-400">Dostosuj reguły i motywy Liquid Glass</p>
              </div>

              <div className="p-4 rounded-3xl bg-white/[0.05] backdrop-blur-2xl border border-white/[0.16] space-y-3">
                <div
                  onClick={() => setIsUnitSelectorOpen(true)}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.05] cursor-pointer transition-all"
                >
                  <span className="text-sm font-semibold">Jednostka punktacji</span>
                  <span className="text-xs font-bold text-neutral-400 flex items-center space-x-1">
                    <span>{settings.unit}</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="h-[1px] bg-white/[0.08]" />

                <div
                  onClick={() => setIsQuickDeltasOpen(true)}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.05] cursor-pointer transition-all"
                >
                  <span className="text-sm font-semibold">Szybkie przyciski +/-</span>
                  <span className="text-xs font-bold text-neutral-400 flex items-center space-x-1">
                    <span>{settings.quickDeltas.map(d => (d > 0 ? `+${d}` : d)).join(', ')}</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Reset Data */}
              <div className="p-4 rounded-3xl bg-white/[0.05] backdrop-blur-2xl border border-white/[0.16] space-y-3">
                <button
                  id="reset-defaults-btn"
                  onClick={() => {
                    setPlayers(DEFAULT_PLAYERS);
                    setSettings({ unit: 'PKT', quickDeltas: [10, 50, 100, -10] });
                  }}
                  className="w-full flex items-center justify-between p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all text-sm font-bold"
                >
                  <span className="flex items-center space-x-2">
                    <RotateCcw className="w-4 h-4" />
                    <span>Przywróć domyślnych sportowców</span>
                  </span>
                </button>
              </div>

              {/* Project ID / Bundle Info */}
              <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/[0.08] text-center space-y-1">
                <p className="text-xs font-bold text-neutral-400">Bundle Identifier (BEZ ZMIAN):</p>
                <code className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                  com.leaderboard.app
                </code>
              </div>
            </div>
          )}

          {/* TAB 5: SWIFT CODE VIEWER */}
          {activeTab === 'code' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black">Natywny Kod Swift</h2>
                  <p className="text-xs text-neutral-400">SwiftUI • Liquid Glass • .numericText()</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`// iOS 17+ Native Swift Liquid Glass
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
                  className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.18] flex items-center space-x-1 text-neutral-300"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Skopiowano!' : 'Kopiuj Swift'}</span>
                </button>
              </div>

              <div className="p-4 rounded-3xl bg-black/70 backdrop-blur-2xl border border-white/[0.14] font-mono text-[11px] text-neutral-300 overflow-x-auto space-y-2">
                <div className="text-amber-400 font-bold">// Sources/Leaderboard/Views/Components/RollingDigitView.swift</div>
                <pre>{`Text(formattedString)
    .font(.system(size: 26, weight: .heavy, design: .rounded))
    .contentTransition(.numericText(value: Double(value)))
    .monospacedDigit()
    .animation(.spring(response: 0.42, dampingFraction: 0.82), value: value)`}</pre>

                <div className="text-blue-400 font-bold pt-2">// Sources/Leaderboard/Views/MainTabView.swift</div>
                <pre>{`TabView {
    LeaderboardView(viewModel: viewModel)
    AnalyticsView(viewModel: viewModel)
    PremiumStoreView(viewModel: viewModel)
    SettingsView(viewModel: viewModel)
}`}</pre>
              </div>
            </div>
          )}
        </div>

        {/* FLOATING LIQUID GLASS TAB BAR */}
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-50">
          <nav className="p-1.5 rounded-full bg-white/[0.08] backdrop-blur-3xl border border-white/[0.22] shadow-[0_12px_40px_rgba(0,0,0,0.65)] flex items-center justify-between relative overflow-hidden">
            {/* Specular Highlight */}
            <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

            <button
              id="tab-leaderboard-btn"
              onClick={() => setActiveTab('leaderboard')}
              className={`flex-1 py-2 rounded-full flex flex-col items-center space-y-0.5 transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-white/[0.18] text-white shadow-inner font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span className="text-[10px]">Tabela</span>
            </button>

            <button
              id="tab-analytics-btn"
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 py-2 rounded-full flex flex-col items-center space-y-0.5 transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white/[0.18] text-white shadow-inner font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="text-[10px]">Wykresy</span>
            </button>

            <button
              id="tab-pro-btn"
              onClick={() => setActiveTab('pro')}
              className={`flex-1 py-2 rounded-full flex flex-col items-center space-y-0.5 transition-all ${
                activeTab === 'pro'
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-inner font-bold'
                  : 'text-amber-400/70 hover:text-amber-300'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span className="text-[10px]">PRO (0 zł)</span>
            </button>

            <button
              id="tab-settings-btn"
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-2 rounded-full flex flex-col items-center space-y-0.5 transition-all ${
                activeTab === 'settings'
                  ? 'bg-white/[0.18] text-white shadow-inner font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="text-[10px]">Opcje</span>
            </button>

            <button
              id="tab-code-btn"
              onClick={() => setActiveTab('code')}
              className={`flex-1 py-2 rounded-full flex flex-col items-center space-y-0.5 transition-all ${
                activeTab === 'code'
                  ? 'bg-white/[0.18] text-white shadow-inner font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span className="text-[10px]">Swift</span>
            </button>
          </nav>
        </div>
      </div>

      {/* MODAL: ADD ATHLETE */}
      <AnimatePresence>
        {isAddPlayerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm p-6 rounded-3xl bg-[#12151D] border border-white/[0.2] shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black">Dodaj Zawodnika</h3>
                <button onClick={() => setIsAddPlayerOpen(false)} className="text-neutral-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddPlayer} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-400 mb-1 block">Imię i nazwisko</label>
                  <input
                    type="text"
                    required
                    placeholder="np. Robert Lewandowski"
                    value={newPlayerName}
                    onChange={e => setNewPlayerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white/[0.08] border border-white/[0.15] text-sm text-white focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-400 mb-1 block">Wynik początkowy</label>
                  <input
                    type="number"
                    value={newPlayerScore}
                    onChange={e => setNewPlayerScore(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white/[0.08] border border-white/[0.15] text-sm text-white focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-400 mb-1 block">Wybierz Emoji</label>
                  <div className="flex flex-wrap gap-2">
                    {emojis.map(e => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setNewPlayerEmoji(e)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${
                          newPlayerEmoji === e ? 'bg-white/20 border border-blue-400' : 'bg-white/[0.05]'
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-400 mb-1 block">Kolor akcentu</label>
                  <div className="flex gap-2">
                    {colors.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNewPlayerColor(c)}
                        className={`w-7 h-7 rounded-full transition-all ${
                          newPlayerColor === c ? 'scale-110 ring-2 ring-white' : ''
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 font-extrabold text-sm text-white shadow-lg transition-all"
                >
                  Dodaj do Tありますeli
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: APPLE PAY 0 ZŁ PURCHASE SHEET */}
      <AnimatePresence>
        {isApplePayModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-3 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md p-6 rounded-3xl bg-[#1C1C1E] border border-white/[0.2] shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.1]">
                <div className="flex items-center space-x-2">
                  <span className="font-black text-xl">Pay</span>
                </div>
                <button
                  onClick={() => setIsApplePayModalOpen(false)}
                  className="text-sm font-semibold text-blue-400 hover:text-blue-300"
                >
                  Anuluj
                </button>
              </div>

              {/* Card info */}
              <div className="flex items-center space-x-3 py-1">
                <div className="w-10 h-6 rounded-md bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-[9px] font-black tracking-widest text-white shadow">
                  CARD
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Apple Cash / Karta domyślna</p>
                  <p className="text-[10px] text-neutral-400">•••• 8821</p>
                </div>
              </div>

              <div className="h-[1px] bg-white/[0.08]" />

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-300">
                  <span>Leaderboard PRO (Dożywotni dostęp)</span>
                  <span>0,00 zł</span>
                </div>
                <div className="flex justify-between text-green-400 font-medium">
                  <span>Promocja Early Access (100% zniżki)</span>
                  <span>-49,99 zł</span>
                </div>
              </div>

              <div className="h-[1px] bg-white/[0.08]" />

              <div className="flex justify-between items-baseline pt-1">
                <span className="text-xs font-black uppercase tracking-wider text-neutral-400">Do zapłaty</span>
                <span className="text-2xl font-black text-white">0,00 zł</span>
              </div>

              {/* Action Button */}
              {isProcessingPayment ? (
                <div className="py-4 text-center space-y-2">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-neutral-400">Autoryzacja Face ID...</p>
                </div>
              ) : paymentSuccess ? (
                <div className="py-4 text-center space-y-1 text-green-400">
                  <CheckCircle2 className="w-10 h-10 mx-auto" />
                  <p className="font-extrabold text-sm text-white">Płatność zakończona (0,00 zł)!</p>
                </div>
              ) : (
                <button
                  id="confirm-apple-pay-btn"
                  onClick={handleProcessApplePay}
                  className="w-full py-4 rounded-2xl bg-white text-black font-black text-sm flex items-center justify-center space-x-2 shadow-xl hover:bg-neutral-100 active:scale-95 transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Kliknij dwukrotnie, aby zapłacić 0,00 zł</span>
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: UNIT SELECTOR */}
      <AnimatePresence>
        {isUnitSelectorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xs p-5 rounded-3xl bg-[#12151D] border border-white/[0.2] shadow-2xl space-y-3"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black">Wybierz jednostkę</h3>
                <button onClick={() => setIsUnitSelectorOpen(false)} className="text-neutral-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {PRESET_UNITS.map(u => (
                  <button
                    key={u}
                    onClick={() => {
                      setSettings(prev => ({ ...prev, unit: u }));
                      setIsUnitSelectorOpen(false);
                    }}
                    className={`py-2 px-3 rounded-xl font-bold text-xs ${
                      settings.unit === u
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/[0.08] text-neutral-300 hover:bg-white/[0.14]'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: QUICK DELTAS SELECTOR */}
      <AnimatePresence>
        {isQuickDeltasOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xs p-5 rounded-3xl bg-[#12151D] border border-white/[0.2] shadow-2xl space-y-3"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black">Szybkie przyciski +/-</h3>
                <button onClick={() => setIsQuickDeltasOpen(false)} className="text-neutral-400 hover:text-white">
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
                      setIsQuickDeltasOpen(false);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] font-mono text-xs flex justify-between"
                  >
                    <span>Zestaw #{idx + 1}</span>
                    <span className="text-amber-400 font-bold">{preset.map(d => (d > 0 ? `+${d}` : d)).join(', ')}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
