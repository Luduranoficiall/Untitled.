import React, { useState } from 'react';
import { Character, EquipmentSlots, Item } from '../types/game';
import { Backpack, Shield, Swords, Sparkles, Check, Trash2, ArrowUpRight } from 'lucide-react';
import { sounds } from '../utils/audio';

interface InventoryViewProps {
  character: Character;
  onEquipItem: (item: Item, inventoryIndex: number) => void;
  onUnequipItem: (slot: keyof EquipmentSlots) => void;
  onUseItem: (item: Item, inventoryIndex?: number) => void;
  onDiscardItem: (index: number) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  character,
  onEquipItem,
  onUnequipItem,
  onUseItem,
  onDiscardItem,
}) => {
  const [selectedItem, setSelectedItem] = useState<{ item: Item; index?: number } | null>(
    character.inventory[0] ? { item: character.inventory[0], index: 0 } : null
  );

  // Cálculo de bônus totais de equipamentos
  const totalEquipAtk = Object.values(character.equipment).reduce(
    (acc, item) => acc + (item?.stats?.attack || 0),
    0
  );
  const totalEquipDef = Object.values(character.equipment).reduce(
    (acc, item) => acc + (item?.stats?.defense || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header do Inventário */}
      <div className="bg-[#18140f] border border-[#785b20] rounded-xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.7)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#a88636] font-semibold">Armaria de Campanha</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f3d484] flex items-center gap-2.5">
            <Backpack className="w-6 h-6 text-[#c59b27]" />
            Inventário & Equipamento
          </h1>
          <p className="text-xs sm:text-sm text-[#bdae93] mt-0.5">
            Gerencie armaduras sagradas, lâminas forjadas e elixires do inventário de Sire Alaric.
          </p>
        </div>

        {/* Resumo de Combate dos Itens */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-1.5 bg-[#201910] border border-[#8e6e23] rounded-lg text-center">
            <div className="text-[10px] uppercase text-[#a88636]">Bônus Ataque</div>
            <div className="text-base font-bold text-amber-300 font-mono tabular-nums">
              +{totalEquipAtk} ATQ
            </div>
          </div>
          <div className="px-3 py-1.5 bg-[#152019] border border-emerald-700/60 rounded-lg text-center">
            <div className="text-[10px] uppercase text-emerald-400/80">Bônus Defesa</div>
            <div className="text-base font-bold text-emerald-300 font-mono tabular-nums">
              +{totalEquipDef} DEF
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel de Equipamentos Equipados */}
        <div className="lg:col-span-1 bg-[#18140f] border border-[#785b20] rounded-xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#3d3119]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#f3d484] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#c59b27]" />
              Corpo & Armadura
            </h2>
            <span className="text-[11px] text-[#a88636]">Toque para desequipar</span>
          </div>

          {[
            { label: 'Arma Principal', slot: 'weapon' as keyof EquipmentSlots, item: character.equipment.weapon },
            { label: 'Armadura Peitoral', slot: 'armor' as keyof EquipmentSlots, item: character.equipment.armor },
            { label: 'Elmo de Batalha', slot: 'helmet' as keyof EquipmentSlots, item: character.equipment.helmet },
            { label: 'Botas de Ferro', slot: 'boots' as keyof EquipmentSlots, item: character.equipment.boots },
            { label: 'Acessório / Dragona', slot: 'accessory' as keyof EquipmentSlots, item: character.equipment.accessory },
            { label: 'Luvas de Placas', slot: 'gloves' as keyof EquipmentSlots, item: character.equipment.gloves },
          ].map(({ label, slot, item }) => (
            <div
              key={slot}
              className="bg-[#120f0b] border border-[#3d3119] rounded-lg p-2.5 flex items-center justify-between gap-3 hover:border-[#8e6e23] transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded bg-[#201910] border border-[#68501c] flex items-center justify-center text-lg shrink-0">
                  {item ? item.icon : '▫️'}
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase text-[#a88636] font-medium leading-none mb-1">{label}</div>
                  <div className="text-xs font-bold text-[#ede4d1] truncate">
                    {item ? item.name : <span className="text-[#6d5e49] italic">Vazio</span>}
                  </div>
                </div>
              </div>

              {item && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onUnequipItem(slot);
                  }}
                  className="px-2 py-1 bg-[#2a2114] hover:bg-[#382d1b] text-amber-300 text-[10px] font-semibold rounded border border-[#68501c] shrink-0"
                >
                  Desequipar
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Mochila e Itens Armazenados */}
        <div className="lg:col-span-2 bg-[#18140f] border border-[#785b20] rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#3d3119] mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#f3d484] flex items-center gap-2">
              <Backpack className="w-4 h-4 text-[#c59b27]" />
              Mochila de Viagem ({character.inventory.length} / 20 slots)
            </h2>
            <span className="text-xs text-[#a88636]">
              {selectedItem ? selectedItem.item.name : 'Nenhum item selecionado'}
            </span>
          </div>

          {character.inventory.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#a88636]">
              Sua mochila está vazia. Adquira itens no Bazar de Valéria ou complete missões nas montanhas!
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {character.inventory.map((item, index) => {
                const isSelected = selectedItem?.index === index;
                const isEquippable = item.type !== 'consumable';

                return (
                  <div
                    key={`${item.id}_${index}`}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedItem({ item, index });
                    }}
                    className={`p-3 bg-[#120f0b] border rounded-xl cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#c59b27] bg-[#221c14] shadow-[0_0_15px_rgba(197,155,39,0.25)]'
                        : 'border-[#3d3119] hover:border-[#785b20]'
                    }`}
                  >
                    <div>
                      <div className="w-12 h-12 rounded-lg bg-[#201910] border border-[#68501c] mx-auto flex items-center justify-center text-2xl shadow-inner mb-2">
                        {item.icon}
                      </div>

                      <div className="text-[10px] text-center uppercase font-bold text-[#a88636]">
                        {item.type}
                      </div>
                      <h4 className="text-xs font-bold text-center text-[#f3d484] truncate mt-0.5">
                        {item.name}
                      </h4>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#251e14] flex items-center justify-center gap-1">
                      {isEquippable ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            sounds.playSwordClash();
                            onEquipItem(item, index);
                          }}
                          className="w-full py-1 bg-[#8e6e23] hover:bg-[#a87c22] text-black font-bold text-[10px] rounded transition-colors"
                        >
                          Equipar
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            sounds.playHealSpell();
                            onUseItem(item, index);
                          }}
                          className="w-full py-1 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[10px] rounded transition-colors"
                        >
                          Usar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Card de Detalhes do Item da Mochila */}
          {selectedItem && (
            <div className="mt-6 p-4 bg-[#120f0b] border border-[#3d3119] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#201910] border border-[#8e6e23] flex items-center justify-center text-3xl shrink-0">
                  {selectedItem.item.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#f3d484]">{selectedItem.item.name}</h4>
                  <p className="text-xs text-[#bdae93] italic">{selectedItem.item.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {selectedItem.item.type === 'consumable' ? (
                  <button
                    onClick={() => {
                      sounds.playHealSpell();
                      onUseItem(selectedItem.item, selectedItem.index);
                    }}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg transition-colors"
                  >
                    Usar Poção Agora
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      sounds.playSwordClash();
                      if (selectedItem.index !== undefined) {
                        onEquipItem(selectedItem.item, selectedItem.index);
                      }
                    }}
                    className="px-4 py-2 bg-[#8e6e23] hover:bg-[#a87c22] text-black font-bold text-xs rounded-lg transition-colors"
                  >
                    Equipar no Herói
                  </button>
                )}

                {selectedItem.index !== undefined && (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onDiscardItem(selectedItem.index!);
                      setSelectedItem(null);
                    }}
                    title="Descartar Item"
                    className="p-2 bg-red-950/60 hover:bg-red-900 border border-red-700/60 text-red-300 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
