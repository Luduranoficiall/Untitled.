import React, { useState } from 'react';
import { Character, Item } from '../types/game';
import { ValeriaPortrait } from './Artwork';
import { ShoppingBag, Coins, Gem, Sparkles, Check, ArrowRightLeft, Shield, Swords, Info } from 'lucide-react';
import { sounds } from '../utils/audio';

interface BazaarViewProps {
  character: Character;
  bazaarItems: Item[];
  onBuyItem: (item: Item) => void;
  onSellItem: (itemIndex: number) => void;
}

export const BazaarView: React.FC<BazaarViewProps> = ({
  character,
  bazaarItems,
  onBuyItem,
  onSellItem,
}) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [selectedItem, setSelectedItem] = useState<Item | null>(bazaarItems[0] || null);

  const quotes = [
    'Bem-vindo ao meu humilde bazar, aventureiro! Cuidado por onde anda, sinto cheiro de perigo...',
    'Aço de Solis, gemas das profundezas e elixires proibidos... o que seus olhos cobiçam hoje?',
    'Uma lâmina afiada vale mais do que dez preces diante de uma besta faminta.',
    'Tenho itens que fariam até os arcanos da torre suspirarem de cobiça!',
  ];
  const [quoteIndex] = useState(() => Math.floor(Math.random() * quotes.length));

  return (
    <div className="space-y-6">
      {/* Banner da Loja de Valéria */}
      <div className="bg-[#18140f] border border-[#785b20] rounded-xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.7)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-950/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
          <ValeriaPortrait />

          <div className="flex-1 w-full text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3d3119] pb-3">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#a88636] font-semibold">Mercado & Antiquário</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f3d484] flex items-center justify-center sm:justify-start gap-2">
                  <ShoppingBag className="w-6 h-6 text-[#c59b27]" />
                  Bazar de Valéria
                </h1>
                <p className="text-xs sm:text-sm text-[#bdae93]">
                  Valéria, Mercadora Errante das Províncias do Sul
                </p>
              </div>

              {/* Saldo de Moedas do Jogador */}
              <div className="flex items-center justify-center sm:justify-end gap-3 shrink-0">
                <div className="px-3 py-1.5 bg-[#251e14] border border-[#8e6e23] rounded-lg flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="text-[10px] uppercase text-[#a88636]">Ouro</div>
                    <div className="text-sm font-bold text-amber-300 font-mono tabular-nums">
                      {character.gold}
                    </div>
                  </div>
                </div>

                <div className="px-3 py-1.5 bg-[#14232c] border border-cyan-700/60 rounded-lg flex items-center gap-2">
                  <Gem className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="text-[10px] uppercase text-cyan-400/80">Gemas</div>
                    <div className="text-sm font-bold text-cyan-300 font-mono tabular-nums">
                      {character.gems}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fala da Valéria */}
            <div className="mt-3 text-xs text-[#d6c4a8] italic bg-[#120f0b] border border-[#3d3119] p-3 rounded-lg leading-relaxed">
              "{quotes[quoteIndex]}"
            </div>
          </div>
        </div>
      </div>

      {/* Seletor de Modo: Comprar vs Vender */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-[#120f0b] border border-[#3d3119] rounded-lg">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('buy');
              setSelectedItem(bazaarItems[0] || null);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${
              activeTab === 'buy'
                ? 'bg-[#c59b27] text-black shadow'
                : 'text-[#a88636] hover:text-[#f3d484]'
            }`}
          >
            Comprar do Bazar
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('sell');
              setSelectedItem(character.inventory[0] || null);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${
              activeTab === 'sell'
                ? 'bg-[#c59b27] text-black shadow'
                : 'text-[#a88636] hover:text-[#f3d484]'
            }`}
          >
            Vender da Mochila ({character.inventory.length})
          </button>
        </div>

        <span className="text-xs text-[#a88636] hidden sm:block">
          Capacidade da Mochila: {character.inventory.length} / 20 slots
        </span>
      </div>

      {/* Grid com Catálogo de Itens e Painel de Inspeção */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Itens */}
        <div className="lg:col-span-2 space-y-3">
          {activeTab === 'buy' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bazaarItems.map((item) => {
                const canAfford = character.gold >= item.price;
                const isSelected = selectedItem?.id === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedItem(item);
                    }}
                    className={`p-3.5 bg-[#18140f] border rounded-xl cursor-pointer transition-all flex items-start gap-3 relative ${
                      isSelected
                        ? 'border-[#c59b27] bg-[#221c14] shadow-[0_0_15px_rgba(197,155,39,0.2)]'
                        : 'border-[#3d3119] hover:border-[#785b20]'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#120f0b] border border-[#68501c] flex items-center justify-center text-2xl shrink-0">
                      {item.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] uppercase font-bold text-[#a88636]">{item.rarity}</span>
                        <span className="text-xs font-bold text-amber-300 font-mono tabular-nums flex items-center gap-1">
                          <Coins className="w-3 h-3 text-amber-400" />
                          {item.price}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-[#f3d484] truncate">{item.name}</h4>
                      <p className="text-[11px] text-[#bdae93] line-clamp-1 mt-0.5">{item.description}</p>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-[10px] text-amber-400/90 font-medium truncate">
                          {item.stats?.attack && <span>+{item.stats.attack} ATQ </span>}
                          {item.stats?.defense && <span>+{item.stats.defense} DEF </span>}
                          {item.consumableEffect?.healHp && <span>+{item.consumableEffect.healHp} PV </span>}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (canAfford) {
                              sounds.playCoins();
                              onBuyItem(item);
                            }
                          }}
                          disabled={!canAfford}
                          className="px-2.5 py-1 bg-[#8e6e23] hover:bg-[#a87c22] disabled:opacity-40 disabled:pointer-events-none text-black font-bold text-[11px] rounded transition-colors"
                        >
                          {canAfford ? 'Comprar' : 'Sem Ouro'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>
              {character.inventory.length === 0 ? (
                <div className="p-8 text-center bg-[#18140f] border border-[#3d3119] rounded-xl text-xs text-[#a88636]">
                  Sua mochila está vazia no momento. Realize missões ou derrote monstros para obter itens!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {character.inventory.map((item, idx) => {
                    const sellPrice = Math.floor(item.price * 0.6);
                    const isSelected = selectedItem === item;

                    return (
                      <div
                        key={`${item.id}_${idx}`}
                        onClick={() => {
                          sounds.playClick();
                          setSelectedItem(item);
                        }}
                        className={`p-3.5 bg-[#18140f] border rounded-xl cursor-pointer transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'border-[#c59b27] bg-[#221c14]'
                            : 'border-[#3d3119] hover:border-[#785b20]'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-lg bg-[#120f0b] border border-[#68501c] flex items-center justify-center text-2xl shrink-0">
                          {item.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] uppercase font-bold text-[#a88636]">{item.rarity}</span>
                            <span className="text-xs font-bold text-amber-300 font-mono tabular-nums flex items-center gap-1">
                              <Coins className="w-3 h-3 text-amber-400" />
                              +{sellPrice}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-[#f3d484] truncate">{item.name}</h4>
                          <p className="text-[11px] text-[#bdae93] line-clamp-1 mt-0.5">{item.description}</p>

                          <div className="mt-2 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                sounds.playCoins();
                                onSellItem(idx);
                              }}
                              className="px-2.5 py-1 bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-600/50 font-bold text-[11px] rounded transition-colors"
                            >
                              Vender Item
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Detalhes do Item Selecionado */}
        <div className="lg:col-span-1 bg-[#18140f] border border-[#785b20] rounded-xl p-5 shadow-lg h-fit sticky top-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#3d3119] mb-4">
            <Info className="w-4 h-4 text-[#c59b27]" />
            <h3 className="text-sm font-bold text-[#f3d484] uppercase tracking-wider">
              Inspeção de Relíquia
            </h3>
          </div>

          {selectedItem ? (
            <div className="space-y-4">
              <div className="w-20 h-20 rounded-xl bg-[#120f0b] border-2 border-[#8e6e23] mx-auto flex items-center justify-center text-4xl shadow-inner">
                {selectedItem.icon}
              </div>

              <div className="text-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#a88636] block">
                  {selectedItem.type} · {selectedItem.rarity}
                </span>
                <h4 className="text-lg font-bold text-[#f3d484]">{selectedItem.name}</h4>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-amber-300 font-mono text-sm font-bold flex items-center gap-1">
                    <Coins className="w-4 h-4 text-amber-400" />
                    {activeTab === 'buy' ? `${selectedItem.price} Moedas` : `${Math.floor(selectedItem.price * 0.6)} Moedas (Venda)`}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#c4b59d] italic leading-relaxed bg-[#120f0b] p-3 rounded-lg border border-[#3d3119]">
                "{selectedItem.description}"
              </p>

              {/* Bônus de Atributos */}
              <div className="space-y-2 bg-[#120f0b] p-3 rounded-lg border border-[#3d3119] text-xs">
                <div className="text-[10px] uppercase font-bold text-[#a88636] border-b border-[#251e14] pb-1">
                  Efeitos & Bônus de Status
                </div>
                {selectedItem.stats?.attack && (
                  <div className="flex justify-between text-amber-300">
                    <span>Poder de Ataque:</span>
                    <span className="font-mono font-bold">+{selectedItem.stats.attack}</span>
                  </div>
                )}
                {selectedItem.stats?.defense && (
                  <div className="flex justify-between text-emerald-300">
                    <span>Defesa Física:</span>
                    <span className="font-mono font-bold">+{selectedItem.stats.defense}</span>
                  </div>
                )}
                {selectedItem.stats?.str && (
                  <div className="flex justify-between text-amber-200">
                    <span>Força Sagrada:</span>
                    <span className="font-mono font-bold">+{selectedItem.stats.str}</span>
                  </div>
                )}
                {selectedItem.stats?.con && (
                  <div className="flex justify-between text-amber-200">
                    <span>Constituição:</span>
                    <span className="font-mono font-bold">+{selectedItem.stats.con}</span>
                  </div>
                )}
                {selectedItem.stats?.wis && (
                  <div className="flex justify-between text-cyan-300">
                    <span>Sabedoria Divina:</span>
                    <span className="font-mono font-bold">+{selectedItem.stats.wis}</span>
                  </div>
                )}
                {selectedItem.consumableEffect?.healHp && (
                  <div className="flex justify-between text-red-300">
                    <span>Restauração de Vida:</span>
                    <span className="font-mono font-bold">+{selectedItem.consumableEffect.healHp} PV</span>
                  </div>
                )}
                {selectedItem.consumableEffect?.cureBleed && (
                  <div className="text-emerald-400 text-[11px]">
                    ✓ Estanca Hemorragia Severa
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-xs text-[#a88636] text-center py-8">
              Selecione um item para ver detalhes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
