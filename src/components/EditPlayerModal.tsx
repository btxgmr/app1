import React, { useState } from 'react';
import { X, Trash2, RotateCcw, Check } from 'lucide-react';
import { Player } from '../types';

interface EditPlayerModalProps {
  player: Player;
  unit: string;
  onClose: () => void;
  onSave: (updated: Player) => void;
  onDelete: (id: string) => void;
}

export const EditPlayerModal: React.FC<EditPlayerModalProps> = ({
  player,
  unit,
  onClose,
  onSave,
  onDelete
}) => {
  const [name, setName] = useState(player.name);
  const [score, setScore] = useState(String(player.score));
  const [emoji, setEmoji] = useState(player.avatarEmoji);
  const [color, setColor] = useState(player.avatarColorHex);
  const [category, setCategory] = useState(player.category || 'Ogólna');

  const emojis = ['🔥', '⚡️', '🏃‍♂️', '🚴‍♀️', '🥊', '🧘', '🏆', '💎', '🦁', '🚀', '⭐️', '🎯', '⚽️', '🏀', '🏎️', '🎮'];
  const colors = ['#FF453A', '#FF9F0A', '#FFD60A', '#30D158', '#0A84FF', '#5E5CE6', '#BF5AF2', '#64D2FF'];
  const categories = ['Ogólna', 'Siłownia', 'Cardio', 'Gaming', 'Praca'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      ...player,
      name: name.trim(),
      score: parseInt(score) || 0,
      avatarEmoji: emoji,
      avatarColorHex: color,
      category
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm p-5 rounded-3xl bg-[#0e131f] border border-white/[0.12] shadow-2xl space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-white/[0.08]">
          <h3 className="text-base font-black text-white">Edytuj Zawodnika</h3>
          <button onClick={onClose} className="p-1 rounded-full text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-neutral-400 mb-1 block">Imię i nazwisko</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#151b2c] border border-white/[0.1] text-sm text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-neutral-400 mb-1 block">Wynik ({unit})</label>
              <input
                type="number"
                value={score}
                onChange={e => setScore(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#151b2c] border border-white/[0.1] text-sm font-mono text-white focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="font-bold text-neutral-400 mb-1 block">Kategoria</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#151b2c] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-blue-400"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-neutral-400 mb-1 block">Emoji</label>
            <div className="grid grid-cols-8 gap-1.5">
              {emojis.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`h-8 rounded-lg flex items-center justify-center text-sm ${
                    emoji === e ? 'bg-blue-500/30 border border-blue-400' : 'bg-[#151b2c]'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-neutral-400 mb-1 block">Kolor akcentu</label>
            <div className="flex gap-2">
              {colors.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    color === c ? 'scale-125 ring-2 ring-white' : 'opacity-80'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <button
              type="button"
              onClick={() => {
                onDelete(player.id);
                onClose();
              }}
              className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all flex items-center justify-center"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setScore('0')}
              className="px-3 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 border border-white/[0.08] transition-all flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Zeruj</span>
            </button>

            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center space-x-1 shadow-lg transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Zapisz zmiany</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
