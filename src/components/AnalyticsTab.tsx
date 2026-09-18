import React from 'react';
import { Trophy, TrendingUp, Flame, Users, BarChart3, Zap, Award } from 'lucide-react';
import { Player } from '../types';
import { RollingNumber } from './RollingNumber';

interface AnalyticsTabProps {
  players: Player[];
  unit: string;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ players, unit }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const totalScore = players.reduce((acc, p) => acc + p.score, 0);
  const averageScore = players.length > 0 ? Math.round(totalScore / players.length) : 0;
  const topScore = sortedPlayers.length > 0 ? sortedPlayers[0].score : 0;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-black">Wykresy i Statystyki</h2>
        <p className="text-xs text-neutral-400">Apple Charts & Liquid Glass Analytics</p>
      </div>

      {/* 4 Key Metrics */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-[#0e131f]/90 border border-amber-500/20 shadow-md">
          <div className="text-amber-400 text-xs font-bold flex items-center space-x-1 mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>Lider</span>
          </div>
          <div className="text-xl font-black text-white">
            <RollingNumber value={topScore} />
          </div>
          <div className="text-[10px] text-neutral-400">{sortedPlayers[0]?.name || '-'}</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0e131f]/90 border border-blue-500/20 shadow-md">
          <div className="text-blue-400 text-xs font-bold flex items-center space-x-1 mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Średnia punktów</span>
          </div>
          <div className="text-xl font-black text-white">
            <RollingNumber value={averageScore} />
          </div>
          <div className="text-[10px] text-neutral-400">na zawodnika ({unit})</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0e131f]/90 border border-purple-500/20 shadow-md">
          <div className="text-purple-400 text-xs font-bold flex items-center space-x-1 mb-1">
            <Flame className="w-3.5 h-3.5" />
            <span>Suma punktów</span>
          </div>
          <div className="text-xl font-black text-white">
            <RollingNumber value={totalScore} />
          </div>
          <div className="text-[10px] text-neutral-400">cała liga ({unit})</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0e131f]/90 border border-green-500/20 shadow-md">
          <div className="text-green-400 text-xs font-bold flex items-center space-x-1 mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Zawodnicy</span>
          </div>
          <div className="text-xl font-black text-white">
            {players.length}
          </div>
          <div className="text-[10px] text-neutral-400">aktywnych profilów</div>
        </div>
      </div>

      {/* Comparative Bar Chart in Obsidian Liquid Glass */}
      <div className="p-4 rounded-2xl bg-[#0e131f]/95 border border-white/[0.08] shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold flex items-center space-x-1.5 text-white">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>Wykres Porównawczy Zawodników</span>
          </span>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{unit}</span>
        </div>

        <div className="space-y-2.5 pt-1">
          {sortedPlayers.map((player) => {
            const percentage = topScore > 0 ? Math.max(6, Math.round((player.score / topScore) * 100)) : 0;
            return (
              <div key={player.id} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="flex items-center space-x-1.5 truncate">
                    <span>{player.avatarEmoji}</span>
                    <span className="text-neutral-200">{player.name}</span>
                  </span>
                  <span className="font-bold text-white font-mono">
                    <RollingNumber value={player.score} /> {unit} ({percentage}%)
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#161c2d] overflow-hidden p-0.5 border border-white/[0.04]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: player.avatarColorHex,
                      boxShadow: `0 0 10px ${player.avatarColorHex}50`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gap to Leader Chart */}
      <div className="p-4 rounded-2xl bg-[#0e131f]/95 border border-white/[0.08] shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold flex items-center space-x-1.5 text-white">
            <Zap className="w-4 h-4 text-purple-400" />
            <span>Dystans do Lidera (Strata punktowa)</span>
          </span>
        </div>

        <div className="space-y-2 pt-1">
          {sortedPlayers.map((player, idx) => {
            const gap = topScore - player.score;
            return (
              <div key={player.id} className="flex items-center justify-between text-xs py-1.5 border-b border-white/[0.04]">
                <span className="text-neutral-300">#{idx + 1} {player.avatarEmoji} {player.name}</span>
                <span className="font-bold font-mono text-purple-300">
                  {gap === 0 ? '👑 Lider tabeli' : `-${gap} ${unit}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
