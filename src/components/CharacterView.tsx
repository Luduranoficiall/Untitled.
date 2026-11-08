import React from 'react';
import { Character, EquipmentSlots, Item } from '../types/game';
import { SireAlaricPortrait } from './Artwork';
import { Shield, Sparkles, Heart, Zap, Crosshair, BookOpen, AlertCircle, ArrowUpCircle } from 'lucide-react';
import { sounds } from '../utils/audio';

interface CharacterViewProps {
  character: Character;
  onUseItem: (item: Item) => void;
  onOpenLevelUp: () => void;
  onNavigateToTab: (tab: 'quests' | 'battle' | 'bazaar' | 'inventory') => void;
}

export const CharacterView: React.FC<CharacterViewProps> = ({
  character,
  onUseItem,
  onOpenLevelUp,
  onNavigateToTab,
}) => {
  const hpPercent = Math.min(100, Math.max(0, (character.hp / character.maxHp) * 100));
  const mpPercent = Math.min(100, Math.max(0, (character.mp / character.maxMp) * 100));
  const expPercent = Math.min(100, Math.max(0, (character.exp / character.expNext) * 100));

  const healingPotionInInventory = character.inventory.find(
    (i) => i.consumableEffect?.healHp || i.consumableEffect?.cureBleed
  );

  return (
    <div className="space-y-6">
      {/* Banner de Estado Crítico se houver Hemorragia ou HP baixo */}
      {(character.conditions.length > 0 || character.hp < character.maxHp * 0.3) && (
        <div className="bg-red-950/60 border border-red-700/80 rounded-lg p-4 shadow-[0_0_15px_rgba(220,38,38,0.25)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
            <div>
              <div className="font-semibold text-red-200 text-sm tracking-wide flex items-center gap-2">
                <span>ESTADO CRÍTICO: {character.conditions.map((c) => c.name).join(', ') || 'Vida Crítica'}</span>
              </div>
              <p className="text-xs text-red-300/80 mt-0.5">
                {character.conditions[0]?.description || 'Sire Alaric necessita de cuidados médicos urgentes.'}
              </p>
            </div>
          </div>
          {healingPotionInInventory && (
            <button
              onClick={() => {
                sounds.playHealSpell();
                onUseItem(healingPotionInInventory);
              }}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-medium text-xs rounded-md shadow-md transition-all active:scale-95 shrink-0 whitespace-nowrap"
            >
              Usar {healingPotionInInventory.name}
            </button>
          )}
        </div>
      )}

      {/* Hero Card / Perfil Principal */}
      <div className="bg-[#18140f] border border-[#785b20] rounded-xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.7)] relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#c59b27]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          <div className="relative group">
            <SireAlaricPortrait size="lg" />
            {character.statPoints > 0 && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenLevelUp();
                }}
                className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold text-xs rounded-full shadow-lg border border-yellow-200 flex items-center gap-1 hover:scale-105 transition-transform whitespace-nowrap"
              >
                <ArrowUpCircle className="w-3.5 h-3.5" />
                <span>+ {character.statPoints} Pontos</span>
              </button>
            )}
          </div>

          <div className="flex-1 w-full text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#3d3119] pb-3">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#a88636] font-semibold">Perfil do Personagem</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f3d484] tracking-tight">
                  {character.name}
                </h1>
                <p className="text-xs sm:text-sm text-[#bdae93]">
                  {character.title} · <span className="text-[#e2ba58] font-medium">{character.race} {character.characterClass}</span>
                </p>
              </div>

              <div className="flex items-center justify-center md:justify-end gap-3 shrink-0">
                <div className="px-3 py-1 bg-[#282014] border border-[#8e6e23] rounded-lg text-center">
                  <div className="text-[10px] uppercase text-[#a88636]">Nível</div>
                  <div className="text-lg font-black text-[#f3d484] tabular-nums font-cinzel">
                    {character.level}
                  </div>
                </div>
                {character.statPoints > 0 && (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onOpenLevelUp();
                    }}
                    className="px-3 py-2 bg-[#8c671b] hover:bg-[#a87c22] text-amber-100 text-xs font-semibold rounded-lg border border-amber-400/50 shadow transition-all"
                  >
                    Evoluir Ficha
                  </button>
                )}
              </div>
            </div>

            {/* Barras de Status Vitais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {/* Vida (HP) */}
              <div className="bg-[#120f0b] p-3 rounded-lg border border-[#3d3119]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-red-400 font-semibold flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/30" />
                    Pontos de Vida
                  </span>
                  <span className="font-mono text-xs tabular-nums text-red-200">
                    {character.hp} / {character.maxHp}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#201515] rounded-full overflow-hidden border border-red-950">
                  <div
                    className="h-full bg-gradient-to-r from-red-700 via-red-600 to-amber-500 transition-all duration-300"
                    style={{ width: `${hpPercent}%` }}
                  />
                </div>
              </div>

              {/* Mana (MP) */}
              <div className="bg-[#120f0b] p-3 rounded-lg border border-[#3d3119]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-blue-400 font-semibold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400/30" />
                    Mana Sagrada
                  </span>
                  <span className="font-mono text-xs tabular-nums text-blue-200">
                    {character.mp} / {character.maxMp}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#121c2c] rounded-full overflow-hidden border border-blue-950">
                  <div
                    className="h-full bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${mpPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Barra de Experiência */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-[#a88636] mb-1">
                <span>Progresso para o Nível {character.level + 1}</span>
                <span className="tabular-nums font-mono text-[#e2ba58]">
                  {character.exp} / {character.expNext} XP ({Math.round(expPercent)}%)
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#201b13] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#8c671b] to-[#f3d484] transition-all duration-500"
                  style={{ width: `${expPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid com Atributos e Equipamentos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Atributos Clássicos D&D */}
        <div className="lg:col-span-1 bg-[#18140f] border border-[#785b20] rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#3d3119] mb-4">
            <h2 className="text-lg font-bold text-[#f3d484] flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-[#c59b27]" />
              Atributos de Combate
            </h2>
            {character.statPoints > 0 && (
              <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded border border-amber-500/40 font-mono">
                +{character.statPoints} livres
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'str', label: 'Força', value: character.attributes.str, desc: 'Dano físico e impacto' },
              { key: 'dex', label: 'Destreza', value: character.attributes.dex, desc: 'Esquiva e agilidade' },
              { key: 'con', label: 'Constituição', value: character.attributes.con, desc: 'Vida máxima e vigor' },
              { key: 'int', label: 'Inteligência', value: character.attributes.int, desc: 'Conhecimento tático' },
              { key: 'wis', label: 'Sabedoria', value: character.attributes.wis, desc: 'Poder de cura divina' },
              { key: 'cha', label: 'Carisma', value: character.attributes.cha, desc: 'Desconto em lojas e moral' },
            ].map((attr) => (
              <div key={attr.key} className="bg-[#120f0b] border border-[#3d3119] rounded-lg p-3 text-center hover:border-[#8e6e23] transition-colors">
                <span className="text-[11px] text-[#a88636] uppercase font-semibold block">{attr.label}</span>
                <span className="text-xl font-bold text-[#f3d484] font-cinzel tabular-nums my-0.5 block">
                  {attr.value}
                </span>
                <span className="text-[10px] text-[#8c7b64] leading-tight block">{attr.desc}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-[#3d3119]">
            <button
              onClick={() => {
                sounds.playClick();
                onOpenLevelUp();
              }}
              className="w-full py-2 bg-[#2a2215] hover:bg-[#3d3119] text-[#e2ba58] border border-[#8e6e23] rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Distribuir Pontos de Atributos
            </button>
          </div>
        </div>

        {/* Equipamentos Atuais */}
        <div className="lg:col-span-2 bg-[#18140f] border border-[#785b20] rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#3d3119] mb-4">
            <h2 className="text-lg font-bold text-[#f3d484] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#c59b27]" />
              Equipamentos Sagrados em Uso
            </h2>
            <button
              onClick={() => {
                sounds.playClick();
                onNavigateToTab('inventory');
              }}
              className="text-xs text-[#e2ba58] hover:text-[#f3d484] hover:underline"
            >
              Abrir Mochila ({character.inventory.length} itens) →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { slotName: 'Arma Principal', item: character.equipment.weapon, slotKey: 'weapon' as keyof EquipmentSlots },
              { slotName: 'Armadura Peitoral', item: character.equipment.armor, slotKey: 'armor' as keyof EquipmentSlots },
              { slotName: 'Elmo de Batalha', item: character.equipment.helmet, slotKey: 'helmet' as keyof EquipmentSlots },
              { slotName: 'Botas de Ferro', item: character.equipment.boots, slotKey: 'boots' as keyof EquipmentSlots },
              { slotName: 'Acessório / Dragona', item: character.equipment.accessory, slotKey: 'accessory' as keyof EquipmentSlots },
              { slotName: 'Luvas / Braçadeiras', item: character.equipment.gloves, slotKey: 'gloves' as keyof EquipmentSlots },
            ].map(({ slotName, item }) => (
              <div
                key={slotName}
                className="bg-[#120f0b] border border-[#3d3119] rounded-lg p-3 flex items-start gap-3 hover:border-[#8e6e23] transition-colors"
              >
                <div className="w-10 h-10 rounded-md bg-[#221b12] border border-[#68501c] flex items-center justify-center text-lg shrink-0">
                  {item ? item.icon : '▫️'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase text-[#a88636] font-medium">{slotName}</div>
                  <div className="text-xs font-bold text-[#ede4d1] truncate">
                    {item ? item.name : <span className="text-[#6d5e49] italic">Slot Desocupado</span>}
                  </div>
                  {item && (
                    <div className="text-[11px] text-[#e2ba58] mt-0.5 truncate">
                      {item.stats?.attack && <span>+{item.stats.attack} Ataque </span>}
                      {item.stats?.defense && <span>+{item.stats.defense} Defesa </span>}
                      {item.stats?.str && <span>+{item.stats.str} FOR </span>}
                      {item.stats?.con && <span>+{item.stats.con} CON </span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Biografia Histórica */}
          <div className="mt-5 p-4 bg-[#120f0b] border border-[#3d3119] rounded-lg">
            <h3 className="text-xs font-semibold text-[#a88636] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Crônica & Histórico de Sire Alaric
            </h3>
            <p className="text-xs text-[#c4b59d] leading-relaxed italic">
              "{character.biography}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
