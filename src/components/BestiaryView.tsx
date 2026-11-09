import React, { useState, useMemo } from 'react';
import { BestiaryEntry, Enemy } from '../types/game';
import { BESTIARY_DATA } from '../data/bestiaryData';
import { INITIAL_ENEMIES } from '../data/initialData';
import { EnemyArtwork } from './Artwork';
import {
  BookOpen,
  Skull,
  ShieldAlert,
  Zap,
  Swords,
  CheckCircle2,
  ChevronRight,
  Compass,
  Flame,
  Sun,
  Sparkles,
  Trophy,
  Shield,
  BarChart3,
  Award,
  AlertTriangle,
  History,
  Filter,
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface BestiaryViewProps {
  killsRecord: Record<string, number>;
  onChallengeEnemy: (enemy: Enemy) => void;
}

type DetailTab = 'weaknesses' | 'lore' | 'history' | 'drops';

export const BestiaryView: React.FC<BestiaryViewProps> = ({
  killsRecord,
  onChallengeEnemy,
}) => {
  const allEntries = useMemo(() => Object.values(BESTIARY_DATA), []);
  const [selectedEnemyId, setSelectedEnemyId] = useState<string>(allEntries[0]?.enemyId || 'shadow_chimera');
  const [activeDetailTab, setActiveDetailTab] = useState<DetailTab>('weaknesses');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const totalDiscovered = allEntries.filter((e) => (killsRecord[e.enemyId] || 0) > 0).length;
  const totalKills = Object.values(killsRecord).reduce((acc, k) => acc + k, 0);

  const activeEntry: BestiaryEntry = BESTIARY_DATA[selectedEnemyId] || allEntries[0];
  const activeEnemyData: Enemy = INITIAL_ENEMIES[activeEntry.enemyId] || INITIAL_ENEMIES.shadow_chimera;
  const killsCount = killsRecord[activeEntry.enemyId] || 0;
  const isDefeatedAtLeastOnce = killsCount > 0;

  // Filtragem da lista
  const filteredEntries = useMemo(() => {
    if (categoryFilter === 'all') return allEntries;
    if (categoryFilter === 'defeated') return allEntries.filter((e) => (killsRecord[e.enemyId] || 0) > 0);
    if (categoryFilter === 'undefeated') return allEntries.filter((e) => (killsRecord[e.enemyId] || 0) === 0);
    return allEntries.filter((e) => e.category === categoryFilter);
  }, [allEntries, categoryFilter, killsRecord]);

  // Cálculo da patente de caça da espécie com base no bestiaryKills
  const masteryRank = useMemo(() => {
    if (killsCount === 0) {
      return {
        title: 'Alvo Não Neutralizado',
        badgeColor: 'bg-zinc-900 border-zinc-700 text-zinc-400',
        description: 'Sire Alaric ainda não subjugou esta criatura em combate. Seus segredos foram deduzidos através de escrituras antigas da Ordem.',
        icon: '⚔️',
        progressPercent: 0,
        nextGoal: 'Derrote 1 vez para validar o primeiro triunfo.',
      };
    }
    if (killsCount >= 1 && killsCount <= 2) {
      return {
        title: 'Iniciado da Ordem · Primeira Sangria',
        badgeColor: 'bg-amber-950/70 border-amber-600/60 text-amber-300',
        description: 'Você sobreviveu aos primeiros encontros e comprovou a eficácia das fraquezas elementares na prática.',
        icon: '🛡️',
        progressPercent: 35,
        nextGoal: 'Alcance 3 abates para obter a patente de Caçador Veterano.',
      };
    }
    if (killsCount >= 3 && killsCount <= 5) {
      return {
        title: 'Caçador Veterano de Solis',
        badgeColor: 'bg-rose-950/70 border-rose-600/70 text-rose-300',
        description: 'Os padrões desta besta não guardam mais mistérios. A lâmina de Sire Alaric corta seus pontos fracos com precisão letal.',
        icon: '⚔️',
        progressPercent: 70,
        nextGoal: 'Alcance 6 abates para ser proclamado Flagelo Supremo da Espécie.',
      };
    }
    return {
      title: 'Flagelo Supremo · Mestre Algoz',
      badgeColor: 'bg-gradient-to-r from-red-950 via-[#3a080d] to-amber-950 border-amber-500 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
      description: 'Esta espécie teme a sua presença. Você domina absolutamente todas as resistências e vulnerabilidades anatômicas deste monstro.',
      icon: '👑',
      progressPercent: 100,
      nextGoal: 'Domínio máximo de extermínio conquistado nos ermos de Solis!',
    };
  }, [killsCount]);

  // Total acumulado pilhado daquela espécie
  const accumulatedLoot = useMemo(() => {
    return {
      gold: killsCount * activeEnemyData.lootGold,
      gems: killsCount * activeEnemyData.lootGems,
      exp: killsCount * activeEnemyData.lootExp,
    };
  }, [killsCount, activeEnemyData]);

  return (
    <div className="space-y-6">
      {/* Header do Códice de Bestas */}
      <div className="bg-[#18140f] border border-[#785b20] rounded-xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.7)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#a88636] font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Tomo de Registro da Ordem Dourada
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f3d484] flex items-center gap-2.5 font-cinzel">
            <BookOpen className="w-6 h-6 text-[#c59b27]" />
            Bestiário de Solis
          </h1>
          <p className="text-xs sm:text-sm text-[#bdae93] mt-0.5">
            Dossiê de fraquezas elementares, resistências anatômicas e histórico de abates por espécie salvos no códice.
          </p>
        </div>

        {/* Resumo de Descobertas */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="px-3.5 py-1.5 bg-[#201910] border border-[#8e6e23] rounded-lg text-center">
            <div className="text-[10px] uppercase text-[#a88636]">Registros Vencidos</div>
            <div className="text-sm font-bold text-amber-300 font-mono tabular-nums">
              {totalDiscovered} / {allEntries.length} Espécies
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

      {/* Grid Principal: Lista de Inimigos + Painel de Detalhes Expandido */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1: Lista e Filtros de Inimigos */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#a88636]">
              Ameaças Catalogadas
            </span>
            <span className="text-[10px] text-[#8c7b64] font-mono">
              {filteredEntries.length} de {allEntries.length}
            </span>
          </div>

          {/* Filtros de Categoria */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'defeated', label: 'Derrotados' },
              { id: 'undefeated', label: 'Não Vencidos' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  sounds.playClick();
                  setCategoryFilter(f.id);
                }}
                className={`px-2.5 py-1 rounded-lg border transition-all shrink-0 font-medium ${
                  categoryFilter === f.id
                    ? 'bg-[#292013] border-[#c59b27] text-[#f3d484] shadow-sm font-bold'
                    : 'bg-[#14120e] border-[#3d3119] text-[#8c7b64] hover:text-[#bdae93]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Lista de Cards de Inimigos */}
          <div className="space-y-2">
            {filteredEntries.map((entry) => {
              const kills = killsRecord[entry.enemyId] || 0;
              const isSelected = selectedEnemyId === entry.enemyId;
              const hasDefeated = kills > 0;

              return (
                <div
                  key={entry.enemyId}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedEnemyId(entry.enemyId);
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 group relative overflow-hidden ${
                    isSelected
                      ? 'border-[#c59b27] bg-[#221c14] shadow-[0_0_20px_rgba(197,155,39,0.25)]'
                      : 'border-[#3d3119] bg-[#18140f] hover:border-[#785b20] hover:bg-[#1d1711]'
                  }`}
                >
                  {/* Avatar do Monstro com Borda */}
                  <div className={`w-12 h-12 rounded-lg border flex items-center justify-center shrink-0 relative overflow-hidden transition-all ${
                    hasDefeated
                      ? 'border-[#8e6e23] bg-[#120f0b] shadow-inner'
                      : 'border-zinc-800 bg-[#0e0c09] opacity-80'
                  }`}>
                    <EnemyArtwork enemyId={entry.enemyId} className="w-full h-full border-none" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] uppercase font-bold text-[#a88636] truncate">
                        {entry.category}
                      </span>
                      {hasDefeated ? (
                        <span className="text-[10px] text-amber-300 font-mono flex items-center gap-1 font-bold px-1.5 py-0.2 rounded bg-amber-950/60 border border-amber-600/50">
                          <Skull className="w-3 h-3 text-red-400" />
                          {kills}x Abates
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-500 font-mono px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800">
                          0 Abates
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold truncate text-[#f3d484] group-hover:text-amber-200 transition-colors">
                      {entry.name}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-[#8c7b64] mt-0.5">
                      <span className="truncate">{entry.location}</span>
                      <span className="font-mono text-[#a88636] font-bold text-[10px] ml-1">
                        Nv. {entry.stats.level}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-[#c59b27] translate-x-1' : 'text-[#5a482b]'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Coluna 2 e 3: Painel de Detalhes Expandido do Monstro */}
        <div className="lg:col-span-2 bg-[#18140f] border border-[#785b20] rounded-xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header do Monstro com Arte e Badges de Status */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-5 border-b border-[#3d3119]">
              <div className="relative shrink-0">
                <EnemyArtwork enemyId={activeEntry.enemyId} className="w-28 h-28 sm:w-36 sm:h-36 shadow-lg rounded-xl" />
                {isDefeatedAtLeastOnce && (
                  <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-amber-950 border border-amber-500 text-[10px] font-mono font-bold text-amber-200 shadow-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Conhecido</span>
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 bg-[#251e14] border border-[#8e6e23] rounded text-[10px] uppercase font-bold text-[#a88636]">
                    {activeEntry.category}
                  </span>
                  <span className="px-2.5 py-0.5 bg-red-950/60 border border-red-700/60 rounded text-[10px] font-bold text-red-300 font-mono">
                    Nível de Ameaça: {activeEntry.stats.level}
                  </span>
                  {activeEntry.dangerLevel && (
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                      activeEntry.dangerLevel === 'Letal'
                        ? 'bg-rose-950 border-rose-600 text-rose-300'
                        : activeEntry.dangerLevel === 'Severa'
                        ? 'bg-amber-950 border-amber-600 text-amber-300'
                        : 'bg-emerald-950 border-emerald-600 text-emerald-300'
                    }`}>
                      Perigo: {activeEntry.dangerLevel}
                    </span>
                  )}
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono border flex items-center gap-1 ${
                    killsCount > 0
                      ? 'bg-amber-950/60 border-amber-500/70 text-amber-300'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-400'
                  }`}>
                    <Skull className="w-3 h-3 text-red-400" />
                    {killsCount} Derrota{killsCount === 1 ? '' : 's'} Registrada{killsCount === 1 ? '' : 's'}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-[#f3d484] font-cinzel">
                  {activeEntry.name}
                </h2>
                <p className="text-xs text-[#bdae93] mb-2">{activeEntry.title}</p>
                <p className="text-xs text-[#a88636] flex items-center justify-center sm:justify-start gap-1">
                  <Compass className="w-3.5 h-3.5 text-[#c59b27]" />
                  <span>Habitat Conhecido: {activeEntry.location}</span>
                </p>
              </div>
            </div>

            {/* Abas de Navegação Interna do Dossiê */}
            <div className="flex items-center gap-2 border-b border-[#3d3119] pb-2 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveDetailTab('weaknesses');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                  activeDetailTab === 'weaknesses'
                    ? 'bg-[#2b2214] border border-[#c59b27] text-[#f3d484] shadow-sm font-bold'
                    : 'text-[#8c7b64] hover:text-[#bdae93] hover:bg-[#1b1712]'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Fraquezas & Resistências</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveDetailTab('history');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                  activeDetailTab === 'history'
                    ? 'bg-[#2b2214] border border-[#c59b27] text-[#f3d484] shadow-sm font-bold'
                    : 'text-[#8c7b64] hover:text-[#bdae93] hover:bg-[#1b1712]'
                }`}
              >
                <History className="w-3.5 h-3.5 text-red-400" />
                <span>Histórico de Derrotas ({killsCount})</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveDetailTab('lore');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                  activeDetailTab === 'lore'
                    ? 'bg-[#2b2214] border border-[#c59b27] text-[#f3d484] shadow-sm font-bold'
                    : 'text-[#8c7b64] hover:text-[#bdae93] hover:bg-[#1b1712]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#c59b27]" />
                <span>Dossiê & Lore</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveDetailTab('drops');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                  activeDetailTab === 'drops'
                    ? 'bg-[#2b2214] border border-[#c59b27] text-[#f3d484] shadow-sm font-bold'
                    : 'text-[#8c7b64] hover:text-[#bdae93] hover:bg-[#1b1712]'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-yellow-400" />
                <span>Tabela de Espólios</span>
              </button>
            </div>

            {/* ABA 1: MATRIZ DE FRAQUEZAS E RESISTÊNCIAS ELEMENTARES */}
            {activeDetailTab === 'weaknesses' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Alerta de Destaque */}
                <div className="p-3 rounded-lg bg-[#22180f] border border-[#785b20] flex items-start gap-2.5 text-xs text-[#ede4d1]">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#f3d484]">Análise de Combate Elemental: </span>
                    Explorar as fraquezas abaixo aumenta expressivamente o dano de Sire Alaric e a penetração de armadura. Evite ataques nas categorias com resistências elevadas.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fraquezas Elementares */}
                  <div className="bg-amber-950/20 border border-amber-600/50 rounded-xl p-4 space-y-3">
                    <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-amber-800/40 pb-2">
                      <Sun className="w-4 h-4 text-amber-400" />
                      Fraquezas & Vulnerabilidades
                    </h3>

                    {activeEntry.elementalWeaknesses && activeEntry.elementalWeaknesses.length > 0 ? (
                      <div className="space-y-2.5">
                        {activeEntry.elementalWeaknesses.map((weak, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-lg bg-[#1a140d] border border-amber-700/40 flex items-start justify-between gap-3"
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-base select-none">{weak.icon}</span>
                              <div>
                                <span className="text-xs font-bold text-amber-200 block">
                                  {weak.label}
                                </span>
                                <p className="text-[11px] text-[#cfbe9e] leading-snug mt-0.5">
                                  {weak.description}
                                </p>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/70 text-emerald-300 font-mono text-[11px] font-extrabold shrink-0">
                              {weak.multiplier}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-amber-100/90 leading-relaxed">
                        {activeEntry.weakness}
                      </p>
                    )}
                  </div>

                  {/* Resistências e Imunidades */}
                  <div className="bg-[#1b1318]/70 border border-[#783040]/60 rounded-xl p-4 space-y-3">
                    <h3 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-rose-900/40 pb-2">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      Resistências & Imunidades
                    </h3>

                    {activeEntry.elementalResistances && activeEntry.elementalResistances.length > 0 ? (
                      <div className="space-y-2.5">
                        {activeEntry.elementalResistances.map((res, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-lg bg-[#140c10] border border-rose-800/40 flex items-start justify-between gap-3"
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-base select-none">{res.icon}</span>
                              <div>
                                <span className="text-xs font-bold text-rose-200 block">
                                  {res.label}
                                </span>
                                <p className="text-[11px] text-[#d6b0b8] leading-snug mt-0.5">
                                  {res.description}
                                </p>
                              </div>
                            </div>
                            <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-extrabold shrink-0 border ${
                              res.multiplier === 'Imune'
                                ? 'bg-red-950 border-red-500 text-red-200'
                                : 'bg-rose-950/80 border-rose-600/70 text-rose-300'
                            }`}>
                              {res.multiplier}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-rose-100/90 leading-relaxed">
                        {activeEntry.resistance}
                      </p>
                    )}
                  </div>
                </div>

                {/* Arma Recomendada e Conselho Tático */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {activeEntry.recommendedWeaponType && (
                    <div className="bg-[#14120e] border border-[#523e1b] rounded-xl p-3.5 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-950/60 border border-amber-600/60 flex items-center justify-center shrink-0 text-amber-300">
                        <Swords className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#a88636] block">
                          Armamento Tático Recomendado
                        </span>
                        <span className="text-xs font-bold text-[#f3d484]">
                          {activeEntry.recommendedWeaponType}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="bg-[#121915] border border-emerald-800/60 rounded-xl p-3.5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-600/60 flex items-center justify-center shrink-0 text-emerald-300">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                        Dica Tática de Campo
                      </span>
                      <p className="text-xs text-emerald-100/90 line-clamp-2">
                        {activeEntry.tacticalTip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 2: HISTÓRICO DE DERROTAS DA ESPÉCIE (bestiaryKills) */}
            {activeDetailTab === 'history' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Placa Principal de Maestria de Abates */}
                <div className="bg-gradient-to-r from-[#21160e] via-[#1a110a] to-[#251010] border-2 border-[#8e6e23] rounded-xl p-5 shadow-lg relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-black/50 border-2 border-[#c59b27] flex flex-col items-center justify-center shadow-inner">
                        <Skull className="w-6 h-6 text-red-500 mb-0.5" />
                        <span className="text-lg font-black font-mono text-amber-300 tabular-nums">
                          {killsCount}x
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 ${masteryRank.badgeColor}`}>
                            <span>{masteryRank.icon}</span>
                            <span>{masteryRank.title}</span>
                          </span>
                        </div>
                        <p className="text-xs text-[#d6c4a8] max-w-md leading-relaxed">
                          {masteryRank.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-center sm:text-right shrink-0">
                      <span className="text-[10px] uppercase text-[#a88636] block">Status no Reino</span>
                      <span className={`text-xs font-extrabold uppercase tracking-wider ${
                        killsCount > 0 ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {killsCount > 0 ? '✓ Ameaça Contida' : '⚠️ Ameaça à Solta'}
                      </span>
                    </div>
                  </div>

                  {/* Barra de Progresso de Maestria */}
                  <div className="mt-4 pt-3 border-t border-[#3d3119]/80">
                    <div className="flex justify-between text-[11px] mb-1 font-mono">
                      <span className="text-[#a88636]">Maestria de Caçada</span>
                      <span className="text-amber-300 font-bold">{masteryRank.progressPercent}%</span>
                    </div>
                    <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-[#523e1b]">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-300 transition-all duration-500"
                        style={{ width: `${masteryRank.progressPercent}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-[#8c7b64] mt-1.5 italic">
                      {masteryRank.nextGoal}
                    </p>
                  </div>
                </div>

                {/* Estatísticas Acumuladas da Espécie (Espólios Pilhados nos Abates) */}
                <div>
                  <span className="text-xs font-bold uppercase text-[#a88636] tracking-wider block mb-2">
                    Recursos e Espólios Acumulados Nesta Espécie
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-[#120f0b] border border-[#3d3119] rounded-xl p-3.5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-600/60 flex items-center justify-center text-xl shrink-0">
                        🪙
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-[#a88636] block">Ouro Conquistado</span>
                        <span className="text-base font-extrabold text-amber-300 font-mono tabular-nums">
                          {accumulatedLoot.gold.toLocaleString('pt-BR')} PO
                        </span>
                        <span className="text-[9px] text-[#78644e] block">
                          ({activeEnemyData.lootGold} por vitória)
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#120f0b] border border-[#3d3119] rounded-xl p-3.5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-600/60 flex items-center justify-center text-xl shrink-0">
                        💎
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-cyan-400 block">Gemas Purificadas</span>
                        <span className="text-base font-extrabold text-cyan-300 font-mono tabular-nums">
                          {accumulatedLoot.gems.toLocaleString('pt-BR')} Gemas
                        </span>
                        <span className="text-[9px] text-[#78644e] block">
                          ({activeEnemyData.lootGems} por vitória)
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#120f0b] border border-[#3d3119] rounded-xl p-3.5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-950/60 border border-purple-600/60 flex items-center justify-center text-xl shrink-0">
                        ✨
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-purple-400 block">Experiência Obtida</span>
                        <span className="text-base font-extrabold text-purple-300 font-mono tabular-nums">
                          {accumulatedLoot.exp.toLocaleString('pt-BR')} EXP
                        </span>
                        <span className="text-[9px] text-[#78644e] block">
                          ({activeEnemyData.lootExp} por vitória)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline / Registro de Bravura */}
                <div className="bg-[#14120e] border border-[#3d3119] rounded-xl p-4">
                  <h4 className="text-xs font-bold text-[#f3d484] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-[#c59b27]" />
                    Registro Canônico de Abates
                  </h4>
                  {killsCount > 0 ? (
                    <div className="space-y-2 text-xs text-[#bdae93]">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400">✓</span>
                        <span>Primeiro abate confirmado registrado nos anais da Ordem Dourada.</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400">✓</span>
                        <span>Fraquezas e pontos vitais da espécie devidamente testados e validados por Sire Alaric.</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400">✦</span>
                        <span>Total de {killsCount} espécimes eliminados com honra militar nos arredores de Solis.</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#8c7b64] italic">
                      Nenhum abate registrado ainda para {activeEntry.name}. Confronte esta criatura na Arena ou através do Diário de Missões para gravar seu triunfo na história de Solis.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ABA 3: DOSSIÊ & LORE */}
            {activeDetailTab === 'lore' && (
              <div className="space-y-4 animate-in fade-in duration-200">
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

                {/* Lore Histórico */}
                <div className="bg-[#120f0b] border border-[#3d3119] rounded-xl p-4">
                  <h3 className="text-xs font-bold uppercase text-[#a88636] tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#c59b27]" />
                    Registro Histórico e Origem Canônica
                  </h3>
                  <p className="text-xs sm:text-sm text-[#d6c4a8] leading-relaxed italic">
                    "{activeEntry.lore}"
                  </p>
                </div>

                {/* Golpe Especial do Monstro */}
                <div className="bg-[#181114] border border-[#5c2433] rounded-xl p-4 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-950/70 border border-red-600/70 flex items-center justify-center shrink-0 text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-red-400 block">
                      Golpe Especial da Espécie
                    </span>
                    <h4 className="text-xs font-bold text-[#f3d484] mb-0.5">
                      {activeEnemyData.specialMove.name} (Multiplicador de {activeEnemyData.specialMove.damageMultiplier}x)
                    </h4>
                    <p className="text-xs text-[#cfb0b8] leading-snug">
                      {activeEnemyData.specialMove.flavorText}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 4: TABELA DE ESPÓLIOS E DROPS */}
            {activeDetailTab === 'drops' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-3 rounded-lg bg-[#22180f] border border-[#785b20] flex items-center justify-between text-xs text-[#ede4d1]">
                  <span>Saques garantidos e relíquias raras obtidas ao derrotar {activeEntry.name}:</span>
                  <span className="text-amber-300 font-bold font-mono">
                    {activeEntry.possibleDrops.length} Itens Catalogados
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {activeEntry.possibleDrops.map((drop, idx) => (
                    <div
                      key={idx}
                      className="bg-[#120f0b] border border-[#3d3119] hover:border-[#8e6e23] transition-colors rounded-xl p-3.5 text-center flex flex-col items-center justify-between shadow"
                    >
                      <span className="text-2xl block mb-1.5 select-none">{drop.icon}</span>
                      <div className="text-xs font-bold text-[#f3d484] line-clamp-2 mb-1">
                        {drop.name}
                      </div>
                      <div className="px-2 py-0.5 rounded bg-black/60 border border-[#523e1b] text-[10px] text-amber-300 font-mono font-bold">
                        Chance: {drop.chance}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Botão de Duelo Direto na Arena */}
          <div className="pt-6 border-t border-[#3d3119]/80 mt-6">
            <button
              onClick={() => {
                sounds.playSwordClash();
                onChallengeEnemy({ ...activeEnemyData });
              }}
              className="w-full py-3.5 bg-gradient-to-r from-[#9e7417] via-[#c59b27] to-[#e2ba58] hover:from-[#b5871f] hover:to-[#f0c968] text-black font-extrabold text-xs sm:text-sm rounded-xl shadow-[0_0_25px_rgba(197,155,39,0.35)] active:scale-98 transition-all flex items-center justify-center gap-2.5 font-cinzel tracking-wider"
            >
              <Swords className="w-4 h-4" />
              <span>Desafiar {activeEntry.name} no Campo de Batalha</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
