import React, { useState } from 'react';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import { playHapticSound } from '../utils/audio';

interface ApplePayModalProps {
  onClose: () => void;
  onSuccess: () => void;
  soundEnabled: boolean;
}

export const ApplePayModal: React.FC<ApplePayModalProps> = ({ onClose, onSuccess, soundEnabled }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    if (soundEnabled) {
      playHapticSound('tap');
    }

    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      if (soundEnabled) {
        playHapticSound('pro_unlock');
      }

      setTimeout(() => {
        onSuccess();
      }, 1000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md p-6 rounded-3xl bg-[#1c1c1e] border border-white/[0.15] shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.1]">
          <div className="flex items-center space-x-2">
            <span className="font-black text-xl text-white">Pay</span>
          </div>
          <button
            onClick={onClose}
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
            <span>Promocja Early Access (100% rabatu)</span>
            <span>-49,99 zł</span>
          </div>
        </div>

        <div className="h-[1px] bg-white/[0.08]" />

        <div className="flex justify-between items-baseline pt-1">
          <span className="text-xs font-black uppercase tracking-wider text-neutral-400">Do zapłaty</span>
          <span className="text-2xl font-black text-white">0,00 zł</span>
        </div>

        {/* Action Button */}
        {isProcessing ? (
          <div className="py-4 text-center space-y-2">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
            <p className="text-xs text-neutral-400">Autoryzacja Face ID...</p>
          </div>
        ) : isComplete ? (
          <div className="py-4 text-center space-y-1 text-green-400">
            <CheckCircle2 className="w-10 h-10 mx-auto" />
            <p className="font-extrabold text-sm text-white">Gotowe! PRO Odblokowane (0,00 zł)</p>
          </div>
        ) : (
          <button
            id="confirm-apple-pay-btn"
            onClick={handlePay}
            className="w-full py-4 rounded-2xl bg-white text-black font-black text-sm flex items-center justify-center space-x-2 shadow-xl hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>Kliknij dwukrotnie, aby zapłacić 0,00 zł</span>
          </button>
        )}
      </div>
    </div>
  );
};
