import React, { useState } from 'react';
import { Quest } from '../types/game';
import { Scroll, Compass, Coins, Award, Swords, CheckCircle2, ChevronRight, Gem } from 'lucide-react';
import { sounds } from '../utils/audio';

interface QuestViewProps {
  quests: Quest[];
  onAcceptQuest: (questId: string) => void;
  onStartQuestBattle: (quest: Quest) => void;
  onClaimReward: (questId: string) => void;
}

export const QuestView: React.FC<QuestViewProps> = ({
  quests,
  onAcceptQuest,
  onStartQuestBattle,
  onClaimReward,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'available' | 'completed'>('all');

  const filteredQuests = quests.filter((q) => {
    if (filter === 'active') return q.status === 'active';
    if (filter === 'available') return q.status === 'available';
    if (filter === 'completed') return q.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header do Diário */}
      <div className="bg-[#18140f] border border-[#785b20] rounded-xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.7)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#a88636] font-semibold">Crônicas do Reino</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f3d484] flex items-center gap-2.5">
            <Scroll className="w-6 h-6 text-[#c59b27]" />
            Diário de Missões
          </h1>
          <p className="text-xs sm:text-sm text-[#bdae93] mt-0.5">
            Contratos de bravura, relíquias esquecidas e defesas da Província de Solis.
          </p>
        </div>

        {/* Filtro em estilo Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-[#120f0b] border border-[#3d3119] rounded-lg shrink-0">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'active', label: 'Ativas' },
            { id: 'available', label: 'Disponíveis' },
            { id: 'completed', label: 'Concluídas' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setFilter(tab.id as typeof filter);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-[#c59b27] text-black shadow'
                  : 'text-[#a88636] hover:text-[#f3d484] hover:bg-[#201910]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Missões */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQuests.map((quest) => {
          const isCompleted = quest.status === 'completed';
          const isActive = quest.status === 'active';

          return (
            <div
              key={quest.id}
              className={`bg-[#18140f] border rounded-xl p-5 shadow-lg flex flex-col justify-between transition-all ${
                isCompleted
                  ? 'border-emerald-800/40 opacity-75'
                  : isActive
                  ? 'border-[#c59b27] shadow-[0_0_20px_rgba(197,155,39,0.15)]'
                  : 'border-[#3d3119] hover:border-[#785b20]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold uppercase text-[#a88636] tracking-wider">
                    {quest.category} · {quest.difficulty}
                  </span>
                  {isCompleted ? (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Concluída
                    </span>
                  ) : isActive ? (
                    <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                      Em Andamento
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Disponível</span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-[#f3d484] leading-snug">
                  {quest.title}
                </h3>
                <p className="text-xs text-[#a88636] font-medium mb-2.5">
                  {quest.subtitle} · <span className="text-[#bdae93]">{quest.location}</span>
                </p>

                <p className="text-xs text-[#c4b59d] leading-relaxed mb-4">
                  {quest.description}
                </p>
              </div>

              <div>
                {/* Recompensas */}
                <div className="bg-[#120f0b] border border-[#3d3119] rounded-lg p-3 mb-4">
                  <span className="text-[10px] uppercase font-bold text-[#a88636] block mb-1.5">
                    Recompensas ao Concluir
                  </span>
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="text-amber-300 font-mono flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      +{quest.rewardGold} Moedas
                    </span>
                    {quest.rewardGems > 0 && (
                      <span className="text-cyan-300 font-mono flex items-center gap-1">
                        <Gem className="w-3.5 h-3.5 text-cyan-400" />
                        +{quest.rewardGems} Gemas
                      </span>
                    )}
                    <span className="text-purple-300 font-mono flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-purple-400" />
                      +{quest.rewardExp} XP
                    </span>
                    {quest.rewardItem && (
                      <span className="text-emerald-300 flex items-center gap-1 truncate">
                        <span>{quest.rewardItem.icon}</span>
                        <span className="underline">{quest.rewardItem.name}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex items-center gap-2">
                  {isActive && (
                    <button
                      onClick={() => {
                        sounds.playSwordClash();
                        onStartQuestBattle(quest);
                      }}
                      className="flex-1 py-2.5 bg-gradient-to-r from-[#9e7417] to-[#d4af37] hover:from-[#b0831d] hover:to-[#e2ba58] text-black font-bold text-xs rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-98"
                    >
                      <Swords className="w-4 h-4" />
                      <span>Empreender Batalha da Missão</span>
                    </button>
                  )}

                  {quest.status === 'available' && (
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onAcceptQuest(quest.id);
                      }}
                      className="flex-1 py-2.5 bg-[#251e13] hover:bg-[#382d1c] text-[#f3d484] border border-[#8e6e23] font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Aceitar Contrato</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {isCompleted && (
                    <div className="w-full py-2 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-emerald-300 text-xs text-center font-medium">
                      Recompensas já outorgadas à Alaric
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
