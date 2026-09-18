import React, { useState } from 'react';
import { Swords, Trophy, Dices, Flame, Sparkles, CheckCircle2 } from 'lucide-react';
import { Player } from '../types';
import { RollingNumber } from './RollingNumber';
import { playHapticSound } from '../utils/audio';

interface DuelsTabProps {
  players: Player[];
  unit: string;
  soundEnabled: boolean;
  onExecuteDuel: (winnerId: string, loserId: string, stake: number) => void;
}

export const DuelsTab: React.FC<DuelsTabProps> = ({
  players,
  unit,
  soundEnabled,
  onExecuteDuel
}) => {
  const [player1Id, setPlayer1Id] = useState<string>(players[0]?.id || '');
  const [player2Id, setPlayer2Id] = useState<string>(players[1]?.id || '');
  const [stake, setStake] = useState<number>(50);
  const [isSimulating, setIsSimulating] = useState(false);
  const [duelResult, setDuelResult] = useState<{
    winner: Player;
    loser: Player;
    stake: number;
  } | null>(null);

  const p1 = players.find(p => p.id === player1Id);
  const p2 = players.find(p => p.id === player2Id);

  const handleStartDuel = (declaredWinnerId?: string) => {
    if (!p1 || !p2 || p1.id === p2.id) return;

    if (soundEnabled) {
      playHapticSound('tap');
    }

    setIsSimulating(true);
    setDuelResult(null);

    setTimeout(() => {
      let winner = p1;
      let loser = p2;

      if (declaredWinnerId) {
        winner = declaredWinnerId === p1.id ? p1 : p2;
        loser = declaredWinnerId === p1.id ? p2 : p1;
      } else {
        // Dynamic simulated outcome based on current form
        const p1Power = p1.score + Math.random() * 200;
        const p2Power = p2.score + Math.random() * 200;
        if (p2Power > p1Power) {
          winner = p2;
          loser = p1;
        }
      }

      onExecuteDuel(winner.id, loser.id, stake);
      setDuelResult({ winner, loser, stake });
      setIsSimulating(false);

      if (soundEnabled) {
        playHapticSound('victory');
      }
    }, 700);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-black flex items-center space-x-2">
          <Swords className="w-5 h-5 text-rose-400" />
          <span>Arena Pojedynków 1v1</span>
        </h2>
        <p className="text-xs text-neutral-400">Rzuć wyzwanie i przejmij punkty rywala</p>
      </div>

      {players.length < 2 ? (
        <div className="p-6 rounded-2xl bg-[#0e131f]/80 border border-white/[0.08] text-center text-neutral-400">
          Potrzebujesz co najmniej 2 zawodników, aby rozegrać pojedynek.
        </div>
      ) : (
        <>
          {/* Fighters Selection */}
          <div className="grid grid-cols-2 gap-3">
            {/* Fighter 1 */}
            <div className="p-3.5 rounded-2xl bg-[#0f1422]/90 border border-cyan-500/20 shadow-lg flex flex-col items-center text-center relative overflow-hidden">
              <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-2">Zawodnik A</div>
              <select
                value={player1Id}
                onChange={e => setPlayer1Id(e.target.value)}
                className="w-full bg-[#161c2e] text-xs font-bold text-white rounded-xl p-2 border border-white/[0.1] focus:outline-none mb-3 cursor-pointer"
              >
                {players.map(p => (
                  <option key={p.id} value={p.id} disabled={p.id === player2Id}>
                    {p.avatarEmoji} {p.name} ({p.score} {unit})
                  </option>
                ))}
              </select>

              {p1 && (
                <div className="space-y-1">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto shadow-inner"
                    style={{ backgroundColor: `${p1.avatarColorHex}25`, border: `2px solid ${p1.avatarColorHex}80` }}
                  >
                    {p1.avatarEmoji}
                  </div>
                  <p className="font-bold text-sm text-white">{p1.name}</p>
                  <p className="text-xs text-neutral-400">
                    <RollingNumber value={p1.score} /> {unit}
                  </p>
                  <div className="flex items-center justify-center space-x-1 text-[10px] text-green-400">
                    <Flame className="w-3 h-3" />
                    <span>Seria: {p1.streak || 0}W</span>
                  </div>
                </div>
              )}
            </div>

            {/* Fighter 2 */}
            <div className="p-3.5 rounded-2xl bg-[#0f1422]/90 border border-rose-500/20 shadow-lg flex flex-col items-center text-center relative overflow-hidden">
              <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-2">Zawodnik B</div>
              <select
                value={player2Id}
                onChange={e => setPlayer2Id(e.target.value)}
                className="w-full bg-[#161c2e] text-xs font-bold text-white rounded-xl p-2 border border-white/[0.1] focus:outline-none mb-3 cursor-pointer"
              >
                {players.map(p => (
                  <option key={p.id} value={p.id} disabled={p.id === player1Id}>
                    {p.avatarEmoji} {p.name} ({p.score} {unit})
                  </option>
                ))}
              </select>

              {p2 && (
                <div className="space-y-1">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto shadow-inner"
                    style={{ backgroundColor: `${p2.avatarColorHex}25`, border: `2px solid ${p2.avatarColorHex}80` }}
                  >
                    {p2.avatarEmoji}
                  </div>
                  <p className="font-bold text-sm text-white">{p2.name}</p>
                  <p className="text-xs text-neutral-400">
                    <RollingNumber value={p2.score} /> {unit}
                  </p>
                  <div className="flex items-center justify-center space-x-1 text-[10px] text-green-400">
                    <Flame className="w-3 h-3" />
                    <span>Seria: {p2.streak || 0}W</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stake Selector */}
          <div className="p-4 rounded-2xl bg-[#0e131f]/90 border border-white/[0.08] shadow-lg space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-neutral-300">Stawka pojedynku</span>
              <span className="font-black text-amber-400 font-mono text-sm">
                ±{stake} {unit}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {[10, 25, 50, 100, 250].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setStake(val)}
                  className={`py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                    stake === val
                      ? 'bg-amber-500/30 text-amber-300 border border-amber-400/50'
                      : 'bg-[#151b2b] text-neutral-400 hover:text-white border border-white/[0.05]'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Duel Action Buttons */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                disabled={isSimulating || !p1 || !p2}
                onClick={() => handleStartDuel(p1?.id)}
                className="py-3 px-3 rounded-2xl bg-cyan-600/25 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/40 text-xs font-extrabold flex items-center justify-center space-x-1.5 active:scale-95 transition-all shadow-lg"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span className="truncate">Wygrał {p1?.name.split(' ')[0]}</span>
              </button>

              <button
                disabled={isSimulating || !p1 || !p2}
                onClick={() => handleStartDuel(p2?.id)}
                className="py-3 px-3 rounded-2xl bg-rose-600/25 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 text-xs font-extrabold flex items-center justify-center space-x-1.5 active:scale-95 transition-all shadow-lg"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span className="truncate">Wygrał {p2?.name.split(' ')[0]}</span>
              </button>
            </div>

            <button
              disabled={isSimulating || !p1 || !p2}
              onClick={() => handleStartDuel()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-purple-600 to-blue-600 text-white font-black text-sm flex items-center justify-center space-x-2 shadow-xl hover:opacity-95 active:scale-95 transition-all"
            >
              <Dices className="w-4 h-4" />
              <span>{isSimulating ? 'Trwa rozstrzyganie starcia...' : `Symuluj Pojedynek (Losuj Zwycięzcę)`}</span>
            </button>
          </div>

          {/* Duel Result Notification Banner */}
          {duelResult && (
            <div className="p-4 rounded-2xl bg-[#141b2c] border border-amber-400/40 shadow-xl space-y-2 animate-in zoom-in-95 duration-200">
              <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Wynik Pojedynku</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{duelResult.winner.avatarEmoji}</span>
                  <div>
                    <p className="font-extrabold text-white">{duelResult.winner.name}</p>
                    <p className="text-[11px] text-green-400 font-bold">Zwycięzca (+{duelResult.stake} {unit})</p>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
