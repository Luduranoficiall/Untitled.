import React, { useState } from 'react';
import { BestiaryEntry, Enemy } from '../types/game';
import { BESTIARY_DATA } from '../data/bestiaryData';
import { INITIAL_ENEMIES } from '../data/initialData';
import { EnemyArtwork } from './Artwork';
import { BookOpen, Skull, ShieldAlert, Zap, Swords, Lock, CheckCircle2, ChevronRight, Award, Compass } from 'lucide-react';
import { sounds } from '../utils/audio';

interface BestiaryViewProps {
  killsRecord: Record<string, number>;
  onChallengeEnemy: (enemy: Enemy) => void;
}

export const BestiaryView: React.FC<BestiaryViewProps> = ({
  killsRecord,
  onChallengeEnemy,
}) => {
  const allEntries = Object.values(BESTIARY_DATA);
  const [selectedEnemyId, setSelectedEnemyId] = useState<string>(allEntries[0]?.enemyId || 'shadow_chimera');

  const totalDiscovered = allEntries.filter((e) => (killsRecord[e.enemyId] || 0) > 0).length;
  const totalKills = Object.values(killsRecord).reduce((acc, k) => acc + k, 0);

  const activeEntry = BESTIARY_DATA[selectedEnemyId] || allEntries[0];
  const isUnlocked = (killsRecord[activeEntry.enemyId] || 0) > 0;
  const killsCount = killsRecord[activeEntry.enemyId] || 0;

  return (
    <div className="space-y-6">
      {/* Header do Códice de Bestas */}
      <div className="bg-[#18140f] border border-[#785b20] rounded-xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.7)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#a88636] font-semibold">Tomo do Conhecimento Sagrado</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f3d484] flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-[#c59b27]" />
            Bestiário de Solis
          </h1>
          <p className="text-xs sm:text-sm text-[#bdae93] mt-0.5">
            Registro de abominações, fraquezas táticas e segredos de combate catalogados pela Ordem Dourada.
          </p>
        </div>

        {/* Resumo de Descobertas */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-1.5 bg-[#201910] border border-[#8e6e23] rounded-lg text-center">
            <div className="text-[10px] uppercase text-[#a88636]">Registros Vencidos</div>
            <div className="text-sm font-bold text-amber-300 font-mono tabular-nums">
              {totalDiscovered} / {allEntries.length} Bestas
            </div>
          </div>
          <div className="px-3.5 py-1.5 bg-[#251010] border border-red-800/60 rounded-lg text-center">
            <div className="text-[10px] uppercase text-red-400">Total Abatido</div>
            <div className="text-sm font-bold text-red-300 font-mono tabular-nums">
              {totalKills} Triunfos
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista Lateral de Inimigos */}
        <div className="lg:col-span-1 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#a88636] px-1">
            Índice de Ameaças Conhecidas
          </div>

          <div className="space-y-2">
            {allEntries.map((entry) => {
              const kills = killsRecord[entry.enemyId] || 0;
              const unlocked = kills > 0;
              const isSelected = selectedEnemyId === entry.enemyId;

              return (
                <div
                  key={entry.enemyId}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedEnemyId(entry.enemyId);
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'border-[#c59b27] bg-[#221c14] shadow-[0_0_15px_rgba(197,155,39,0.2)]'
                      : 'border-[#3d3119] bg-[#18140f] hover:border-[#785b20]'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg border flex items-center justify-center shrink-0 relative overflow-hidden ${
                    unlocked ? 'border-[#8e6e23] bg-[#120f0b]' : 'border-slate-800 bg-black/60'
                  }`}>
                    {unlocked ? (
                      <EnemyArtwork enemyId={entry.enemyId} className="w-full h-full border-none" />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] uppercase font-bold text-[#a88636] truncate">
                        {entry.category}
                      </span>
                      {unlocked ? (
                        <span className="text-[10px] text-amber-300 font-mono flex items-center gap-1 font-bold">
                          <Skull className="w-3 h-3 text-red-400" />
                          {kills}x
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-semibold">
                          Oculto
                        </span>
                      )}
                    </div>

                    <h4 className={`text-sm font-bold truncate ${unlocked ? 'text-[#f3d484]' : 'text-slate-400'}`}>
                      {unlocked ? entry.name : '??? Besta Misteriosa'}
                    </h4>

                    <p className="text-[11px] text-[#8c7b64] truncate">
                      {entry.location}
                    </p>
                  </div>

                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-[#c59b27] translate-x-1' : 'text-[#5a482b]'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Detalhes do Monstro Selecionado */}
        <div className="lg:col-span-2 bg-[#18140f] border border-[#785b20] rounded-xl p-6 shadow-lg">
          {isUnlocked ? (
            <div className="space-y-6">
              {/* Header do Monstro */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-5 border-b border-[#3d3119]">
                <EnemyArtwork enemyId={activeEntry.enemyId} className="w-28 h-28 sm:w-36 sm:h-36 shrink-0" />

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                    <span className="px-2.5 py-0.5 bg-[#251e14] border border-[#8e6e23] rounded text-[10px] uppercase font-bold text-[#a88636]">
                      {activeEntry.category}
                    </span>
                    <span className="px-2.5 py-0.5 bg-red-950/60 border border-red-700/60 rounded text-[10px] font-bold text-red-300 font-mono">
                      Nível de Ameaça: {activeEntry.stats.level}
                    </span>
                    <span className="px-2.5 py-0.5 bg-amber-950/40 border border-amber-600/50 rounded text-[10px] font-bold text-amber-300">
                      Derrotado {killsCount} vez{killsCount > 1 ? 'es' : ''}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-[#f3d484] font-cinzel">
                    {activeEntry.name}
                  </h2>
                  <p className="text-xs text-[#bdae93] mb-2">{activeEntry.title}</p>
                  <p className="text-xs text-[#a88636] flex items-center justify-center sm:justify-start gap-1">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Habitat Conhecido: {activeEntry.location}</span>
                  </p>
                </div>
              </div>

              {/* Estatísticas Vitais da Criatura */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#120f0b] border border-[#3d3119] rounded-lg p-3 text-center">
                  <span className="text-[10px] uppercase text-[#a88636] block">Pontos de Vida</span>
                  <span className="text-base font-bold text-red-400 font-mono tabular-nums">
                    {activeEntry.stats.hp} PV
                  </span>
                </div>
                <div className="bg-[#120f0b] border border-[#3d3119] rounded-lg p-3 text-center">
                  <span className="text-[10px] uppercase text-[#a88636] block">Poder de Ataque</span>
                  <span className="text-base font-bold text-amber-300 font-mono tabular-nums">
                    {activeEntry.stats.attack} ATQ
                  </span>
                </div>
                <div className="bg-[#120f0b] border border-[#3d3119] rounded-lg p-3 text-center">
                  <span className="text-[10px] uppercase text-[#a88636] block">Couraça / Defesa</span>
                  <span className="text-base font-bold text-emerald-300 font-mono tabular-nums">
                    {activeEntry.stats.defense} DEF
                  </span>
                </div>
              </div>

              {/* Lore & História Canônica */}
              <div className="bg-[#120f0b] border border-[#3d3119] rounded-xl p-4">
                <h3 className="text-xs font-bold uppercase text-[#a88636] tracking-wider mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#c59b27]" />
                  Lore & Registro Histórico
                </h3>
                <p className="text-xs text-[#d6c4a8] leading-relaxed italic">
                  "{activeEntry.lore}"
                </p>
              </div>

              {/* Fraquezas e Táticas em Destaque */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-950/25 border border-amber-700/50 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Pontos Fracos
                  </h4>
                  <p className="text-xs text-amber-100/90 leading-relaxed">
                    {activeEntry.weakness}
                  </p>
                </div>

                <div className="bg-[#1b1318] border border-[#683040] rounded-xl p-4">
                  <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    Resistências & Perigos
                  </h4>
                  <p className="text-xs text-rose-100/90 leading-relaxed">
                    {activeEntry.resistance}
                  </p>
                </div>
              </div>

              {/* Dica Tática de Combate */}
              <div className="bg-[#121915] border border-emerald-800/50 rounded-xl p-4">
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Conselho Tático de Sire Alaric
                </h4>
                <p className="text-xs text-emerald-100/80 leading-relaxed">
                  {activeEntry.tacticalTip}
                </p>
              </div>

              {/* Tabela de Espólios e Saques */}
              <div>
                <span className="text-[11px] font-bold uppercase text-[#a88636] tracking-wider block mb-2">
                  Tabela de Espólios Notáveis
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {activeEntry.possibleDrops.map((drop, idx) => (
                    <div
                      key={idx}
                      className="bg-[#120f0b] border border-[#3d3119] rounded-lg p-2.5 text-center"
                    >
                      <span className="text-xl block mb-1">{drop.icon}</span>
                      <div className="text-[11px] font-semibold text-[#f3d484] truncate">{drop.name}</div>
                      <div className="text-[10px] text-[#a88636] font-mono">Chance: {drop.chance}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botão de Duelo Direto na Arena */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    sounds.playSwordClash();
                    const monsterData = INITIAL_ENEMIES[activeEntry.enemyId] || INITIAL_ENEMIES.shadow_chimera;
                    onChallengeEnemy({ ...monsterData });
                  }}
                  className="w-full py-3 bg-gradient-to-r from-[#9e7417] via-[#c59b27] to-[#e2ba58] text-black font-extrabold text-xs sm:text-sm rounded-xl shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Swords className="w-4 h-4" />
                  <span>Desafiar {activeEntry.name} no Campo de Batalha</span>
                </button>
              </div>
            </div>
          ) : (
            /* Estado Bloqueado / Criatura Não Derrotada */
            <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-20 h-20 rounded-full bg-[#120f0b] border-2 border-dashed border-[#5a482b] flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-[#8c7b64]" />
              </div>

              <span className="text-xs uppercase font-bold tracking-widest text-[#a88636]">
                Registro Oculto no Códice
              </span>
              <h3 className="text-xl font-bold text-[#ede4d1] mt-1 mb-2 font-cinzel">
                Besta Ainda Não Derrotada
              </h3>
              <p className="text-xs text-[#bdae93] max-w-md leading-relaxed mb-6">
                Sire Alaric ainda não subjugou esta criatura em combate. Encontre-a através das expedições no <span className="text-[#f3d484] font-medium">Diário de Missões</span> ou inicie um confronto na <span className="text-[#f3d484] font-medium">Arena de Batalha</span> para desbloquear seus pontos fracos e espólios.
              </p>

              <button
                onClick={() => {
                  sounds.playSwordClash();
                  const monsterData = INITIAL_ENEMIES[activeEntry.enemyId] || INITIAL_ENEMIES.shadow_chimera;
                  onChallengeEnemy({ ...monsterData });
                }}
                className="px-5 py-2.5 bg-[#251e14] hover:bg-[#382d1b] border border-[#8e6e23] text-[#f3d484] font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow"
              >
                <Swords className="w-4 h-4" />
                <span>Iniciar Caçada Agora</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
