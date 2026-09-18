import React from 'react';
import { Crown, Sparkles, Layers, BarChart3, ShieldCheck, CheckCircle2, Swords, History } from 'lucide-react';

interface ProStoreTabProps {
  isProUnlocked: boolean;
  onTriggerApplePay: () => void;
}

export const ProStoreTab: React.FC<ProStoreTabProps> = ({ isProUnlocked, onTriggerApplePay }) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Holographic Obsidian Glass Card */}
      <div className="relative p-6 rounded-3xl bg-gradient-to-br from-[#1b1912] via-[#141829] to-[#0f1d24] border border-amber-400/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

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
            <span className="text-sm line-through text-neutral-500">49,99 zł</span>
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
          <div className="flex items-center space-x-2 text-green-400 font-bold text-sm bg-green-500/10 border border-green-500/30 p-3 rounded-2xl">
            <CheckCircle2 className="w-5 h-5" />
            <span>Posiadasz aktywną licencję PRO!</span>
          </div>
        ) : (
          <button
            id="buy-apple-pay-btn"
            onClick={onTriggerApplePay}
            className="w-full py-3.5 px-4 rounded-2xl bg-white text-black font-extrabold flex items-center justify-center space-x-2 shadow-xl hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer"
          >
            <span>Kup z</span>
            <span className="font-black text-base flex items-center">Pay</span>
            <span className="text-xs font-medium ml-2 px-2 py-0.5 rounded-md bg-black/10">0,00 zł</span>
          </button>
        )}
      </div>

      {/* Features List in Obsidian Glass */}
      <div className="p-4 rounded-2xl bg-[#0e131f]/95 border border-white/[0.08] shadow-lg space-y-3">
        <h4 className="text-xs font-black text-neutral-300 uppercase tracking-wider">
          W pakiecie PRO otrzymujesz:
        </h4>
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center space-x-2.5 text-neutral-200">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Nielimitowana liczba zawodników i kategorii</span>
          </div>
          <div className="flex items-center space-x-2.5 text-neutral-200">
            <Swords className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Tryb Pojedynków 1v1 z transferem punktów</span>
          </div>
          <div className="flex items-center space-x-2.5 text-neutral-200">
            <History className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Pełny Dziennik Zdarzeń z funkcją Cofnij (Undo)</span>
          </div>
          <div className="flex items-center space-x-2.5 text-neutral-200">
            <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Czysty Obsidian Liquid Glass bez mlecznych artefaktów</span>
          </div>
          <div className="flex items-center space-x-2.5 text-neutral-200">
            <BarChart3 className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Wykresy Apple Charts i statystyki luki punktowej</span>
          </div>
          <div className="flex items-center space-x-2.5 text-neutral-200">
            <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
            <span>Kompilacja natywnego pliku `.ipa` (Bundle: com.leaderboard.app)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
