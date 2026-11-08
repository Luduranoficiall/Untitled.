import React, { useState } from 'react';
import { AttributeKey, Attributes, Character } from '../types/game';
import { SireAlaricPortrait } from './Artwork';
import { Sparkles, Plus, X, RotateCcw, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/audio';

interface LevelUpModalProps {
  character: Character;
  isOpen: boolean;
  onClose: () => void;
  onConfirmLevelUp: (allocated: Partial<Attributes>, pointsSpent: number) => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  character,
  isOpen,
  onClose,
  onConfirmLevelUp,
}) => {
  const [allocated, setAllocated] = useState<Record<AttributeKey, number>>({
    str: 0,
    dex: 0,
    con: 0,
    int: 0,
    wis: 0,
    cha: 0,
  });

  if (!isOpen) return null;

  const totalSpent = Object.values(allocated).reduce((a, b) => a + b, 0);
  const remainingPoints = character.statPoints - totalSpent;

  const handleIncrement = (key: AttributeKey) => {
    if (remainingPoints <= 0) return;
    sounds.playClick();
    setAllocated((prev) => ({
      ...prev,
      [key]: prev[key] + 1,
    }));
  };

  const handleDecrement = (key: AttributeKey) => {
    if (allocated[key] <= 0) return;
    sounds.playClick();
    setAllocated((prev) => ({
      ...prev,
      [key]: prev[key] - 1,
    }));
  };

  const handleReset = () => {
    sounds.playClick();
    setAllocated({ str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 });
  };

  const handleConfirm = () => {
    if (totalSpent === 0) {
      onClose();
      return;
    }
    sounds.playLevelUpFanfare();
    onConfirmLevelUp(allocated, totalSpent);
    onClose();
  };

  const attributeList: { key: AttributeKey; label: string; desc: string }[] = [
    { key: 'str', label: 'FORÇA', desc: '+Impacto físico e dano com espadas' },
    { key: 'dex', label: 'DESTREZA', desc: '+Esquiva de golpes e precisão crítica' },
    { key: 'con', label: 'CONSTITUIÇÃO', desc: '+Vigor vital e +10 PV Máximo por ponto' },
    { key: 'int', label: 'INTELIGÊNCIA', desc: '+Resistência a feitiços e astúcia' },
    { key: 'wis', label: 'SABEDORIA', desc: '+Poder da Imposição de Mãos e +8 PM' },
    { key: 'cha', label: 'CARISMA', desc: '+Aura de liderança e barganha no Bazar' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#18140f] border-2 border-[#c59b27] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-[0_0_50px_rgba(197,155,39,0.35)] relative animate-in fade-in zoom-in-95 my-8">
        {/* Fechar modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#a88636] hover:text-[#f3d484] p-1.5 rounded-lg hover:bg-[#251e13] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho de Evolução em Ouro */}
        <div className="text-center mb-6">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#a88636] block">
            HERO'S RECORD · ORDEM DOURADA
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#fff6d6] via-[#e5bf5e] to-[#9e7417] tracking-wider my-1 font-cinzel">
            SUBIU DE NÍVEL!
          </h2>
          <p className="text-xs text-[#bdae93]">
            Os feitos heroicos de Sire Alaric ecoam pelos salões sagrados de Solis.
          </p>
        </div>

        {/* Retrato Central com Nível */}
        <div className="flex flex-col items-center mb-6">
          <SireAlaricPortrait size="md" />
          <div className="mt-3 px-4 py-1 bg-[#251e14] border border-[#c59b27] rounded-full text-center">
            <span className="text-xs font-bold text-[#f3d484] font-cinzel">
              NÍVEL {character.level}
            </span>
          </div>
          <p className="text-[11px] text-[#a88636] mt-1 text-center max-w-xs">
            Paladino da Ordem do Amanhecer. Sua determinação é o seu escudo, e sua fé é a sua espada.
          </p>
        </div>

        {/* Indicador de Pontos Disponíveis */}
        <div className="bg-[#120f0b] border border-[#8e6e23] rounded-xl p-3.5 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-[#f3d484] uppercase tracking-wider">
              Pontos Disponíveis
            </span>
          </div>
          <span className="text-lg font-black text-amber-300 font-mono tabular-nums">
            {remainingPoints}
          </span>
        </div>

        {/* Lista de Atributos com botões de incremento */}
        <div className="space-y-2 mb-6">
          {attributeList.map(({ key, label, desc }) => {
            const currentVal = character.attributes[key];
            const added = allocated[key];

            return (
              <div
                key={key}
                className="bg-[#120f0b] border border-[#3d3119] rounded-lg p-2.5 flex items-center justify-between gap-3 hover:border-[#785b20] transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#f3d484] font-cinzel">{label}</span>
                    {added > 0 && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded font-mono font-bold">
                        +{added}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#8c7b64] block leading-tight">{desc}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-base font-bold text-[#f3d484] font-mono tabular-nums w-8 text-center">
                    {currentVal + added}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDecrement(key)}
                      disabled={added <= 0}
                      className="w-7 h-7 rounded bg-[#251e14] hover:bg-[#382d1b] disabled:opacity-30 disabled:pointer-events-none text-amber-300 border border-[#68501c] font-bold text-xs flex items-center justify-center transition-colors"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleIncrement(key)}
                      disabled={remainingPoints <= 0}
                      className="w-7 h-7 rounded bg-[#8e6e23] hover:bg-[#a87c22] disabled:opacity-30 disabled:pointer-events-none text-black font-bold text-xs flex items-center justify-center transition-colors shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rodapé com Ações */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            disabled={totalSpent === 0}
            className="px-4 py-2.5 bg-[#251e14] hover:bg-[#382d1b] disabled:opacity-40 text-[#a88636] border border-[#68501c] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resetar</span>
          </button>

          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 bg-gradient-to-r from-[#9e7417] to-[#d4af37] hover:from-[#b0831d] hover:to-[#e2ba58] text-black font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirmar Atributos ({totalSpent} aplicados)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
